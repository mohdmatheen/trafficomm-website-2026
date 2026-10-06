import { expect, test } from "@playwright/test";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "../lib/db/migrate";
import type { Queryable } from "../lib/db/client";
import {
  changeLeadStatus,
  getDispatches,
  getLead,
  getLeadHistory,
  hashEmail,
  insertLead,
  listLeads,
  reserveDispatch,
  type NewLead,
} from "../lib/leads/store";
import { ALLOWED_TRANSITIONS, canTransition, LEAD_STATUSES, type LeadStatus } from "../lib/leads/types";

/**
 * The lead store, against real Postgres.
 *
 * PGlite is Postgres compiled to WASM, so the DDL, the transactions and — the
 * reason this matters — the UNIQUE (lead_id, conversion_type) constraint are the
 * genuine article. A mocked database would have asserted that the code calls
 * INSERT, which is not the claim being made. The claim is that the database
 * refuses a second conversion, and only a database can be made to demonstrate it.
 *
 * Pinned to one project. None of this touches a browser or a viewport, so running
 * it once per width would start six WASM Postgres instances per test for no added
 * coverage — which is exactly what it did, and the contention timed out unrelated
 * browser tests elsewhere in the run. Serial for the same reason: each test owns a
 * database, and four at once is four Postgres instances competing with Chrome.
 */
test.describe.configure({ mode: "serial" });

async function freshDb(): Promise<{ conn: Queryable; close: () => Promise<void> }> {
  const pg = new PGlite();
  const conn: Queryable = {
    async query<T>(text: string, params: readonly unknown[] = []) {
      const res = await pg.query(text, params as unknown[]);
      return res.rows as T[];
    },
  };
  await migrate(conn);
  return { conn, close: () => pg.close() };
}

const sample = (over: Partial<NewLead> = {}): NewLead => ({
  source: "website_assessment",
  email: "Ops.Lead@Meridian-Media.ae",
  submittedAt: new Date("2026-10-01T09:00:00Z").toISOString(),
  company: "Meridian Media",
  firstName: "Sara",
  requirement: "Reporting is eating the team",
  campaignVolume: "50–100",
  ...over,
});

test.describe("schema and migrations", () => {
  test("migrations apply once and are idempotent", async () => {
    const { conn, close } = await freshDb();
    const second = await migrate(conn);
    expect(second, "a second run must apply nothing").toEqual([]);
    const tables = await conn.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`,
    );
    const names = tables.map((t) => t.table_name);
    expect(names).toContain("leads");
    expect(names).toContain("lead_status_history");
    expect(names).toContain("linkedin_conversion_dispatch");
    await close();
  });

  test("an unrecognised source or status is refused by the database, not just the type system", async () => {
    const { conn, close } = await freshDb();
    await expect(
      conn.query(`INSERT INTO leads (source, email, email_sha256, submitted_at) VALUES ('carrier_pigeon','a@b.co','x', now())`),
    ).rejects.toThrow();
    await expect(
      conn.query(`INSERT INTO leads (source, email, email_sha256, submitted_at, status) VALUES ('website_labs','a@b.co','x', now(), 'MAYBE')`),
    ).rejects.toThrow();
    await close();
  });
});

test.describe("lead persistence", () => {
  test("a website lead persists, defaults to NEW and opens its own history", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    expect(lead).not.toBeNull();
    expect(lead!.status).toBe("NEW");
    expect(lead!.qualifiedAt).toBeNull();
    expect(lead!.isTestLead).toBe(false);

    const history = await getLeadHistory(lead!.id, conn);
    expect(history).toHaveLength(1);
    expect(history[0].fromStatus).toBeNull();
    expect(history[0].toStatus).toBe("NEW");
    await close();
  });

  test("email is hashed to LinkedIn's rule: lowercased, trimmed, sha256 hex", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample({ email: "  Ops.Lead@Meridian-Media.ae " }), conn);
    const rows = await conn.query<{ email_sha256: string }>(`SELECT email_sha256 FROM leads WHERE id = $1`, [lead!.id]);
    expect(rows[0].email_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(rows[0].email_sha256).toBe(hashEmail("ops.lead@meridian-media.ae"));
    await close();
  });

  test("all three website sources persist and are listed newest first", async () => {
    const { conn, close } = await freshDb();
    await insertLead(sample({ source: "website_assessment", submittedAt: "2026-10-01T09:00:00Z" }), conn);
    await insertLead(sample({ source: "website_call", email: "a@b.co", submittedAt: "2026-10-02T09:00:00Z" }), conn);
    await insertLead(sample({ source: "website_labs", email: "c@d.co", submittedAt: "2026-10-03T09:00:00Z" }), conn);
    const all = await listLeads(conn);
    expect(all).toHaveLength(3);
    expect(all.map((l) => l.source)).toEqual(["website_labs", "website_call", "website_assessment"]);
    await close();
  });

  test("the same LinkedIn lead delivered twice produces one lead", async () => {
    const { conn, close } = await freshDb();
    const first = await insertLead(
      sample({ source: "linkedin_leadgen", externalLeadId: "aaaa-1111", leadUrn: "urn:li:leadGenFormResponse:aaaa-1111" }),
      conn,
    );
    // Webhook first, backfill poll second — the case Lead Sync will actually produce.
    const second = await insertLead(
      sample({ source: "linkedin_leadgen", externalLeadId: "aaaa-1111", leadUrn: "urn:li:leadGenFormResponse:aaaa-1111" }),
      conn,
    );
    expect(second!.id).toBe(first!.id);
    expect(await listLeads(conn)).toHaveLength(1);
    await close();
  });

  test("website leads do not collide on a null external id", async () => {
    const { conn, close } = await freshDb();
    await insertLead(sample({ email: "one@agency.ae" }), conn);
    await insertLead(sample({ email: "two@agency.ae" }), conn);
    expect(await listLeads(conn)).toHaveLength(2);
    await close();
  });

  test("attribution round-trips, and absent values stay absent", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(
      sample({
        attribution: {
          liFatId: "abc123XYZ",
          utmSource: "linkedin",
          utmMedium: "paid_social",
          utmCampaign: "uae-adops-q4",
          utmContent: "carousel-a",
          utmTerm: null,
          referrer: "https://www.linkedin.com/",
          landingPath: "/ad-operations-outsourcing",
          firstTouchAt: "2026-10-01T08:30:00.000Z",
        },
      }),
      conn,
    );
    expect(lead!.liFatId).toBe("abc123XYZ");
    expect(lead!.utmCampaign).toBe("uae-adops-q4");
    expect(lead!.landingPath).toBe("/ad-operations-outsourcing");
    expect(lead!.utmTerm, "a term that was never supplied must stay null").toBeNull();

    const organic = await insertLead(sample({ email: "organic@agency.ae" }), conn);
    expect(organic!.liFatId, "no li_fat_id may be invented").toBeNull();
    expect(organic!.utmSource).toBeNull();
    expect(organic!.campaignUrn, "a website lead cannot know a campaign URN").toBeNull();
    await close();
  });
});

test.describe("lifecycle", () => {
  test("the full happy path walks NEW to WON, appending history at every step", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    const path: LeadStatus[] = ["CONTACTED", "QUALIFIED", "OPPORTUNITY", "PROPOSAL", "WON"];
    for (const next of path) {
      const res = await changeLeadStatus(lead!.id, next, "ops@trafficomm.com", undefined, conn);
      expect(res.ok, `transition to ${next}`).toBe(true);
    }
    const history = await getLeadHistory(lead!.id, conn);
    expect(history.map((h) => h.toStatus)).toEqual(["NEW", ...path]);
    expect((await getLead(lead!.id, conn))!.status).toBe("WON");
    await close();
  });

  test("PROPOSAL can also go to LOST", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    for (const s of ["CONTACTED", "QUALIFIED", "OPPORTUNITY", "PROPOSAL"] as LeadStatus[]) {
      await changeLeadStatus(lead!.id, s, "ops@trafficomm.com", undefined, conn);
    }
    expect((await changeLeadStatus(lead!.id, "LOST", "ops@trafficomm.com", undefined, conn)).ok).toBe(true);
    await close();
  });

  test("NEW and CONTACTED can be marked INVALID", async () => {
    const { conn, close } = await freshDb();
    const a = await insertLead(sample({ email: "a@x.co" }), conn);
    expect((await changeLeadStatus(a!.id, "INVALID", "ops@trafficomm.com", "Student enquiry", conn)).ok).toBe(true);

    const b = await insertLead(sample({ email: "b@x.co" }), conn);
    await changeLeadStatus(b!.id, "CONTACTED", "ops@trafficomm.com", undefined, conn);
    expect((await changeLeadStatus(b!.id, "INVALID", "ops@trafficomm.com", undefined, conn)).ok).toBe(true);
    await close();
  });

  test("illegal transitions are refused server-side", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    // NEW cannot jump straight to a late pipeline stage.
    for (const bad of ["OPPORTUNITY", "PROPOSAL", "WON", "LOST"] as LeadStatus[]) {
      const res = await changeLeadStatus(lead!.id, bad, "ops@trafficomm.com", undefined, conn);
      expect(res.ok, `NEW -> ${bad} must be refused`).toBe(false);
      if (!res.ok) expect(res.reason).toBe("illegal_transition");
    }
    expect((await getLead(lead!.id, conn))!.status).toBe("NEW");
    await close();
  });

  test("terminal statuses are terminal", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    await changeLeadStatus(lead!.id, "INVALID", "ops@trafficomm.com", undefined, conn);
    for (const s of LEAD_STATUSES) {
      const res = await changeLeadStatus(lead!.id, s, "ops@trafficomm.com", undefined, conn);
      expect(res.ok, `INVALID -> ${s} must be refused`).toBe(false);
    }
    await close();
  });

  test("history survives later status changes", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    await changeLeadStatus(lead!.id, "CONTACTED", "a@trafficomm.com", "Called", conn);
    await changeLeadStatus(lead!.id, "QUALIFIED", "b@trafficomm.com", "Real agency, real need", conn);
    await changeLeadStatus(lead!.id, "OPPORTUNITY", "c@trafficomm.com", undefined, conn);
    const history = await getLeadHistory(lead!.id, conn);
    expect(history).toHaveLength(4);
    expect(history[2].note).toBe("Real agency, real need");
    expect(history[2].changedBy).toBe("b@trafficomm.com");
    // The qualification moment is still readable after the lead has moved on.
    expect(history.find((h) => h.toStatus === "QUALIFIED")).toBeTruthy();
    await close();
  });

  test("the transition map has no unreachable or self-referential state", () => {
    for (const from of LEAD_STATUSES) {
      for (const to of ALLOWED_TRANSITIONS[from]) {
        expect(from, "a status may not transition to itself").not.toBe(to);
        expect(LEAD_STATUSES).toContain(to);
      }
    }
    expect(canTransition("NEW", "QUALIFIED")).toBe(true);
    expect(canTransition("WON", "LOST")).toBe(false);
  });
});

test.describe("qualified_at", () => {
  test("is stamped when qualification happens, not when the form was submitted", async () => {
    const { conn, close } = await freshDb();
    const submitted = "2026-09-01T09:00:00.000Z";
    const lead = await insertLead(sample({ submittedAt: submitted }), conn);
    expect(lead!.qualifiedAt).toBeNull();

    const res = await changeLeadStatus(lead!.id, "QUALIFIED", "ops@trafficomm.com", undefined, conn);
    expect(res.ok).toBe(true);
    const after = await getLead(lead!.id, conn);
    expect(after!.qualifiedAt).not.toBeNull();
    // This is the value LinkedIn's conversionHappenedAt must carry, and it is
    // emphatically not the submission time.
    expect(new Date(after!.qualifiedAt!).getTime()).toBeGreaterThan(new Date(submitted).getTime());
    expect(after!.submittedAt).toBe(new Date(submitted).toISOString());
    await close();
  });
});

test.describe("LinkedIn dispatch idempotency", () => {
  test("qualifying creates exactly one dispatch row", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    const res = await changeLeadStatus(lead!.id, "QUALIFIED", "ops@trafficomm.com", undefined, conn);
    expect(res.ok && res.dispatchCreated).toBe(true);

    const rows = await getDispatches(lead!.id, conn);
    expect(rows).toHaveLength(1);
    expect(rows[0].conversion_type).toBe("QUALIFIED_LEAD");
    expect(rows[0].state).toBe("pending");
    expect(rows[0].attempts).toBe(0);
    expect(String(rows[0].event_id)).toMatch(/^[0-9a-f-]{36}$/);
    await close();
  });

  test("the database refuses a second dispatch of the same type, whatever the application does", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    await changeLeadStatus(lead!.id, "QUALIFIED", "ops@trafficomm.com", undefined, conn);

    // A raw insert, bypassing every application guard — the constraint must hold.
    await expect(
      conn.query(`INSERT INTO linkedin_conversion_dispatch (lead_id, conversion_type) VALUES ($1,'QUALIFIED_LEAD')`, [lead!.id]),
    ).rejects.toThrow();

    expect(await getDispatches(lead!.id, conn)).toHaveLength(1);
    await close();
  });

  test("repeated qualification attempts never add a second row or change the event id", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    await changeLeadStatus(lead!.id, "QUALIFIED", "ops@trafficomm.com", undefined, conn);
    const eventId = String((await getDispatches(lead!.id, conn))[0].event_id);

    // The double click, the stale tab, the re-save: all refused as transitions,
    // and in any case incapable of creating a second reservation.
    for (let i = 0; i < 5; i++) {
      await changeLeadStatus(lead!.id, "QUALIFIED", "ops@trafficomm.com", undefined, conn);
      expect(await reserveDispatch(lead!.id, "QUALIFIED_LEAD", conn), "reservation must be refused").toBe(false);
    }
    const rows = await getDispatches(lead!.id, conn);
    expect(rows).toHaveLength(1);
    expect(String(rows[0].event_id), "a retry must reuse the persisted event id").toBe(eventId);
    await close();
  });

  test("an INVALID lead creates no qualified-lead dispatch, ever", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    const res = await changeLeadStatus(lead!.id, "INVALID", "ops@trafficomm.com", "Not an agency", conn);
    expect(res.ok).toBe(true);
    expect(await getDispatches(lead!.id, conn)).toHaveLength(0);

    // And it stays stored, with its attribution and history intact.
    const after = await getLead(lead!.id, conn);
    expect(after!.status).toBe("INVALID");
    expect(await getLeadHistory(lead!.id, conn)).toHaveLength(2);
    await close();
  });

  test("LEAD and QUALIFIED_LEAD are separate reservations on the same lead", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    expect(await reserveDispatch(lead!.id, "LEAD", conn)).toBe(true);
    expect(await reserveDispatch(lead!.id, "LEAD", conn), "but only once each").toBe(false);
    await changeLeadStatus(lead!.id, "QUALIFIED", "ops@trafficomm.com", undefined, conn);
    const rows = await getDispatches(lead!.id, conn);
    expect(rows).toHaveLength(2);
    expect(new Set(rows.map((r) => r.conversion_type))).toEqual(new Set(["LEAD", "QUALIFIED_LEAD"]));
    // Two different conversions, two different event ids.
    expect(String(rows[0].event_id)).not.toBe(String(rows[1].event_id));
    await close();
  });

  test("an unknown conversion type is refused", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    await expect(
      conn.query(`INSERT INTO linkedin_conversion_dispatch (lead_id, conversion_type) VALUES ($1,'MADE_UP')`, [lead!.id]),
    ).rejects.toThrow();
    await close();
  });

  test("no dispatch row is ever created in a state that implies it was sent", async () => {
    const { conn, close } = await freshDb();
    const lead = await insertLead(sample(), conn);
    await changeLeadStatus(lead!.id, "QUALIFIED", "ops@trafficomm.com", undefined, conn);
    const rows = await getDispatches(lead!.id, conn);
    expect(rows[0].sent_at, "nothing has been sent to LinkedIn in this phase").toBeNull();
    expect(rows[0].last_attempt_at).toBeNull();
    expect(rows[0].state).toBe("pending");
    await close();
  });
});

test.describe("graceful degradation", () => {
  test("every store function tolerates no database at all", async () => {
    // A developer with no DATABASE_URL must still be able to run the site.
    expect(await insertLead(sample(), undefined as never)).toBeNull();
  });
});

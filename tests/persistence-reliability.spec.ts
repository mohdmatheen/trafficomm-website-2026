import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "../lib/db/migrate";
import type { Queryable } from "../lib/db/client";
import { deriveIdempotencyKey, persistWithRetry, submissionRef } from "../lib/leads/persist";
import { getLead, insertLead, listLeads, type NewLead } from "../lib/leads/store";

/**
 * Persistence reliability.
 *
 * The behaviour being pinned is the one that used to fail silently: a lead that
 * was delivered to the inbox and then lost on the way to the database. These
 * cover the failure, the retry, the recovery, and the two properties that make
 * repeating any of it safe — one key, one row.
 */

test.describe.configure({ mode: "serial" });

async function freshDb() {
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

/** Fails the first `n` calls, then behaves. Models a Neon blip, not a bug. */
function flaky(conn: Queryable, n: number): { conn: Queryable; calls: () => number } {
  let failures = 0;
  let calls = 0;
  return {
    conn: {
      async query<T>(text: string, params?: readonly unknown[]) {
        calls++;
        if (failures < n && /INSERT INTO leads/i.test(text)) {
          failures++;
          throw new Error("connection terminated unexpectedly");
        }
        return conn.query<T>(text, params);
      },
    },
    calls: () => calls,
  };
}

const lead = (over: Partial<NewLead> = {}): NewLead => ({
  source: "website_assessment",
  email: "Ops.Lead@Meridian-Media.ae",
  submittedAt: "2026-10-06T09:00:00.000Z",
  idempotencyKey: "sub:11111111-1111-4111-8111-111111111111",
  company: "Meridian Media",
  firstName: "Sara",
  ...over,
});

test("1. normal delivery and persistence succeeds on the first attempt", async () => {
  const { conn, close } = await freshDb();
  const out = await persistWithRetry(lead(), conn);
  expect(out.ok).toBe(true);
  if (out.ok) {
    expect(out.persisted).toBe(true);
    expect(out.attempts, "no retry should have been needed").toBe(1);
  }
  const all = await listLeads(conn);
  expect(all).toHaveLength(1);
  expect(all[0].deliveryState).toBe("delivered");
  expect(all[0].status).toBe("NEW");
  await close();
});

test("2. delivery succeeded but the first persistence attempt fails — the retry saves it", async () => {
  const { conn, close } = await freshDb();
  const f = flaky(conn, 1);
  const out = await persistWithRetry(lead(), f.conn);
  expect(out.ok, "a transient failure must not lose the lead").toBe(true);
  if (out.ok) expect(out.attempts).toBe(2);
  expect(await listLeads(conn)).toHaveLength(1);
  await close();
});

test("2b. a sustained outage exhausts the retries and reports a reference, not a lead", async () => {
  const { conn, close } = await freshDb();
  const f = flaky(conn, 99);
  const out = await persistWithRetry(lead(), f.conn);
  expect(out.ok).toBe(false);
  if (!out.ok) {
    expect(out.attempts, "four attempts across the backoff schedule").toBe(4);
    expect(out.ref).toMatch(/^[a-f0-9]{12}$/);
  }
  expect(await listLeads(conn), "nothing was written").toHaveLength(0);
  await close();
});

test("3. the lead can subsequently be recovered from the delivered payload", async () => {
  const { conn, close } = await freshDb();
  const key = "sub:22222222-2222-4222-8222-222222222222";
  // The outage: delivered, never persisted.
  const failed = await persistWithRetry(lead({ idempotencyKey: key }), flaky(conn, 99).conn);
  expect(failed.ok).toBe(false);
  expect(await listLeads(conn)).toHaveLength(0);

  // Recovery, carrying the same key the webhook payload held.
  const recovered = await insertLead(lead({ idempotencyKey: key, deliveryState: "recovered" }), conn);
  expect(recovered).not.toBeNull();
  expect(recovered!.deliveryState).toBe("recovered");
  const all = await listLeads(conn);
  expect(all).toHaveLength(1);
  expect(all[0].idempotencyKey).toBe(key);
  await close();
});

test("4. the recovery route cannot send a notification — it cannot reach a sender", () => {
  // Structural, not behavioural. The guarantee is that this module has no path to
  // the email or webhook code, so no future edit can accidentally re-notify from
  // the recovery path without first adding an import that this test would fail on.
  const raw = readFileSync("app/api/admin/leads/recover/route.ts", "utf8");
  // Comments stripped: the claim is about what the code can reach, and a doc
  // comment that mentions the webhook by name is documentation, not a path to it.
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  expect(src).not.toMatch(/assessment-email/);
  expect(src).not.toMatch(/sendEmail|sendAssessmentEmail|buildAssessmentEmail|buildLabsLeadEmail/);
  expect(src).not.toMatch(/postWebhook|ASSESSMENT_WEBHOOK_URL/);
  // And it does not reach the network at all.
  expect(src).not.toMatch(/\bfetch\s*\(/);
});

test("5. recovery cannot create a duplicate lead", async () => {
  const { conn, close } = await freshDb();
  const key = "sub:33333333-3333-4333-8333-333333333333";
  // This time persistence actually worked; the operator recovers anyway, not
  // knowing that. The key is the same, so nothing is duplicated.
  await persistWithRetry(lead({ idempotencyKey: key }), conn);
  const again = await insertLead(lead({ idempotencyKey: key, deliveryState: "recovered" }), conn);
  expect(again).not.toBeNull();
  expect(again!.deliveryState, "the original row is returned, not overwritten").toBe("delivered");
  expect(await listLeads(conn)).toHaveLength(1);
  await close();
});

test("6. repeated recovery is idempotent", async () => {
  const { conn, close } = await freshDb();
  const key = "sub:44444444-4444-4444-8444-444444444444";
  const ids = new Set<string>();
  for (let i = 0; i < 5; i++) {
    const row = await insertLead(lead({ idempotencyKey: key, deliveryState: "recovered" }), conn);
    ids.add(row!.id);
  }
  expect(ids.size, "every call resolves to the same lead").toBe(1);
  expect(await listLeads(conn)).toHaveLength(1);
  await close();
});

test("6b. the database refuses a duplicate key even when the application does not ask it to", async () => {
  const { conn, close } = await freshDb();
  const row = await insertLead(lead({ idempotencyKey: "sub:55555555-5555-4555-8555-555555555555" }), conn);
  expect(row).not.toBeNull();
  await expect(
    conn.query(
      `INSERT INTO leads (source, email, email_sha256, submitted_at, idempotency_key)
       VALUES ('website_call','x@y.co','deadbeef', now(), 'sub:55555555-5555-4555-8555-555555555555')`,
    ),
  ).rejects.toThrow();
  expect(await listLeads(conn)).toHaveLength(1);
  await close();
});

test("7. failure observability carries a reference and no personal data", async () => {
  const { conn, close } = await freshDb();
  const logs: string[] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => void logs.push(args.map(String).join(" "));
  try {
    await persistWithRetry(
      lead({ email: "sara.haddad@meridian-media.ae", firstName: "Sara Haddad", company: "Meridian Media Group" }),
      flaky(conn, 99).conn,
    );
  } finally {
    console.error = original;
  }

  expect(logs.length, "a failure must be observable at all").toBeGreaterThan(0);
  const all = logs.join("\n");
  for (const secret of ["sara.haddad@meridian-media.ae", "Sara Haddad", "Meridian Media Group", "meridian-media"]) {
    expect(all, `"${secret}" must not appear in logs`).not.toContain(secret);
  }
  // What it does carry: a stable reference and a coarse error class.
  expect(all).toMatch(/ref=[a-f0-9]{12}/);
  expect(all).toMatch(/source=website_assessment/);
  expect(all).toMatch(/attempts/);
  await close();
});

test.describe("idempotency key derivation", () => {
  test("a browser submission id wins, and is stable across retries", () => {
    const base = { source: "website_assessment", email: "a@b.co", company: "B", submittedAt: "2026-10-06T09:00:00.000Z" };
    const id = "11111111-1111-4111-8111-111111111111";
    expect(deriveIdempotencyKey({ ...base, submissionId: id })).toBe(`sub:${id}`);
    // The same form, submitted twice, a minute apart.
    expect(deriveIdempotencyKey({ ...base, submissionId: id, submittedAt: "2026-10-06T09:01:00.000Z" })).toBe(`sub:${id}`);
  });

  test("a LinkedIn lead id is used when there is no browser id", () => {
    expect(
      deriveIdempotencyKey({ source: "linkedin_leadgen", email: "a@b.co", submittedAt: "2026-10-06T09:00:00.000Z", externalLeadId: "aaaa-1" }),
    ).toBe("li:aaaa-1");
  });

  test("without either, identical submissions in the same minute collapse and later ones do not", () => {
    const base = { source: "website_assessment", email: "A@B.co", company: "B" };
    const a = deriveIdempotencyKey({ ...base, submittedAt: "2026-10-06T09:00:10.000Z" });
    const b = deriveIdempotencyKey({ ...base, submittedAt: "2026-10-06T09:00:55.000Z" });
    const later = deriveIdempotencyKey({ ...base, submittedAt: "2026-10-06T10:30:00.000Z" });
    expect(a).toBe(b);
    expect(later, "a genuine second enquiry is a second lead").not.toBe(a);
    // Case and whitespace in the address must not produce a different key.
    expect(deriveIdempotencyKey({ ...base, email: " a@b.CO ", submittedAt: "2026-10-06T09:00:10.000Z" })).toBe(a);
  });

  test("a malformed submission id is ignored rather than trusted", () => {
    const key = deriveIdempotencyKey({
      source: "website_assessment",
      email: "a@b.co",
      submittedAt: "2026-10-06T09:00:00.000Z",
      submissionId: "'; DROP TABLE leads; --",
    });
    expect(key.startsWith("h:")).toBe(true);
  });

  test("the submission reference is stable and discloses nothing", () => {
    const key = "sub:11111111-1111-4111-8111-111111111111";
    expect(submissionRef(key)).toBe(submissionRef(key));
    expect(submissionRef(key)).toMatch(/^[a-f0-9]{12}$/);
    expect(submissionRef(key)).not.toContain("1111");
  });
});

test("recovered leads are findable, so a near-miss is visible", async () => {
  const { conn, close } = await freshDb();
  await insertLead(lead({ idempotencyKey: "a" }), conn);
  await insertLead(lead({ idempotencyKey: "b", email: "x@y.co", deliveryState: "recovered" }), conn);
  const rows = await conn.query<{ n: string }>(`SELECT count(*) n FROM leads WHERE delivery_state = 'recovered'`);
  expect(Number(rows[0].n)).toBe(1);
  const got = await getLead((await listLeads(conn)).find((l) => l.email === "x@y.co")!.id, conn);
  expect(got!.deliveryState).toBe("recovered");
  await close();
});

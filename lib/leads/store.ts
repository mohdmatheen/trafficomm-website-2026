import { createHash } from "node:crypto";
import { db, type Queryable } from "@/lib/db/client";
import {
  canTransition,
  type ConversionType,
  type Lead,
  type LeadSource,
  type LeadStatus,
  type LeadStatusChange,
} from "./types";

/**
 * Lead persistence.
 *
 * Every function takes an optional `Queryable` so the test suite can drive the
 * same code against PGlite. In production the argument is omitted and `db()`
 * resolves the Neon client.
 *
 * Writes never throw at the call site in the request path — see `recordLead`.
 * Reads and status changes do throw, because those run behind authentication
 * where a silent failure would be worse than an error page.
 */

/** LinkedIn's rule: lowercase, strip whitespace, SHA-256, hex. Computed once, on write. */
export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase().replace(/\s+/g, "")).digest("hex");
}

export type NewLead = {
  source: LeadSource;
  email: string;
  submittedAt: string;
  /**
   * Makes every write path converge on one row. Derived by `deriveIdempotencyKey`
   * and carried through the webhook payload so a recovery hours later produces
   * the same key as the original attempt would have.
   */
  idempotencyKey: string;
  /** `recovered` marks a lead the database nearly lost. Default is the normal path. */
  deliveryState?: "delivered" | "recovered";
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  countryCode?: string | null;
  requirement?: string | null;
  campaignVolume?: string | null;
  externalLeadId?: string | null;
  leadUrn?: string | null;
  campaignUrn?: string | null;
  creativeUrn?: string | null;
  formUrn?: string | null;
  isTestLead?: boolean;
  attribution?: {
    liFatId?: string | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmContent?: string | null;
    utmTerm?: string | null;
    referrer?: string | null;
    landingPath?: string | null;
    firstTouchAt?: string | null;
  } | null;
};

const COLUMNS = `
  id, source, external_lead_id, lead_urn, idempotency_key, delivery_state, first_name, last_name, email,
  company, job_title, country_code, li_fat_id,
  utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  referrer, landing_path, first_touch_at,
  campaign_urn, creative_urn, form_urn,
  requirement, campaign_volume, is_test_lead, status,
  submitted_at, qualified_at, created_at, updated_at
`;

type Row = Record<string, unknown>;

const str = (v: unknown): string | null => (v === null || v === undefined ? null : String(v));
const iso = (v: unknown): string | null => (v instanceof Date ? v.toISOString() : v === null || v === undefined ? null : String(v));

function toLead(r: Row): Lead {
  return {
    id: String(r.id),
    source: r.source as LeadSource,
    externalLeadId: str(r.external_lead_id),
    leadUrn: str(r.lead_urn),
    idempotencyKey: String(r.idempotency_key),
    deliveryState: (r.delivery_state as Lead["deliveryState"]) ?? "delivered",
    firstName: str(r.first_name),
    lastName: str(r.last_name),
    email: String(r.email),
    company: str(r.company),
    jobTitle: str(r.job_title),
    countryCode: str(r.country_code),
    liFatId: str(r.li_fat_id),
    utmSource: str(r.utm_source),
    utmMedium: str(r.utm_medium),
    utmCampaign: str(r.utm_campaign),
    utmContent: str(r.utm_content),
    utmTerm: str(r.utm_term),
    referrer: str(r.referrer),
    landingPath: str(r.landing_path),
    firstTouchAt: iso(r.first_touch_at),
    campaignUrn: str(r.campaign_urn),
    creativeUrn: str(r.creative_urn),
    formUrn: str(r.form_urn),
    requirement: str(r.requirement),
    campaignVolume: str(r.campaign_volume),
    isTestLead: Boolean(r.is_test_lead),
    status: r.status as LeadStatus,
    submittedAt: iso(r.submitted_at)!,
    qualifiedAt: iso(r.qualified_at),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
  };
}

/**
 * Inserts a lead.
 *
 * `ON CONFLICT DO NOTHING` against the partial unique index on
 * `external_lead_id` is what makes LinkedIn ingestion idempotent later: the
 * webhook and the backfill poll can both deliver the same submission and the
 * second one returns the row that already exists rather than creating a twin.
 */
export async function insertLead(lead: NewLead, conn?: Queryable): Promise<Lead | null> {
  const c = conn ?? db();
  if (!c) return null;
  const a = lead.attribution ?? {};
  const rows = await c.query<Row>(
    `INSERT INTO leads (
       source, external_lead_id, lead_urn, idempotency_key, delivery_state,
       first_name, last_name, email, email_sha256,
       company, job_title, country_code, li_fat_id,
       utm_source, utm_medium, utm_campaign, utm_content, utm_term,
       referrer, landing_path, first_touch_at,
       campaign_urn, creative_urn, form_urn,
       requirement, campaign_volume, is_test_lead, submitted_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
     ON CONFLICT (idempotency_key) DO NOTHING
     RETURNING ${COLUMNS}`,
    [
      lead.source,
      lead.externalLeadId ?? null,
      lead.leadUrn ?? null,
      lead.idempotencyKey,
      lead.deliveryState ?? "delivered",
      lead.firstName ?? null,
      lead.lastName ?? null,
      lead.email,
      hashEmail(lead.email),
      lead.company ?? null,
      lead.jobTitle ?? null,
      lead.countryCode ?? null,
      a.liFatId ?? null,
      a.utmSource ?? null,
      a.utmMedium ?? null,
      a.utmCampaign ?? null,
      a.utmContent ?? null,
      a.utmTerm ?? null,
      a.referrer ?? null,
      a.landingPath ?? null,
      a.firstTouchAt ?? null,
      lead.campaignUrn ?? null,
      lead.creativeUrn ?? null,
      lead.formUrn ?? null,
      lead.requirement ?? null,
      lead.campaignVolume ?? null,
      lead.isTestLead ?? false,
      lead.submittedAt,
    ],
  );
  if (!rows.length) {
    // Already ingested — a user retry, a webhook redelivered, or a recovery call
    // for a lead that turned out to have persisted after all. Return the row that
    // exists so every caller sees exactly one lead.
    const existing = await c.query<Row>(`SELECT ${COLUMNS} FROM leads WHERE idempotency_key = $1`, [lead.idempotencyKey]);
    return existing.length ? toLead(existing[0]) : null;
  }
  const row = toLead(rows[0]);
  await c.query(`INSERT INTO lead_status_history (lead_id, from_status, to_status, changed_by, note) VALUES ($1,NULL,$2,$3,$4)`, [
    row.id,
    row.status,
    "system",
    "Lead received",
  ]);
  return row;
}

/**
 * Persistence for the request path.
 *
 * Deliberately swallows its own failure. Delivery to the inbox has already
 * happened by the time this runs, so a database outage must cost us a row in a
 * table, not a lead in a business — returning an error here would tell a real
 * prospect their enquiry failed when it is already in Trafficomm's inbox.
 * The failure is logged without the lead's details.
 */
export async function recordLead(lead: NewLead, conn?: Queryable): Promise<Lead | null> {
  try {
    return await insertLead(lead, conn);
  } catch (err) {
    console.error("[leads] persistence failed:", err instanceof Error ? err.message : "unknown error");
    return null;
  }
}

export async function listLeads(conn?: Queryable, limit = 200): Promise<Lead[]> {
  const c = conn ?? db();
  if (!c) return [];
  const rows = await c.query<Row>(`SELECT ${COLUMNS} FROM leads ORDER BY submitted_at DESC LIMIT $1`, [limit]);
  return rows.map(toLead);
}

export async function getLead(id: string, conn?: Queryable): Promise<Lead | null> {
  const c = conn ?? db();
  if (!c) return null;
  const rows = await c.query<Row>(`SELECT ${COLUMNS} FROM leads WHERE id = $1`, [id]);
  return rows.length ? toLead(rows[0]) : null;
}

export async function getLeadHistory(id: string, conn?: Queryable): Promise<LeadStatusChange[]> {
  const c = conn ?? db();
  if (!c) return [];
  const rows = await c.query<Row>(
    `SELECT id, lead_id, from_status, to_status, changed_by, changed_at, note
       FROM lead_status_history WHERE lead_id = $1 ORDER BY changed_at ASC, id ASC`,
    [id],
  );
  return rows.map((r) => ({
    id: Number(r.id),
    leadId: String(r.lead_id),
    fromStatus: (str(r.from_status) as LeadStatus | null) ?? null,
    toStatus: r.to_status as LeadStatus,
    changedBy: String(r.changed_by),
    changedAt: iso(r.changed_at)!,
    note: str(r.note),
  }));
}

export type StatusChangeResult =
  | { ok: true; lead: Lead; dispatchCreated: boolean }
  | { ok: false; reason: "not_found" | "illegal_transition" | "no_database" };

/**
 * Moves a lead, writes history, and — for QUALIFIED — reserves the conversion.
 *
 * The transition is validated against the server-side map, never against what
 * the client asked for. `qualified_at` is stamped at the moment the human
 * decides, because that, not the original submission time, is when the business
 * event happened and therefore what LinkedIn's `conversionHappenedAt` must be.
 *
 * The dispatch row is reserved here rather than by a later job so the unique
 * constraint settles the question inside the same transaction that moved the
 * status. `ON CONFLICT DO NOTHING` means a second qualification — a double
 * click, a retry, a stale tab — finds the row already taken and creates nothing.
 * Nothing in this phase sends anything to LinkedIn; the row is the reservation.
 */
export async function changeLeadStatus(
  id: string,
  next: LeadStatus,
  changedBy: string,
  note?: string,
  conn?: Queryable,
): Promise<StatusChangeResult> {
  const c = conn ?? db();
  if (!c) return { ok: false, reason: "no_database" };

  const current = await getLead(id, c);
  if (!current) return { ok: false, reason: "not_found" };
  if (!canTransition(current.status, next)) return { ok: false, reason: "illegal_transition" };

  await c.query("BEGIN");
  try {
    const rows = await c.query<Row>(
      `UPDATE leads
          SET status = $2,
              qualified_at = CASE WHEN $2 = 'QUALIFIED' AND qualified_at IS NULL THEN now() ELSE qualified_at END,
              updated_at = now()
        WHERE id = $1 AND status = $3
        RETURNING ${COLUMNS}`,
      [id, next, current.status],
    );
    // Lost the race: another request moved this lead between the read and the
    // write. Roll back rather than overwrite someone else's decision.
    if (!rows.length) {
      await c.query("ROLLBACK");
      return { ok: false, reason: "illegal_transition" };
    }

    await c.query(`INSERT INTO lead_status_history (lead_id, from_status, to_status, changed_by, note) VALUES ($1,$2,$3,$4,$5)`, [
      id,
      current.status,
      next,
      changedBy,
      note ?? null,
    ]);

    let dispatchCreated = false;
    if (next === "QUALIFIED") {
      const d = await c.query<Row>(
        `INSERT INTO linkedin_conversion_dispatch (lead_id, conversion_type)
         VALUES ($1, 'QUALIFIED_LEAD')
         ON CONFLICT (lead_id, conversion_type) DO NOTHING
         RETURNING id`,
        [id],
      );
      dispatchCreated = d.length > 0;
    }

    await c.query("COMMIT");
    return { ok: true, lead: toLead(rows[0]), dispatchCreated };
  } catch (err) {
    await c.query("ROLLBACK").catch(() => {});
    throw err;
  }
}

/**
 * Reserves a conversion without moving status. Used by the future website LEAD
 * signal, which fires on submission rather than on qualification. Returns false
 * when one already exists — the caller must treat that as "already handled".
 */
export async function reserveDispatch(leadId: string, type: ConversionType, conn?: Queryable): Promise<boolean> {
  const c = conn ?? db();
  if (!c) return false;
  const rows = await c.query<Row>(
    `INSERT INTO linkedin_conversion_dispatch (lead_id, conversion_type)
     VALUES ($1, $2) ON CONFLICT (lead_id, conversion_type) DO NOTHING RETURNING id`,
    [leadId, type],
  );
  return rows.length > 0;
}

export async function getDispatches(leadId: string, conn?: Queryable) {
  const c = conn ?? db();
  if (!c) return [];
  return c.query<Row>(
    `SELECT id, lead_id, conversion_type, event_id, state, attempts, last_attempt_at, sent_at, last_error_code, last_http_status
       FROM linkedin_conversion_dispatch WHERE lead_id = $1 ORDER BY id`,
    [leadId],
  );
}

import { createHash, randomUUID } from "node:crypto";
import type { Queryable } from "@/lib/db/client";
import { insertLead, type NewLead } from "./store";

/**
 * Durable persistence for a lead that has already been delivered.
 *
 * The ordering is deliver-first and stays that way: the notification reaches
 * Trafficomm's inbox before anything touches the database, so a database problem
 * can never show a prospect a failure for an enquiry that did in fact arrive.
 * What changes is what happens after. A single attempt that failed silently has
 * become a bounded series of attempts that runs after the response has been
 * sent, and a failure that survives all of them is reported in a form that can
 * be acted on.
 *
 * None of this can lose a lead twice, because every path carries the same
 * idempotency key and the database holds a unique index on it.
 */

/** Four attempts across roughly fifteen seconds, which covers a Neon cold start or failover. */
const BACKOFF_MS = [500, 2_000, 5_000] as const;

/**
 * A stable, non-identifying handle for one submission.
 *
 * Logs need to say *which* submission failed so it can be found and recovered,
 * and must not say who it was from. A hash of the idempotency key is both: it is
 * the same value in every log line about that submission, and it discloses
 * nothing — the key it is derived from is a random uuid or a content hash, never
 * a name or an address.
 */
export const submissionRef = (idempotencyKey: string): string =>
  createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 12);

/**
 * Derives the key that makes every path idempotent.
 *
 * In order of preference: the id the browser minted for this form (stable across
 * a user's own retries), LinkedIn's lead id (stable across webhook and backfill),
 * and failing both a content hash bucketed to the minute — which collapses a
 * double submission while still treating a genuine second enquiry an hour later
 * as a second lead.
 */
export function deriveIdempotencyKey(input: {
  submissionId?: string | null;
  externalLeadId?: string | null;
  source: string;
  email: string;
  company?: string | null;
  submittedAt: string;
}): string {
  if (input.submissionId && /^[0-9a-f-]{36}$/i.test(input.submissionId)) return `sub:${input.submissionId.toLowerCase()}`;
  if (input.externalLeadId) return `li:${input.externalLeadId}`;
  const minute = new Date(input.submittedAt).toISOString().slice(0, 16);
  const material = [input.source, input.email.trim().toLowerCase(), (input.company ?? "").trim().toLowerCase(), minute].join("\u0000");
  return `h:${createHash("sha256").update(material).digest("hex").slice(0, 32)}`;
}

export type PersistOutcome =
  | { ok: true; persisted: boolean; attempts: number }
  | { ok: false; attempts: number; ref: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Attempts the insert, retrying transient failures.
 *
 * Returns rather than throws: this runs after the response has gone, where there
 * is nobody left to receive an exception. A caller that cares inspects the
 * outcome; the routes log it.
 *
 * `persisted: false` with `ok: true` means the row already existed — a retry
 * that arrived after an earlier attempt had in fact succeeded. That is a success,
 * not a conflict, and it is the case that makes the whole thing safe to repeat.
 */
export async function persistWithRetry(lead: NewLead, conn?: Queryable): Promise<PersistOutcome> {
  const ref = submissionRef(lead.idempotencyKey);
  let attempts = 0;
  let lastError: unknown;

  for (let i = 0; i <= BACKOFF_MS.length; i++) {
    attempts++;
    try {
      const row = await insertLead(lead, conn);
      // A null row means no database is configured at all, which is a
      // deployment state rather than a failure, and retrying cannot change it.
      if (row === null) return { ok: true, persisted: false, attempts };
      return { ok: true, persisted: true, attempts };
    } catch (err) {
      lastError = err;
      if (i < BACKOFF_MS.length) await sleep(BACKOFF_MS[i]);
    }
  }

  // Deliberately coarse, and deliberately not the lead. The reference is enough
  // to recover the submission from the webhook payload or the notification; the
  // error class is enough to tell a Neon blip from a schema mistake.
  console.error(
    `[leads] persistence failed after ${attempts} attempts ref=${ref} source=${lead.source} error=${
      lastError instanceof Error ? lastError.constructor.name : "unknown"
    }`,
  );
  return { ok: false, attempts, ref };
}

/** A fresh submission id, for a form that did not supply one. */
export const newSubmissionId = () => randomUUID();

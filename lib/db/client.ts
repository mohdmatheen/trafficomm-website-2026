import { neon } from "@neondatabase/serverless";

/**
 * The database seam.
 *
 * Everything that touches Postgres goes through `Queryable`, which is the whole
 * surface: one method, parameterised, returning rows. Two things depend on that
 * narrowness — the Neon driver in production, and PGlite in the test suite,
 * which is real Postgres compiled to WASM and therefore enforces the same DDL
 * and the same unique constraint without a server. A mock would have proved
 * nothing about the constraint the idempotency design rests on.
 *
 * The Neon HTTP driver rather than a pooled TCP client: this runs on serverless
 * functions that start and stop constantly, where a connection pool is a
 * liability rather than an optimisation.
 */
export type Queryable = {
  query<T = Record<string, unknown>>(text: string, params?: readonly unknown[]): Promise<T[]>;
};

/** Null when no database is configured, so callers can degrade rather than throw. */
let cached: Queryable | null | undefined;

/**
 * Resolved lazily and cached per process.
 *
 * A missing `DATABASE_URL` returns null rather than throwing: a lead must still
 * be delivered by email when persistence is unavailable, and the forms must
 * still work on a developer's machine that has no database at all.
 */
export function db(): Queryable | null {
  if (cached !== undefined) return cached;
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    cached = null;
    return cached;
  }
  const sql = neon(url);
  cached = {
    async query<T>(text: string, params: readonly unknown[] = []) {
      return (await sql.query(text, params as unknown[])) as T[];
    },
  };
  return cached;
}

/** Test seam. Lets the suite install a PGlite-backed Queryable, and reset after. */
export function __setDb(next: Queryable | null | undefined) {
  cached = next;
}

export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL?.trim());

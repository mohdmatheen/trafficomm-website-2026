/**
 * Applies pending migrations against DATABASE_URL.
 *
 *   npm run db:migrate
 *
 * The npm script loads `.env.local` with `--env-file-if-exists`, so a local run
 * uses the development branch configured there. Node does not override variables
 * already present in the environment, so exporting DATABASE_URL for one command
 * still wins — which is how a deliberate run against another branch is done.
 *
 * Branch guard
 * ------------
 * EXPECTED_NEON_BRANCH is required; the script refuses to migrate anything else:
 *
 *   EXPECTED_NEON_BRANCH=br-plain-darkness-b8e978gd npm run db:migrate
 *
 * The check happens after connecting and before any statement runs, and it reads
 * the branch id from the server rather than from the connection string, so a
 * mistyped or stale URL cannot slip past it. This exists because "migrate the
 * development branch" is one careless shell away from "migrate production", and
 * a guarantee that depends on someone reading the right line of output is not a
 * guarantee.
 */
import { neon } from "@neondatabase/serverless";
import { migrate } from "../lib/db/migrate.ts";

const expected = process.env.EXPECTED_NEON_BRANCH?.trim();
if (!expected) {
  console.error("ABORTED: EXPECTED_NEON_BRANCH is required. Set the intended Neon branch ID explicitly.");
  console.error("No database connection was made and no migration was applied.");
  process.exit(1);
}

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is not set.");
  console.error("Local: add it to .env.local (see scripts/set-local-db-url.sh).");
  console.error("Other environments: export it for this command only — do NOT run `vercel env pull`,");
  console.error("which overwrites .env.local with the Vercel-managed value.");
  process.exit(1);
}

const sql = neon(url);
const conn = { query: async (text, params = []) => await sql.query(text, params) };

try {
  // Identify the target before touching it. `current_setting` is reported by the
  // Postgres instance itself, so it describes the database actually connected to.
  const [{ branch, db }] = await conn.query(
    "select current_setting('neon.branch_id', true) branch, current_database() db",
  );
  if (branch !== expected) {
    console.error(`ABORTED: connected to Neon branch ${branch ?? "(unknown)"}, expected ${expected}.`);
    console.error("No migration was applied.");
    process.exit(1);
  }

  console.log(`Target: database ${db}, Neon branch ${branch} — matches EXPECTED_NEON_BRANCH`);

  const ran = await migrate(conn);
  console.log(ran.length ? `Applied: ${ran.join(", ")}` : "Already up to date.");
} catch (err) {
  // Never let a connection string reach the log through an error message.
  const message = err instanceof Error ? err.message : String(err);
  console.error("Migration failed:", message.replace(/postgres(ql)?:\/\/[^\s]+/g, "[redacted]"));
  process.exit(1);
}

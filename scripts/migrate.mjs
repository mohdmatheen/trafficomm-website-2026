/**
 * Applies pending migrations against DATABASE_URL.
 *
 *   npm run db:migrate
 *
 * Run it against each Vercel environment's connection string. Neon database
 * branching means Preview gets its own branch, so a preview migration cannot
 * touch production rows.
 */
import { neon } from "@neondatabase/serverless";
import { migrate } from "../lib/db/migrate.ts";

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is not set. Pull it with `vercel env pull .env.local` or export it for this shell.");
  process.exit(1);
}

const sql = neon(url);
const conn = { query: async (text, params = []) => await sql.query(text, params) };

try {
  const ran = await migrate(conn);
  console.log(ran.length ? `Applied: ${ran.join(", ")}` : "Already up to date.");
} catch (err) {
  console.error("Migration failed:", err instanceof Error ? err.message : err);
  process.exit(1);
}

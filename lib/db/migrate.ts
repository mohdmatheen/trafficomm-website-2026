import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { Queryable } from "./client";

/**
 * Migration runner.
 *
 * Files in `migrations/` are applied in filename order, once each, recorded in
 * `schema_migrations`. There is no down-migration mechanism by design: a `DROP`
 * that runs automatically against production is a worse failure mode than a
 * forward fix, and the rollback procedure in the handover is written around
 * leaving tables in place and disabling reads instead.
 *
 * Shared by `npm run db:migrate` and by the test suite, which applies the same
 * SQL to PGlite so the schema under test is the schema that ships.
 */
export const MIGRATIONS_DIR = join(process.cwd(), "migrations");

export async function migrate(conn: Queryable, dir = MIGRATIONS_DIR): Promise<string[]> {
  await conn.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);

  const applied = new Set(
    (await conn.query<{ name: string }>("SELECT name FROM schema_migrations")).map((r) => r.name),
  );

  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  const ran: string[] = [];

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(join(dir, file), "utf8");
    // One statement at a time: the Neon HTTP driver takes a single statement per
    // call, and splitting here keeps the error message pointed at the statement
    // that actually failed rather than the whole file.
    for (const statement of splitStatements(sql)) await conn.query(statement);
    await conn.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
    ran.push(file);
  }
  return ran;
}

/**
 * Splits on semicolons that end a statement.
 *
 * Deliberately simple, and adequate because these migrations are plain DDL: it
 * skips semicolons inside single-quoted strings, dollar-quoted blocks and
 * comments. If a migration ever needs a function body with nested dollar quotes,
 * this needs revisiting rather than extending.
 */
export function splitStatements(sql: string): string[] {
  const out: string[] = [];
  let buf = "";
  let inSingle = false;
  let inLineComment = false;
  let dollarTag: string | null = null;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const rest = sql.slice(i);

    if (inLineComment) {
      buf += ch;
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (dollarTag) {
      buf += ch;
      if (rest.startsWith(dollarTag)) {
        buf += sql.slice(i + 1, i + dollarTag.length);
        i += dollarTag.length - 1;
        dollarTag = null;
      }
      continue;
    }
    if (!inSingle && rest.startsWith("--")) {
      inLineComment = true;
      buf += ch;
      continue;
    }
    if (!inSingle) {
      const tag = /^\$[A-Za-z_]*\$/.exec(rest);
      if (tag) {
        dollarTag = tag[0];
        buf += tag[0];
        i += tag[0].length - 1;
        continue;
      }
    }
    if (ch === "'") inSingle = !inSingle;

    if (ch === ";" && !inSingle) {
      const trimmed = buf.trim();
      if (trimmed && !isOnlyComments(trimmed)) out.push(trimmed);
      buf = "";
      continue;
    }
    buf += ch;
  }
  const tail = buf.trim();
  if (tail && !isOnlyComments(tail)) out.push(tail);
  return out;
}

const isOnlyComments = (s: string) => s.split("\n").every((line) => !line.trim() || line.trim().startsWith("--"));

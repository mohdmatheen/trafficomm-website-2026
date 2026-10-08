#!/usr/bin/env bash
#
# Writes the Neon connection string on the clipboard into .env.local as
# DATABASE_URL, for local development only.
#
# The value is never printed, never passed as an argument and never reaches the
# shell history: it is read from the clipboard inside this script and written
# straight to the file. Existing keys are preserved and any previous
# DATABASE_URL is replaced rather than appended to, so the file cannot end up
# with two.
#
# This script contains no credential and is safe to commit. The file it writes
# is matched by `.env*` in .gitignore and must never be.
#
# Usage, from anywhere:  bash scripts/set-local-db-url.sh

set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=".env.local"
TMP="$ENV_FILE.tmp"
# Also matched by `.env*`, and removed however this exits — a half-written file
# holding a credential is not something to leave lying around.
trap 'rm -f "$TMP"' EXIT

if ! command -v pbpaste >/dev/null 2>&1; then
  echo "ABORTED: pbpaste not found. This script is macOS-only." >&2
  exit 1
fi

# Tolerates the shapes Neon's "Copy snippet" produces — a bare URL, a
# DATABASE_URL= line, or a psql command — by extracting the URL from whatever
# was copied. Quotes are stripped first so they cannot end up inside the value.
RAW=$(pbpaste | tr -d '\r\n' | tr -d "\"'")
URL=$(printf '%s' "$RAW" | grep -oE 'postgres(ql)?://[^[:space:]]+' | head -n 1 || true)

case "${URL:-}" in
  postgresql://*|postgres://*) ;;
  *)
    echo "ABORTED: no postgresql:// connection string found on the clipboard." >&2
    echo "Nothing was changed. Re-copy from Neon (branch: development, pooled) and run again." >&2
    exit 1
    ;;
esac

[ -f "$ENV_FILE" ] || : > "$ENV_FILE"

# Everything except any existing DATABASE_URL, then the new one. Written to a
# temporary file and moved into place so an interrupted run cannot leave the
# file truncated.
grep -v '^DATABASE_URL=' "$ENV_FILE" > "$TMP" || true
printf 'DATABASE_URL=%s\n' "$URL" >> "$TMP"
mv "$TMP" "$ENV_FILE"
chmod 600 "$ENV_FILE"

echo "DATABASE_URL written to $ENV_FILE — value not displayed."
echo "Keys now present: $(grep -oE '^[A-Za-z_][A-Za-z0-9_]*=' "$ENV_FILE" | sed 's/=$//' | tr '\n' ' ')"

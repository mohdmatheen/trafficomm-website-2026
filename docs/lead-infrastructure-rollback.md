# Rollback — Phases 1–4

Every phase can be undone independently, and none of the procedures below
requires deleting production data.

## The short version

| To disable | Do this | Effect |
|---|---|---|
| Lead persistence | Unset `DATABASE_URL` | Forms deliver by email exactly as before; no rows written |
| Dashboard | Unset `ADMIN_AUTH_SECRET` | `/admin` denies everyone, including you |
| A single person's access | Remove them from `ADMIN_ALLOWED_EMAILS` | Takes effect on their next request, not when their session expires |
| All sessions | Rotate `ADMIN_AUTH_SECRET` | Every existing cookie becomes invalid immediately |
| Attribution capture | Revert the `FirstTouch` mount in `app/layout.tsx` | Forms still submit; attribution fields arrive empty |

None needs a code change except the last, and none needs a database change.

## Phase 1 — database

**Disable without deploying:** unset `DATABASE_URL` in the Vercel environment and
redeploy. `db()` returns null, `recordLead` returns null, every form continues to
deliver by email and webhook. The dashboard shows "no database configured".
This is a genuine kill switch, not a theoretical one — the no-database path is
covered by tests.

**Migration rollback:** there is deliberately no down-migration. Automatic
`DROP TABLE` against production is a worse failure mode than a forward fix, and
these tables are additive — nothing that existed before depends on them. If the
schema is wrong, write `002_*.sql` to correct it.

If the tables must genuinely go (they should not, while they hold real leads):

```sql
-- Export first. These rows are the only copy of lead status and history.
DROP TABLE IF EXISTS linkedin_conversion_dispatch;
DROP TABLE IF EXISTS lead_status_history;
DROP TABLE IF EXISTS leads;
DELETE FROM schema_migrations WHERE name = '001_lead_store.sql';
```

Run by hand, after an export, never as part of a deploy.

**Full revert:** `git revert` the commit. Form delivery is untouched by it — the
persistence call sits after delivery and cannot fail the request.

## Phase 2 — attribution

**Disable:** remove `<FirstTouch />` from `app/layout.tsx`. Forms keep working;
`readStoredAttribution()` falls back to reading the current URL, which is the old
behaviour. Stored attribution in `sessionStorage` expires with the browser tab.

**No data cleanup is needed.** Attribution columns are nullable and a visit with
no attribution stores nulls.

## Phase 3 — dashboard

**Disable:** unset `ADMIN_AUTH_SECRET`. `verify()` returns `unconfigured` and
every admin page and API route denies. The routes still exist and still return
401/redirect — they just admit nobody.

**Remove entirely:** delete `app/admin/`, `app/api/admin/` and
`components/admin/`. Nothing else imports them; the public site does not link to
them and the sitemap does not list them.

**If a session is suspected compromised:** rotate `ADMIN_AUTH_SECRET`. Every
outstanding cookie and every unexpired sign-in link dies at once.

## Phase 4 — privacy and consent

Nothing was published. `docs/privacy-policy-draft.md` and
`docs/consent-architecture-recommendation.md` are documents in the repository.
There is no `/privacy` route, no banner, no consent script and no LinkedIn tag.
Rollback is deleting two files.

## What is NOT rollback-able by configuration

Nothing — because nothing in these phases calls LinkedIn, changes GTM, alters the
public site's behaviour or modifies an existing form's contract. The only
user-visible change on the public site is that attribution is now remembered
across pages, which is invisible to the visitor.

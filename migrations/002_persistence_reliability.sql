-- Persistence reliability.
--
-- The lead store is becoming the system of record for LinkedIn qualification, so
-- a submission that was delivered to the inbox but lost on the way to the
-- database can no longer be an acceptable outcome. Two columns make the
-- difference: a key that lets any retry converge on one row, and a state that
-- says how the row got here.
--
-- Added nullable and backfilled before the NOT NULL, so the migration is safe
-- against a table that already holds rows. The lead table is empty today; the
-- migration should not depend on that remaining true.

ALTER TABLE leads ADD COLUMN IF NOT EXISTS idempotency_key text;

-- Any pre-existing row gets a key of its own. These rows were persisted on the
-- first attempt and have no natural key to recover from.
UPDATE leads SET idempotency_key = 'legacy:' || id::text WHERE idempotency_key IS NULL;

ALTER TABLE leads ALTER COLUMN idempotency_key SET NOT NULL;

-- The constraint the whole recovery design rests on. A retry, a re-POST of a
-- webhook payload, a double submission and a recovery call all carry the same
-- key, so at most one lead can exist for one submission — enforced here rather
-- than by remembering to check.
CREATE UNIQUE INDEX IF NOT EXISTS leads_idempotency_key_key ON leads (idempotency_key);

-- How the row arrived. `delivered` is the normal path: notification sent, then
-- persisted. `recovered` means persistence failed at the time and the lead was
-- re-ingested afterwards from a payload that had already been delivered — which
-- is precisely why the recovery path must never send anything.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS delivery_state text NOT NULL DEFAULT 'delivered'
  CHECK (delivery_state IN ('delivered', 'recovered'));

-- Recovered rows are the ones worth looking at: each is a submission the
-- database nearly lost.
CREATE INDEX IF NOT EXISTS leads_delivery_state_idx ON leads (delivery_state) WHERE delivery_state = 'recovered';

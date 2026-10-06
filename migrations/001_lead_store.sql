-- Trafficomm lead store.
--
-- Three tables, and the shape of each is driven by one requirement: a lead that
-- becomes QUALIFIED must produce exactly one LinkedIn conversion, ever, and no
-- amount of double-clicking, re-saving, retrying or redeploying may produce a
-- second. That guarantee is a database constraint here, not application logic,
-- because application logic is what fails.
--
-- Plain SQL rather than an ORM migration DSL. The repository has five runtime
-- dependencies and a house style of hand-written, commented code; a migration
-- that is readable in psql is worth more here than generated types.

CREATE TABLE IF NOT EXISTS leads (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Where the lead came from. Checked rather than free text: an unrecognised
  -- source silently breaks reporting and attribution, so it fails at write time.
  source            text NOT NULL CHECK (source IN ('website_assessment', 'website_call', 'website_labs', 'linkedin_leadgen')),

  -- LinkedIn's own identifier for a Lead Gen Form response, and the form
  -- response URN. Null for website leads. The UNIQUE index below is what makes
  -- webhook and poll/backfill ingestion converge on one row rather than two.
  external_lead_id  text,
  lead_urn          text,

  first_name        text,
  last_name         text,
  email             text NOT NULL,
  -- Lowercased, whitespace-stripped, SHA-256, hex. Computed once on write so
  -- the future Conversions API call never has to re-derive it, and so the hash
  -- is identical every time it is sent.
  email_sha256      text NOT NULL,

  company           text,
  job_title         text,
  country_code      text,

  -- LinkedIn first-party click id, when the visitor actually arrived with one.
  -- Never synthesised: absent means absent.
  li_fat_id         text,

  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  utm_term          text,
  referrer          text,
  landing_path      text,
  first_touch_at    timestamptz,

  -- Populated only from LinkedIn Lead Sync. Website leads cannot know these and
  -- must never have them inferred.
  campaign_urn      text,
  creative_urn      text,
  form_urn          text,

  -- The qualification answers. `requirement` is the "what support are you
  -- looking for" answer; `campaign_volume` the monthly band. Both are free text
  -- because the website volume bands and the future Lead Gen Form options are
  -- different vocabularies, and forcing them into one enum would mean editing a
  -- type every time marketing edits a form.
  requirement       text,
  campaign_volume   text,

  -- LinkedIn marks test submissions. They are stored so a test is verifiable
  -- end to end, and excluded from anything that counts.
  is_test_lead      boolean NOT NULL DEFAULT false,

  status            text NOT NULL DEFAULT 'NEW'
                    CHECK (status IN ('NEW','CONTACTED','QUALIFIED','OPPORTUNITY','PROPOSAL','WON','LOST','INVALID')),

  -- When the enquiry was made. Distinct from qualified_at, which is when
  -- Trafficomm decided it was real — that is the timestamp LinkedIn's
  -- QUALIFIED_LEAD conversion must carry.
  submitted_at      timestamptz NOT NULL,
  qualified_at      timestamptz,

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- One row per LinkedIn lead, however many times it is delivered. Partial, so the
-- many website leads with no external id do not collide on NULL.
CREATE UNIQUE INDEX IF NOT EXISTS leads_external_lead_id_key
  ON leads (external_lead_id) WHERE external_lead_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS leads_status_submitted_idx ON leads (status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS leads_submitted_idx        ON leads (submitted_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx           ON leads (source);

-- Append-only. Every transition is a row; nothing is ever updated or deleted, so
-- "when did this become qualified, and who decided" survives later status moves.
CREATE TABLE IF NOT EXISTS lead_status_history (
  id          bigserial PRIMARY KEY,
  lead_id     uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  from_status text,
  to_status   text NOT NULL,
  changed_by  text NOT NULL,
  changed_at  timestamptz NOT NULL DEFAULT now(),
  note        text
);

CREATE INDEX IF NOT EXISTS lead_status_history_lead_idx ON lead_status_history (lead_id, changed_at);

-- The idempotency table. Nothing calls LinkedIn in this phase; the row is the
-- record of intent, and the unique constraint is the guarantee.
CREATE TABLE IF NOT EXISTS linkedin_conversion_dispatch (
  id               bigserial PRIMARY KEY,
  lead_id          uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- LinkedIn conversion rule types. LEAD on a genuine submission, QUALIFIED_LEAD
  -- on human qualification — the two funnel signals, kept separate.
  conversion_type  text NOT NULL CHECK (conversion_type IN ('LEAD', 'QUALIFIED_LEAD')),

  -- Generated once, here, and reused by every retry. LinkedIn deduplicates on
  -- (conversion rule, eventId), so a regenerated id would defeat the whole
  -- mechanism — which is exactly why it is persisted rather than derived.
  event_id         uuid NOT NULL DEFAULT gen_random_uuid(),

  state            text NOT NULL DEFAULT 'pending'
                   CHECK (state IN ('pending','sent','failed','abandoned')),
  attempts         integer NOT NULL DEFAULT 0,
  last_attempt_at  timestamptz,
  sent_at          timestamptz,
  -- Coarse failure information only. No tokens, no response bodies, no PII.
  last_error_code  text,
  last_http_status integer,

  created_at       timestamptz NOT NULL DEFAULT now(),

  -- The whole point. One lead, one conversion of each type, enforced by the
  -- database so a bug, a double click or a concurrent retry cannot get past it.
  CONSTRAINT linkedin_conversion_dispatch_lead_type_key UNIQUE (lead_id, conversion_type)
);

CREATE INDEX IF NOT EXISTS linkedin_dispatch_pending_idx
  ON linkedin_conversion_dispatch (state, last_attempt_at) WHERE state IN ('pending', 'failed');

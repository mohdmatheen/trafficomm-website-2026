# Trafficomm website

Marketing site for **Trafficomm Digital Media Services** — *Performance Operations. Built to Scale.*

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP / ScrollTrigger · SVG · Canvas 2D.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Build, then run every Playwright suite |
| `npm run test:quality` | Runtime health + interaction tests (needs a prior build) |
| `npm run test:visual` | Screenshot regression against local baselines |
| `npm run test:visual:update` | Regenerate visual baselines (`--update-snapshots`) |
| `npm run lhci` | Build, then Lighthouse CI with performance budgets (fetched on demand via `npx`, pinned version) |
| `npm run maps` | Regenerate the static dot-map assets |

Playwright uses the locally installed Google Chrome (`channel: "chrome"`); no browser download is required.

Lighthouse CI is **not** a project dependency (its dependency tree carries dev-only advisories). It runs on demand from the npx cache using the pinned version in the `lhci` script, with budgets from `lighthouserc.json`. If it cannot find Chrome:

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run lhci
```

## Structure

```
app/                  Routes (App Router), metadata, sitemap, robots, API route
components/
  layout/             Header, mega menu, mobile nav, footer
  sections/home/      Homepage sections (homepage is design-locked)
  sections/shared/    Reusable section blocks (page hero, CTA band, FAQ, pressure cascade…)
  service-page/       Full service-page sections (reference: Ad Operations)
  templates/          Page templates (ServiceDetailPage, legacy ServiceTemplate, case study, article…)
  visualizations/     Diagrams, workflows, platform network, particle canvas, maps
  motion/             Shared visibility / media-query / reduced-motion hooks, reveal observer
  ui/                 Design-system primitives (buttons, sections, metrics, platform marks…)
data/                 All content and company facts (single source of truth)
  service-pages/      Full service-page content (ServicePageContent)
lib/
  motion/             Motion tokens + pooled visibility system
public/
  platforms/          Official platform marks (sources in data/platform-logos.ts)
  maps/               Generated static dot-map SVGs
scripts/              Build-time asset generators (not shipped)
tests/                Playwright suites (development only)
```

## Content rules

- Every recurring figure lives in **`data/metrics.ts`** (single source of truth) — never hard-code a number in a component.
  - Company scale: founded 2015 · 10K+ campaigns · 1M+ creatives & placements · ~$10M campaign scale — campaign value of one of the largest UAE tourism campaigns handled (**not revenue, not cumulative/annual spend**) · 250+ **peak** monthly campaign volume (not a current run-rate) · 70+ peak historical team size (not current headcount).
  - Case-study figures describe one anonymized engagement only: 4 → ~30 team scale (**historical** — never "today"/"current"), 50%, 99.34%, 7+ year engagement span — never "current/ongoing" (Case 01); 250+ campaigns managed (Case 02 — a different fact from the company peak); 300+ rich media creatives (Case 03); 50+ campaigns managed (Case 04).
- Client identities are never published; case studies are anonymized. "Client identity withheld…" belongs only on case studies and case-study references; Contact uses the enquiry confidentiality line (`data/site.ts`).
- Platform marks indicate **platform experience** only — never partnership, certification or endorsement. The TikTok mark is a placeholder: **official asset required**.
- Platform logos (`data/platform-logos.ts`): official assets only, never redrawn, recoloured or stretched. `inline` sets the compact logo + name size; `mono: true` marks brands whose guidelines permit a one-colour version (neutral by default, supplied colours on hover/focus/selection). Google product marks are always shown as supplied.
- Service-page depth for the five standard services lives in `data/service-depth.ts`; solution workflows, links and CTAs in `data/solutions.ts`.

## Adding a full service page

1. Create `data/service-pages/<slug>.ts` exporting a `ServicePageContent`.
2. Register it in `data/service-pages/index.ts`.
3. The `/services/<slug>` route renders it with `ServiceDetailPage`; services without an entry use the legacy template.

## Motion system

Tokens live in `lib/motion/tokens.ts` and as CSS variables (`--dur-*`, `--ease-*`) in `app/globals.css`.

| Behaviour | Rule |
|---|---|
| Signal | Red point carrying work; linear, constant speed (`--dur-signal-step`) |
| Node activation | Ring + fill, fast (`--dur-fast`) |
| Line draw | Connector drawing in; scroll-driven CSS on mobile |
| Reveal | Fade + 18px rise, once (`data-reveal`) |
| Metric settle | Fade + 10px rise, then a short red baseline (`<Metric>`); no count-up |
| Workflow progression | Queued → in progress → complete |
| Hover / focus | ≤ 200ms, colour / 2–4px only |

- One pooled IntersectionObserver system (`lib/motion/visibility.ts`); loops and SMIL animations pause off-screen.
- Heavy visualizations initialize lazily (particle canvas samples glyphs only when first visible).
- Desktop/mobile variants both server-render (no layout shift); the unused one unmounts after hydration.
- `prefers-reduced-motion`: static final states, no pinning, no loops, no delays.

## Performance budgets (enforced by `lighthouserc.json`)

LCP ≤ 2.5s and CLS ≤ 0.05 on throttled mobile · script transfer ≤ 280KB · DOM ≤ 2,500 elements · accessibility and SEO ≥ 95. Lighthouse runs with applied (devtools) throttling; see the note in the config.

## Environment

See `.env.example`. Every delivery variable is server-only — none carries a
`NEXT_PUBLIC_` prefix, so none reaches the browser bundle. Never commit `.env*`
files; `.gitignore` already excludes them apart from the example.

## Deployment

Prepared for **Vercel preview deployments** only (branch `website-review`). No production domain, DNS or live site is connected to this repository.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production at launch only | Canonical origin. Unset on Vercel → the deployment's own URL is used automatically. |
| `ASSESSMENT_EMAIL_PROVIDER` | Server-only | `postmark` or `resend`. Enables email delivery of form submissions. |
| `ASSESSMENT_EMAIL_API_KEY` | Server-only **secret** | Postmark Server API token, or Resend API key. |
| `ASSESSMENT_EMAIL_FROM` | Server-only | From address. Must be a sender the provider has verified. |
| `ASSESSMENT_EMAIL_TO` | Server-only | Where enquiries are delivered. Kept out of the repository — this repository is public. |
| `ASSESSMENT_WEBHOOK_URL` | Server-only **secret** | Form delivery to a CRM, Slack, or an email relay. |
| `SITE_INDEXABLE` | Production at launch only | `true` allows indexing. Unset (default) → `noindex, nofollow` via header, robots.txt and meta on every deployment, including the `*.vercel.app` project URL. |

QA artefacts are excluded via `.vercelignore`.

### Assessment form delivery

Every valid submission is delivered to **every channel configured** — email and
webhook are destinations, not alternatives, so both run when both are set. If any
configured channel fails the visitor sees an error and is asked to retry; the
route never reports success for a lead that did not arrive.

With **neither** configured, a preview says so plainly and production returns 503
rather than silently discarding the enquiry.

The webhook payload carries ready-made `subject`, `replyTo` and `text` fields
alongside the flat data, so an email relay (Zapier, Make, n8n, Pipedream) can send
the notification without composing it, and an existing CRM mapping keeps working.

Email bodies are plain text, and `Reply-To` is the visitor's work email so a reply
in the inbox reaches the prospect directly. Submissions from a preview or
development environment are labelled in the subject and body so a test is never
mistaken for a real lead.

## Pre-production checklist

- [ ] **Configure assessment form delivery** — set either the `ASSESSMENT_EMAIL_*` group or `ASSESSMENT_WEBHOOK_URL` in Vercel. Until one is set, production returns 503 and no enquiry is delivered. Sending as `@trafficomm.com` needs the provider added to SPF and a DKIM record: trafficomm.com publishes `v=DMARC1; p=quarantine`, so an unaligned message is junked.
- [ ] At trafficomm.com launch only: set `NEXT_PUBLIC_SITE_URL=https://www.trafficomm.com` and `SITE_INDEXABLE=true` in Vercel **Production**.
- [ ] Add confirmed contact details (email, phone, booking link) in `data/site.ts`.
- [ ] Legal review of platform-mark usage (Google product marks in particular; monochrome Meta mark treatment in the hero).
- [ ] Confirm the open factual items from the content audit (below) before launch.
- [ ] Brand film — **postponed until the site is finished**. The homepage section was removed on 2026-09-23; `components/sections/home/VideoFeature.tsx`, `components/ui/VideoPlayer.tsx` and `brandFilm` in `data/site.ts` are kept unused so the finished film can be reintroduced by rendering `<VideoFeature />` in `app/page.tsx` (renumber the following section eyebrows) and setting `brandFilm.src`. Concept: "60 Seconds with Trafficomm — see what happens behind thousands of digital campaigns."
- [ ] Full cost calculator — deferred, not started; the homepage keeps the preview only.

### Factual items awaiting Trafficomm confirmation

- **Chennai, India** delivery location (Case 01 solution text, `data/case-studies.ts`) — approved as operational context on 2026-09-22; no client identity or address is given.
- Metrics confirmed by Trafficomm on 2026-09-22: ~$10M (single UAE tourism campaign value), 10K+ and 1M+ (company-wide since 2015), 70+ (peak historical team), 4 → ~30 (historical), 7+ year engagement span (not stated as ongoing). Performance Lab author: "Trafficomm Performance Lab".

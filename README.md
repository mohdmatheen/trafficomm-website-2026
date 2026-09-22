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

- Every fact lives in `data/`. Only documented Trafficomm figures are used (founded 2015, 10K+ campaigns, 1M+ creatives & placements, ~$10M campaign scale, 250+ largest monthly volume, 70+ peak team) and the documented MENA case results.
- Client identities are never published; case studies are anonymized.
- Platform marks indicate **platform experience** only — never partnership, certification or endorsement. The TikTok mark is a placeholder: **official asset required**.

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

See `.env.example`. `ASSESSMENT_WEBHOOK_URL` is server-only. Never commit `.env*` files.

## Deployment

Prepared for **Vercel preview deployments** only (branch `website-review`). No production domain, DNS or live site is connected to this repository.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production at launch only | Canonical origin. Unset on Vercel → the deployment's own URL is used automatically. |
| `ASSESSMENT_WEBHOOK_URL` | Server-only secret | Form delivery. Unset on previews → submissions are disabled with a clear message; nothing is sent. |
| `SITE_INDEXABLE` | Production at launch only | `true` allows indexing. Unset (default) → `noindex, nofollow` via header, robots.txt and meta on every deployment, including the `*.vercel.app` project URL. |

QA artefacts are excluded via `.vercelignore`.

## Pre-production checklist

- [ ] **Official TikTok asset required** — replace `public/platforms/tiktok.svg` (placeholder) with the official mark from TikTok's brand portal.
- [ ] Set `ASSESSMENT_WEBHOOK_URL` to the agreed CRM/webhook endpoint.
- [ ] At trafficomm.com launch only: set `NEXT_PUBLIC_SITE_URL=https://www.trafficomm.com` and `SITE_INDEXABLE=true` in Vercel **Production**.
- [ ] Add confirmed contact details (email, phone, booking link) in `data/site.ts`.
- [ ] Legal review of platform-mark usage (Google product marks in particular).
- [ ] Brand film (approved storyboard) and full cost calculator — deferred, not started.

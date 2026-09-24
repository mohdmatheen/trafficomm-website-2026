# Trafficomm — final pre-launch refinement, QA and launch preparation

Report format A–AG as requested.

---

## A. Starting branch and commit

`final-visual-refinement` @ **`b3d5b3f`** — "refactor: finish the site — consolidate, clarify, and answer who decides". Confirmed as the expected starting commit.

## B. New branch

**`final-launch-preparation`**, created from `b3d5b3f`. Pushed to `origin`. No other branch was created, modified, rebased or force-pushed.

## C. Final commit

**`78e9bfb`** — "feat: use the supplied service illustrations"

Two commits on the branch:

| Commit | Subject |
|---|---|
| `6f803df` | feat: open up the platform ecosystem and simplify the way in |
| `78e9bfb` | feat: use the supplied service illustrations |

`b3d5b3f..78e9bfb` = 43 files changed, 1,150 insertions, 742 deletions.

## D. Files created

| Path | What |
|---|---|
| `components/visual/ServiceIllustration.tsx` | Renders the six supplied service illustrations (fixed-width and fluid variants) plus the per-service caption map |
| `tests/launch-prep.spec.ts` | 194 lines of new assertions guarding this pass |
| `public/platforms/noon.svg` | Official noon wordmark |
| `public/platforms/talabat.svg` | Official talabat lockup |
| `public/illustrations/services/*.svg` (×6) | The supplied service illustrations, byte-for-byte as delivered |

## E. Files modified

30 files. Grouped by purpose:

- **Header / identity** — `components/ui/Logo.tsx`, `components/layout/Header.tsx`, `data/site.ts`
- **Platform ecosystem** — `components/visualizations/EcosystemHero.tsx`, `components/visualizations/PlatformNetwork.tsx`, `components/sections/home/PlatformEcosystem.tsx`, `app/platforms/page.tsx`, `components/ui/PlatformMark.tsx`, `data/platforms.ts`, `data/platform-logos.ts`, `data/types.ts`, `public/platforms/tiktok.svg`, `app/globals.css`
- **Navigation** — `components/layout/MobileNav.tsx`, `components/visual/SolutionGlyph.tsx`
- **Services / illustrations** — `components/visual/ServiceExplorer.tsx`, `components/cards/ServiceModuleCard.tsx`, `components/templates/ServiceTemplate.tsx`, `components/templates/ServiceDetailPage.tsx`, `data/services.ts`
- **Metrics & contrast** — `data/metrics.ts`, `components/sections/home/Hero.tsx`, `components/service-page/ProofStrip.tsx`, `app/about/page.tsx`
- **Form** — `components/forms/AssessmentForm.tsx`, `lib/assessment.ts`, `app/api/assessment/route.ts`, `app/contact/page.tsx`
- **Tests / tooling** — `tests/interactions.spec.ts`, `tests/visual-sitewide.spec.ts`, `eslint.config.mjs`

## F. Files deleted

| Path | Why |
|---|---|
| `components/visual/ServiceGlyph.tsx` | Fully superseded by the supplied illustrations; zero remaining references |
| `components/visualizations/ModuleViz.tsx` | Was the generic service-hero diagram; superseded |

The `viz` field was also removed from the `Service` type and from all six entries in `data/services.ts`, because nothing read it after `ModuleViz` went.

## G. Header / tagline change

`data/site.ts` gained `headerDescriptor: "Performance Operations Partner"`. `Logo` takes an optional `tagline` and renders it as a subordinate line under the wordmark:

```
mt-1 hidden whitespace-nowrap font-mono text-[0.52em] uppercase
leading-none tracking-[0.14em] min-[420px]:block
```

Three deliberate decisions:

1. **Font size is relative (`0.52em`)**, so the tagline scales with the wordmark rather than needing a breakpoint ladder.
2. **`whitespace-nowrap` + `shrink-0` on the link.** Without these it wrapped to two lines at 1440 and pushed the header taller. It now cannot wrap.
3. **One DOM node, not two.** The first attempt rendered two `<Logo>` elements for responsive behaviour, which duplicated the wordmark text for screen readers. It is now a single Logo whose tagline is `hidden min-[420px]:block` — below 420px the tagline is absent, not merely invisible.

**Header height is unchanged at every width.** The tagline sits in space the wordmark's line box already occupied.

Verified at 1440 / 1280 / 1024 / 768 / 430 / 390 — frames `03-header-desktop-tagline.png`, `04-header-mobile-390.png`.

## H. Platform additions

Four, added as `additionalPlatforms` in `data/platforms.ts`:

| Platform | Display name | Category |
|---|---|---|
| Microsoft Advertising | "Microsoft Advertising", official name "Microsoft Advertising (Bing)" | Search |
| Noon | "Noon" | Commerce & Delivery |
| Talabat | "Talabat" | Commerce & Delivery |
| ChatGPT | "ChatGPT" | AI Platforms |

Two new `PlatformCategory` values were needed: **Commerce & Delivery** and **AI Platforms**.

**No platform pages were created for these four.** They have no `href`, so they render as unlinked nodes and unlinked list entries. `/platforms/chatgpt`, `/platforms/noon`, `/platforms/talabat` and `/platforms/microsoft-advertising` all return **404**, which a test now asserts. The brief's instruction not to create thin or fabricated platform pages is enforced by that test, not by discipline alone.

**No partnership language anywhere.** Their `ecosystem` arrays carry the standard Execute / Optimize / Measure / Report model and are flagged `standardModel: true` in the data, so it is explicit in the source that this is the standard model rather than a documented platform-specific scope. "Microsoft Advertising" appears as a plain name; "Bing" appears only inside the bracketed official name.

## I. Exact final platform list

Fourteen, in ecosystem order:

| # | Name | Category | Has page | Mark |
|---|---|---|---|---|
| 1 | Meta | Social | ✅ | ✅ |
| 2 | Google Ads | Search | ✅ | ✅ |
| 3 | TikTok | Social | ✅ | ✅ |
| 4 | Snapchat | Social | ✅ | ✅ |
| 5 | X | Social | ✅ | ✅ |
| 6 | LinkedIn | Professional | ✅ | ✅ |
| 7 | DV360 | Programmatic | ✅ | ✅ |
| 8 | CM360 | Ad Serving | ✅ | ✅ |
| 9 | Search Ads 360 | Search | ✅ | ✅ |
| 10 | Amazon Ads | Retail Media | ✅ | ✅ |
| 11 | Microsoft Advertising | Search | — | text |
| 12 | Noon | Commerce & Delivery | — | ✅ |
| 13 | Talabat | Commerce & Delivery | — | ✅ |
| 14 | ChatGPT | AI Platforms | — | text |

`ecosystemPlatforms` is derived: the ten documented platforms are mapped from `platforms` and the four additions appended. Nothing is duplicated by hand, so the list cannot drift out of sync with the platform pages.

## J. Every "ten platforms" reference removed / replaced

`grep -rni "ten platforms"` across the whole application returns **nothing**. Nor does a search for any hardcoded count pattern (`(ten|10|eleven|twelve|fourteen|14)[ -]platforms?`).

| Where | Before | After |
|---|---|---|
| Homepage ecosystem section | "Ten Platforms. One Operations Team." | "Multiple Platforms. One Operations Team." |
| Ecosystem hero stage label | (implied fixed set) | "Input · Advertising, commerce & delivery platforms" |
| Platform network caption | none | "Across major advertising, commerce and delivery platforms" |
| Platform ring counter | "01 / 10" | removed entirely |
| Platforms page, mega-menu, mobile nav | counted phrasing | open-ended phrasing throughout |

A test asserts the strings "ten platforms" and "10 platforms" appear on **no rendered page**, so a count cannot be reintroduced by accident.

## K. Platform ecosystem changes

`EcosystemHero` was rebuilt rather than extended — a 14th node could not be appended to a layout designed for 10 without crowding.

**Composition.** Canvas 860×720. A 74px-radius Trafficomm core at (430, 372). Platforms sit on **three radii** (196 / 272 / 348) across a 180° arc flattened to 0.92 so the composition fills a landscape frame. Ring assignment is staggered — `2,0,1,2,0,1,2,0,2,1,0,2,0,2` — so neighbours in the list are never neighbours on the canvas.

That assignment is not hand-placed. Bounding-box collisions appeared between LinkedIn↔Talabat and Search Ads 360↔Meta among others, so I wrote a solver that evaluates all 3^14 ring assignments scoring clearance and canvas bounds. The chosen layout has **no overlapping nodes** and one 15px minimum-clearance pair.

**Mark prominence.** A third size class, `hero`, was added to every logo entry — larger than the inline size, sized by **optical weight rather than bounding box**. A compact square symbol and a wide wordmark with identical pixel areas do not read as equally heavy, so wordmarks get the pill's full width and stand in for the name:

| Mark | hero size | Note |
|---|---|---|
| Meta | 40×28 | |
| Google Ads, Snapchat, DV360, CM360 | 30×30 | |
| Search Ads 360 | 29×29 | |
| LinkedIn | 29×27 | |
| TikTok | 27×30 | |
| X | 26×26 | wordmark — the X mark *is* the name |
| Amazon Ads | 92×24 | wordmark |
| Noon | 78×21 | wordmark |
| Talabat | 78×26 | wordmark |

Node height is 42px, padding 11/13, logo area 30px, gap 9px, label 12px. The **pill did not grow** — the mark inside it did.

**Connector visibility** was raised from the previous pass: base opacity 0.17 with 1.1px stroke, and 0.95 / 1.8px when a lane is hot.

**Output stage** unchanged in concept: four outputs at y=650 — Execute, Optimize, Measure, Report.

### Motion

Five layers, all CSS transforms or attribute writes on a single `requestAnimationFrame` loop. **No new dependency, no canvas, no WebGL.** GSAP was already in the project and was not used here.

**(A) Platform drift.** Each node is wrapped in a `<g class="eh-drift">` carrying one of three keyframe paths (`eh-drift-a/b/c` in `globals.css`). Amplitude is 3–4 canvas px ≈ 3px on screen — vertical 2.5–3.5px, horizontal 1.5–2.5px. Duration `13 + (i % 5) * 2.6` seconds (13–23.4s) with a negative delay `-((i * 1.7) % 9)s`, so no two nodes share a phase. **No rotation, no scaling, no pulsing.** SVG `<g>` transforms compose, so the drift wrapper animates while the outer `<g>` keeps its `translate(x y)` placement.

**(B) Inbound data flow.** 35 particles — 2–3 per lane, seeded per lane so speeds (0.10–0.32) and offsets are irregular and asynchronous. Every particle travels *toward* the core. Opacity follows `sin(progress · π)`, so particles fade in and out rather than popping at the endpoints.

**(C) Trafficomm → output flow.** 12 particles, 3 per output lane, **identical speed and even spacing** — deliberately more ordered than the inbound side. Inbound traffic is messy; what leaves the operations layer is not. That asymmetry is the point of the diagram.

**(D) Central hub response.** The core ring expands 6→16px and fades, **only** on a user-triggered burst. It never pulses on a timer, and the Trafficomm logo itself is never animated.

**(E) Hover / focus.** The lane turns red at 0.95 opacity, all others drop to a still-visible dim, the matching output lights, and a four-particle burst runs in along the lane and out along the active output. Drift **pauses** on `:hover` / `:focus-within` and on the hot node.

That pause was not cosmetic. Playwright's actionability check refused to `.hover()` a continuously moving element — "element is not stable". Pausing on hover fixed the test and the UX at once: the thing you are reading holds still. Verified with raw `mouse.move()` that drift freezes, one connector turns red and 16 dim.

**Character.** No bouncing, no orbiting logos, no trails, no glow, no sparks. The reference is a network monitor, not a screensaver.

**Performance.** One rAF loop for the whole visual, paused by `IntersectionObserver` when off-screen and by `usePauseSvgWhenHidden` when the tab is hidden. Drift is pure CSS with `will-change: transform`.

**Reduced motion.** `usePrefersReducedMotion` sets `animate = false`: the rAF loop is never created, all particles render at opacity 0, drift is `animation: none` with `will-change: auto`, and every output lane renders in its **solid** state so all four outputs read at once. Nothing is hidden — the complete diagram is visible and understandable, just still. Frame `12-platform-ecosystem-reduced-motion.png`.

**Mobile.** The SVG is `hidden sm:block`. Below 640px the ecosystem is not a shrunken diagram — it is the `PlatformNetwork` list, `R_OUT=42 / R_IN=30` alternating radii, with a name pill for logo-less platforms. Frame `10-platform-ecosystem-hero-390.png`.

**Accessibility.** The SVG is `role="group"` with an `aria-label` that names all fourteen platforms and the four outputs in prose, so the diagram is not merely decorative to a screen reader. Marks themselves stay decorative.

**Recording.** `23-platform-ecosystem-motion.webm`, ~10 seconds, captured via Playwright video (needed `npx playwright install ffmpeg` — this installs to `~/Library/Caches/ms-playwright` and adds nothing to `package.json`). It shows drift, inbound flow, a hover burst and release. **It lives only in the review artifacts; it is not referenced by the application.**

## L. Platform navigation changes

The four additions have no pages, so they must not look clickable.

- **Desktop mega-menu** — the ten linked platforms remain as links; a new `also` block renders below them under the eyebrow "Also operated", as plain text, using each platform's `officialName ?? name` (so Microsoft reads "Microsoft Advertising (Bing)" there).
- **Mobile nav** — the same `also` row inside the expanded Platforms accordion.
- **`/platforms`** — an "Also operated" section alongside the ten platform cards.

A test asserts the additional platforms appear as text and **not** inside an anchor.

## M. Solution visual changes

The five Solutions glyphs were near-identical — the brief's judgement that they were "five almost-identical meaningless icons" was correct. I did not remove them, because five *genuinely different* diagrams communicate the organisational relationship that Solutions is about, which text alone does not. `SolutionGlyph` was rewritten around five distinct `kind`s:

| Solution | kind | Shape |
|---|---|---|
| Media agencies | `fanout` | One source branching to many platforms |
| Performance agencies | `loop` | A red C-bracket return path — execution feeding back to strategy |
| Brands | `extend` | Brand block with a dashed Trafficomm block beside it, same height |
| Publishers & AdTech | `inventory` | An 8-cell inventory grid |
| White label | `behind` | A dashed Trafficomm layer peeking out from behind the agency layer |

A test extracts the DOM signature of each glyph (`li a > span > span[aria-hidden=true]`) and asserts **five distinct signatures**. If two ever converge again, the suite fails.

## N. 70+ metric treatment

`data/metrics.ts`:

```ts
peakTeam: { id: "peakTeam", value: 70, suffix: "+", label: "Team members", detail: "Peak historical team size" }
```

The label is now "Team members" as asked. The qualifier did not move into a tooltip or a footnote — it renders as a visible second line under the figure, in `text-steel` at 0.76–0.8rem, in **all three** places the metric appears: homepage Hero, service-page ProofStrip, and the `/about` scale grid.

Rather than special-casing one metric, I made it universal: **every company figure travels with its qualifier.** That also protects `~$10M`, which now always carries its campaign-scale scope, and a docblock in `metrics.ts` records that the qualifier is not optional.

`companyScaleSentence` still reads "a largest historical team size of 70+".

**No structured data asserts a current headcount.** `grep -rn "numberOfEmployees\|employee"` across `app`, `lib` and `components` returns nothing, and a test asserts `numberOfEmployees` appears in no JSON-LD block on any page.

Frame `14-team-metric.png`.

## O. Assessment form changes

Market(s) and Platforms are **gone**, not hidden.

| Before | After |
|---|---|
| Name | Name |
| Company | Company |
| Work email | Work email |
| **Market(s)** — chip grid | *removed* |
| **Platforms** — chip grid | *removed* |
| Campaign volume | Campaign volume (per month) |
| Biggest operational challenge (optional) | Biggest operational challenge (optional) |
| honeypot | honeypot |

`ChipGroup` and its `toggle` handler were deleted from `AssessmentForm`, along with the now-unused `useId` import. A test asserts the rendered form has exactly **6 inputs** (5 fields + honeypot), **0 checkbox groups** and **0 checkboxes** — so the chips cannot come back unnoticed.

Two copy lines on `/contact` referenced the removed fields and were rewritten:

- "An operations lead reviews your **markets, platforms, volumes** and challenges" → "An operations lead reads your request and where the work is under pressure today."
- "Tell us a little about your **markets, platforms and volumes**…" → "A few details are enough — we work out the rest in the first conversation."

Leaving those in place would have promised a form that no longer exists.

Frames `15-assessment-form-desktop.png`, `16-assessment-form-mobile-390.png`.

## P. Backend / form payload changes

Traced end to end:

| Layer | Change |
|---|---|
| `lib/assessment.ts` | `markets` and `platforms` removed from `AssessmentInput`; their validation branches removed; `marketOptions` and `platformOptions` deleted |
| `app/api/assessment/route.ts` | The outbound webhook payload no longer contains `markets` or `platforms` |
| `components/forms/AssessmentForm.tsx` | `ChipGroup` deleted, state keys gone |

`grep -rn "markets\|platformOptions\|marketOptions"` across those three files returns nothing. No orphaned validator, no dead option list, no field posted but ignored.

## Q. SEO changes

- **No new routes.** `sitemap.ts` derives from the platform/service/solution data, and the four additions have no `href`, so the sitemap is unchanged. No thin pages were created for SEO reasons.
- **Metadata unchanged** except the `/contact` description, which had to follow the copy change.
- **Alt text.** Every platform mark is decorative inside a pill that already carries the visible name, so marks are `alt=""` / `aria-hidden` and the name is the accessible text. This prevents the duplicate screen-reader announcement the brief warned about. The ecosystem SVG carries one prose `aria-label` naming all fourteen platforms.
- **No `numberOfEmployees`**, no fabricated `Organization` claims, no partnership or certification markup for any platform.
- Lighthouse **SEO 100** on both audited pages, all three runs.

## R. Accessibility results

Lighthouse **Accessibility 100** on `/` and `/services/ad-operations`, all three runs each.

One genuine regression was found and fixed during this pass. `/services/ad-operations` scored **97** because the new metric qualifier used `text-steel/80` at 0.78rem, which measures **4.09:1** on white — below the 4.5:1 AA threshold for text that size. The fix was full `text-steel` (#5d5d64) in `ProofStrip`, `Hero` and `About`, which passes. Score returned to 100.

Also verified:

- The tagline is inside the existing home link, so it adds no new tab stop.
- Ecosystem nodes are focusable and the hover treatment is mirrored on `:focus-within`.
- Drift pauses on focus, so a keyboard user reading a node is not reading a moving target.
- Solutions glyphs are `aria-hidden`; the link name comes from the text.
- Form labels survive the simplification; a `^label` regex was needed in tests because optional fields carry a hint span inside the label.

## S. Responsive results

**138 page × width combinations** across the six Playwright widths (1440 / 1280 / 1024 / 768 / 430 / 390): **0 issues** — no horizontal overflow, no clipped text, no target under 44px, no collision.

A further **48 illustration-specific combinations** (8 pages × 6 widths) after the illustration work: **0 issues**, nothing rendering below 60px.

Specific checks:

- Header at all six widths, including the tagline's absence below 420px.
- Ecosystem SVG ≥640px, `PlatformNetwork` list below.
- Services mega-menu panel widened to `w-[min(70rem,94vw)]` (Solutions/Platforms stay at 60rem) so illustration + name + description fit on one line.

## T. Performance results

| Measure | Homepage |
|---|---|
| Total transfer | 409.0 KB across 43 requests |
| Script | 170.5 KB / 10 requests |
| **Image** | **86.6 KB / 20 requests** |
| Font | 59.9 KB / 3 |
| Document | 44.3 KB / 1 |
| Stylesheet | 16.7 KB / 1 |
| Third-party | **0 B** |
| DOM | 1,675 nodes (`/`), 969 (`/services/ad-operations`) |
| TBT | 66–87ms (`/`), 15–20ms (`/services/ad-operations`) |

The motion work added **no JavaScript dependency and no new network request**. Drift is CSS; particles are attribute writes inside the one rAF loop that already existed, paused off-screen and when the tab is hidden.

The six illustrations are **52.7 KB on disk but 14.4 KB over the wire** (2.37–2.44 KB each gzipped). The supplied SVGs carry C2PA content credentials which are ~60% of the on-disk bytes but compress to almost nothing, so I kept them rather than stripping provenance metadata for a saving that does not exist in transit. All instances are `loading="lazy"` with explicit dimensions and a fixed 144:80 aspect ratio, so they cannot cause layout shift.

## U. Lighthouse results

`@lhci/cli@0.15.1`, `throttlingMethod: devtools`, 3 runs per URL, production build. **All assertions passed.**

| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` run 1 | 99 | 100 | 100 | 100 | 1.66s | 0.000 | 66ms |
| `/` run 2 | 99 | 100 | 100 | 100 | 1.74s | 0.000 | 68ms |
| `/` run 3 | 98 | 100 | 100 | 100 | 1.79s | 0.000 | 87ms |
| `/services/ad-operations` run 1 | 99 | 100 | 100 | 100 | 1.64s | 0.031 | 20ms |
| `/services/ad-operations` run 2 | 99 | 100 | 100 | 100 | 1.66s | 0.031 | 19ms |
| `/services/ad-operations` run 3 | 99 | 100 | 100 | 100 | 1.68s | 0.000 | 15ms |

Performance **98–99**, and **100 / 100 / 100** on Accessibility, Best Practices and SEO on every run. This holds the pre-existing 98–99 range with the ecosystem motion and all six illustrations in place.

The CLS 0.031 on `/services/ad-operations` is **pre-existing and intermittent** — it appeared in 2 of 3 runs here, is 0.000 in the third, and is 0.000 un-throttled on both the baseline and this branch. It is a throttled-font-swap artifact, not a regression, but it is a real number and I am not smoothing it over.

## V. Test totals

**653 passed · 37 skipped · 0 failed** — the full suite, including visual regression across 18 pages × 6 widths.

The 37 skips are the intentional desktop-only / mobile-only composition guards (e.g. "mobile rail uses vertical stage buttons with 44px targets" skips on desktop projects).

`tests/launch-prep.spec.ts` adds 194 lines guarding this pass specifically: header descriptor; no "ten/10 platforms" anywhere; 14 ring tabs; additional platforms unlinked; `/platforms/chatgpt` → 404; "Bing" only in the bracketed form; no partnership claims; five distinct solution glyph signatures; 70+ always with its qualifier; no `numberOfEmployees` in JSON-LD; form shape (6 inputs / 0 groups / 0 checkboxes).

One note on the form test. A valid POST returns **503** in a production build because `ASSESSMENT_WEBHOOK_URL` is unset. The assertion accepts `[200, 503]` and separately asserts `body.errors` is undefined — so it proves **validation passed** without pretending the webhook is configured. The 503 is the route refusing loudly rather than silently discarding a lead, which is the correct behaviour; see AC.

## W. Modified test assertions and why

Four assertions changed. **No assertion was weakened**; in each case the old guarantee is still enforced, through the new implementation.

**1. `tests/interactions.spec.ts` — mark count 11 → 13.**
Old guarantee: "the ecosystem renders every platform's official mark." Implementation change: two platforms were added that *have* marks (noon, talabat) and two that deliberately do not (Microsoft, ChatGPT). 12 marks + Meta's mono layer = 13. Guarantee preserved, and **strengthened** — I added assertions that Microsoft Advertising and ChatGPT appear as named nodes, so the text-only treatment is now tested rather than assumed.

**2. `tests/interactions.spec.ts` — explorer test renamed and re-pointed.**
Old guarantee: "selecting a service changes the central visual." It checked for `ServiceGlyph` stage words. Those words were in the generated glyph, which no longer exists. Now it asserts the illustration `src` changes per selection. Same guarantee, new mechanism.

**3. `tests/visual-sitewide.spec.ts` — explorer assertion re-pointed at the image `src`.** Same reason as (2).

**4. `tests/launch-prep.spec.ts` — glyph selector `li a > span[aria-hidden=true]` → `li a > span > span[aria-hidden=true]`.**
This was my bug, not an obsolete guarantee. The looser selector matched nested decorative spans and reported 6 signatures for 5 glyphs. The tightened selector matches one wrapper per glyph. The assertion — five distinct shapes — is unchanged.

Two mechanical adjustments worth recording: `getByRole("link", {name: "Trafficomm — home"})` became header-scoped because the footer link is a strict-mode duplicate, and `getByLabel(label, {exact: true})` became a `^label` regex because optional fields carry a hint span inside the label.

## X. Visual regression results

Full visual suite against `b3d5b3f` baselines at all six widths. Every diff is explained; there is no unexplained movement.

**One false alarm, diagnosed not suppressed.** `/services` initially reported a **73% / 70%** diff at 1280 / 1024. That is not a plausible diff for the change made. Cause: two pages captured concurrently via `Promise.all`, racing the ecosystem animation state. Re-measured sequentially: **0.59% / 0.43%**. Not a regression. All captures were moved to sequential.

**Explained height changes on `/services/ad-operations`** — 256px shorter, fully accounted for by two sections:

| Section | Before | After | Δ | Why |
|---|---|---|---|---|
| ProofStrip | 215px | 239px | **+24** | New metric qualifier lines |
| Conversion / form | 1,232px | 953px | **−279** | The two chip grids removed |

**Also worth recording as process:** deleting baselines makes Playwright *write* them and **fail that run**. The first post-deletion run reported 108 failed; the follow-up run passed 653. The 108 was a snapshot-write artifact, not a failure.

## Y. Information removed

Nothing useful was removed silently. The complete list:

| Removed | Where | Why it was safe |
|---|---|---|
| Market(s) field | Assessment form | Explicitly instructed; the information is gathered in the first conversation instead, which the rewritten copy now says |
| Platforms field | Assessment form | Same |
| "Ten Platforms" / "01 / 10" | Homepage, platform ring | Explicitly instructed; a fixed count is now wrong and would go stale again |
| `ServiceGlyph`, `ModuleViz`, the `viz` field | Codebase | Superseded by the supplied illustrations; zero references remain |
| Monogram fallback in `PlatformMark` | Codebase | See AB — a monogram is an approximated mark, which the brief forbids |
| `service.short` on `/services` cards | Services index | Replaced by `serviceCaption`, which describes what the illustration shows. No SEO term, documented capability, proof point or ownership boundary was removed anywhere |

## Z. Information moved

| Moved | From | To |
|---|---|---|
| Metric qualifiers | Implied by the label ("Peak historical team size" as the label itself) | An explicit visible second line under the figure, in Hero, ProofStrip and About |
| Microsoft's "Bing" reference | Would have been in the display name | Only the bracketed `officialName`, shown in the "Also operated" lists |
| The four additional platforms | Would have been peers of the linked ten | A distinct unlinked "Also operated" group in all three navigation surfaces |
| Market / platform qualification | Form fields | `/contact` copy describing the first conversation |

## AA. Unsupported claims I deliberately refused to add

1. **Any partnership, certification, "preferred partner" or "official partner" status** for any of the fourteen platforms — most pointedly OpenAI, where the brief was explicit. A test asserts no such language appears.
2. **A current headcount.** "70+ Team members" without its qualifier would read as current staff. There is no evidence for that, so the qualifier is mandatory and structurally enforced, and no `numberOfEmployees` exists in any structured data.
3. **Platform-specific capability scope for the four additions.** I had documented Execute/Optimize/Measure/Report scopes for the original ten. For the four new platforms I had no documentation, so they carry the standard model and the data marks them `standardModel: true`. I did not write four plausible-sounding capability lists.
4. **Platform pages for the four additions.** Four thin pages would have implied depth of experience I cannot evidence. They 404 by design.
5. **Any redrawn, approximated or monogrammed logo.** See AB.
6. **Any claim that `~$10M` is Trafficomm revenue.** The campaign-scale qualifier travels with it everywhere.

## AB. Remaining legal / brand concerns

### Platform Brand Asset Audit

| Platform | Display name | Asset used | Source | Local asset path | Changed | Brand / legal concern |
|---|---|---|---|---|---|---|
| Meta | Meta | Meta symbol, official colours | `https://www.meta.com` — official site header lockup | `public/platforms/meta.svg` | unchanged | Standard trademark review. Cropped to the symbol from the lockup; colours unchanged |
| Google Ads | Google Ads | Official product logo, SVG | `https://www.gstatic.com/images/branding/productlogos/ads/v5/192px.svg` | `public/platforms/google-ads.svg` | unchanged | Verified **byte-identical** to live gstatic. Google product-logo terms apply |
| TikTok | TikTok | Official full-colour note mark, SVG | `https://sf16-website.neutral.ttwstatic.com/obj/tiktok_web_static/tiktok/web/tiktok_web_pages/build/_assets/logo-dark-d62c3812fbf2f687daa9.svg` — TikTok's own static CDN, as served to www.tiktok.com | `public/platforms/tiktok.svg` | **CHANGED** | **Improved.** The previous file was a Simple Icons CC0 mark — a third-party icon library, which the brief forbids. Replaced with TikTok's own asset; geometry and colours unchanged, metadata stripped |
| Snapchat | Snapchat | Ghost mark, official black variant | `https://snap.com/en-US/brand-guidelines` (`BLACK_SNAPCHAT_LOGO.svg`) | `public/platforms/snapchat.svg` | unchanged | From Snap's published brand guidelines. Cropped from the official lockup to the Ghost |
| X | X | Official black X mark | `https://about.x.com/en/who-we-are/brand-toolkit` (`x-logo.zip`) | `public/platforms/x.svg` | unchanged | Matches `logo-black.png` in the official kit |
| LinkedIn | LinkedIn | Official InBug, black | `https://brand.linkedin.com/downloads` (`in-logo.zip`, `InBug-Black.png`) | `public/platforms/linkedin.png` | unchanged | PNG, not SVG — LinkedIn's downloads ship raster. Preferred over redrawing |
| DV360 | DV360 | Official product logo, SVG | `https://www.gstatic.com/images/branding/productlogos/display_and_video_360/v1/192px.svg` | `public/platforms/dv360.svg` | unchanged | Verified byte-identical to live gstatic |
| CM360 | CM360 | Official product logo, SVG | `https://www.gstatic.com/images/branding/productlogos/campaign_manager/v6/192px.svg` | `public/platforms/cm360.svg` | unchanged | Verified byte-identical to live gstatic |
| Search Ads 360 | Search Ads 360 | Official product logo, SVG | `https://www.gstatic.com/images/branding/productlogos/search_ads_360/v5/192px.svg` | `public/platforms/search-ads-360.svg` | unchanged | Verified byte-identical to live gstatic |
| Amazon Ads | Amazon Ads | Official horizontal wordmark, Squid Ink | `https://advertising.amazon.com` — official header logo (`Amazon_Ads_Horizontal_SquidInk.png`) | `public/platforms/amazon-ads.png` | unchanged | PNG as distributed. Amazon Ads brand terms apply |
| **Microsoft Advertising** | Microsoft Advertising *(officialName: "Microsoft Advertising (Bing)")* | **None — text treatment** | `https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks` — Microsoft Trademark and Brand Guidelines | *no file, by design* | **NEW — text only** | **Decision, not a gap.** Microsoft's guidelines state its logos and product icons "can never be used without an express license", while permitting the wordmark in text. So the wordmark **is** the compliant treatment. No old "Bing Ads" logo was used — that mark is retired and would have been wrong on both counts |
| **Noon** | Noon | Official one-colour wordmark, SVG (#090909) | `https://login.noon.partners/en` — noon's own partner portal, header wordmark | `public/platforms/noon.svg` | **NEW** | Sourced from noon's own property. Geometry and colour unchanged. **Note:** noon.com itself is behind an Akamai bot wall; I did **not** attempt to bypass it, and took the asset from noon's partner portal instead |
| **Talabat** | Talabat | Official orange lockup, SVG | `https://www.talabat.com/assets/images/remix-logo.svg` — talabat.com header lockup | `public/platforms/talabat.svg` | **NEW** | Talabat's own served asset. Geometry and colours unchanged, metadata stripped |
| **ChatGPT** | ChatGPT | **None — text treatment** | `https://openai.com/brand` — OpenAI Design Guidelines | *no file, by design* | **NEW — text only** | **Decision, not a gap, and flagged as the brief asked.** OpenAI's Design Guidelines list using the logo "without permission" among the Don'ts and route logo requests to `partnercomms@openai.com`. Until that written permission exists, text only. This is the case the brief anticipated: *"If brand-usage restrictions make the logo inappropriate, use a clean text treatment instead and report that decision."* |

**Neither Microsoft nor ChatGPT is a missing file.** `data/platform-logos.ts` carries a docblock saying so explicitly, with the reasoning and the instruction not to "fix" them by sourcing a mark elsewhere. `hasPlatformMark(slug)` is the single source of truth, and `PlatformMark` returns `null` when it is false.

**The monogram fallback was removed.** `PlatformMark` previously drew a lettered monogram for any platform without a file. A monogram *is* an approximated mark, which is precisely what the brief forbids. It now renders nothing, and the pill's visible name carries the meaning.

Two further notes:

- **Zero hotlinks.** Every asset is stored locally under `public/platforms/`. No third-party request is made at runtime — Lighthouse reports **0 B third-party**.
- **Light and dark.** Every mark sits inside an identical light chip at every placement, so each brand's official light-background variant is used as supplied, with **no recolouring** anywhere. This is why marks never appear directly on the ink sections.

### Remaining concerns

1. **Trademark review of all fourteen marks is still a pre-launch legal item**, and is recorded as such in the source. Displaying a mark to indicate platform experience is ordinary practice, but it is a legal judgement, not mine.
2. **ChatGPT and Microsoft Advertising should ideally get written permission** if you want their marks rather than type. Microsoft: an express license. OpenAI: `partnercomms@openai.com`.
3. **Noon and Talabat marks were taken from their own served assets, not from a published brand kit.** Neither company publishes a public media kit I could find. The assets are authentically theirs, but there is no accompanying usage licence to point to.
4. **Amazon Ads and LinkedIn are PNG**, not SVG, because that is what those companies distribute. I preferred the official raster over a redrawn vector.

## AC. Remaining launch blockers

**One hard blocker.**

1. **`ASSESSMENT_WEBHOOK_URL` is not configured.** The assessment form validates correctly and then returns **503** because there is nowhere to deliver the lead. **The form is not launch-ready.** The route refuses loudly rather than accepting and discarding a submission, which is the right failure mode — but it must be configured in Production before launch or you will lose every enquiry. This is the single item that would cost real business on day one.

**Pre-launch configuration**

2. `NEXT_PUBLIC_SITE_URL` and `SITE_INDEXABLE=true` must be set **in Production only**, at launch. Setting either on the preview would make it indexable.
3. **Contact details are still `null`** in `data/site.ts` — `email`, `phone` and `linkedin`. The site launches with no direct contact route other than the form, which is itself blocked by (1).

**Review items**

4. Legal / brand sign-off on all fourteen platform marks (AB).
5. Pre-existing intermittent CLS 0.031 on `/services/ad-operations` under Lighthouse throttling. Cosmetic, 0.000 un-throttled, unchanged from baseline.

## AD. Vercel preview URL

**https://trafficomm-website-2026-35nd8z176-mohdmatheen-7095.vercel.app**

Built automatically by Vercel's GitHub integration from `final-launch-preparation` @ `78e9bfb`. Deployment state **success**. Build inspector: `https://vercel.com/mohdmatheen-7095/trafficomm-website-2026/F5VePQwbb1M2iXV4ou3xUkdiKcoz`

No production deployment was created or promoted.

## AE. Confirmation that the preview is noindex / nofollow

Confirmed by direct response headers on the live preview.

```
x-robots-tag: noindex, nofollow
```

Verified on eleven routes, each returning HTTP 200 with that header: `/`, `/services`, `/services/ad-operations`, `/services/reporting`, `/platforms`, `/about`, `/contact`, `/solutions/media-agencies`, `/case-studies`, `/how-we-work`, `/insights`.

`/robots.txt` on the preview serves:

```
User-Agent: *
Disallow: /
```

`SITE_INDEXABLE` remains **unset** on the preview environment. `/platforms/chatgpt` returns **404** on the live preview, confirming no thin platform page shipped.

## AF. Review-artifact location

Branch **`wave-1-visual-review-artifacts`** @ **`d8b79d2`** — "chore: launch candidate review package". Pushed to origin. Nothing was added to the website branch.

| Path | Contents |
|---|---|
| `review-artifacts/launch/` | 24 items — platform ecosystem, header, navigation, form, metrics, incl. `23-platform-ecosystem-motion.webm` and `24-launch-candidate-contact-sheet.png` |
| `review-artifacts/service-illustrations/` | 23 items — all six illustrations as implemented, with before/after pairs and two contact sheets |
| `review-artifacts/README-launch-candidate.md` | Frame-by-frame guide to both folders |
| `review-artifacts/REPORT-launch-preparation.md` | This report |
| `review-artifacts/REPORT-service-illustrations.md` | The illustrations report |

`.vercelignore` already excludes `tests/__screenshots__`, `test-results`, `playwright-report` and `.lighthouseci`, so no QA artifact reaches a preview upload. The motion recording exists only here and is not referenced by the application.

## AG. Confirmation that production / main / DNS were NOT touched

**Nothing was merged. Nothing was force-pushed. No history was rewritten.**

All eight protected branches verified at their original commits:

| Branch | Commit |
|---|---|
| `main` | `fe98603` |
| `website-review` | `fe98603` |
| `site-audit-refinement` | `ea532c7` |
| `site-wide-visual-storytelling` | `3845693` |
| `visual-storytelling-prototype` | `8bf2f40` |
| `visual-storytelling-refinement` | `70d3e54` |
| `visual-storytelling-wave-1` | `b89a63d` |
| `final-visual-refinement` | `b3d5b3f` |

Also confirmed:

- **`trafficomm.com` was not modified.** No production deployment was created or promoted.
- **No DNS record was viewed or changed.**
- **Production indexing was not enabled.** `SITE_INDEXABLE` is unset everywhere.
- Only two branches were written: `final-launch-preparation` (the candidate) and `wave-1-visual-review-artifacts` (review material).

---

**STOPPED.** Not merged, production not deployed, indexing not enabled. Awaiting your explicit instruction to launch.

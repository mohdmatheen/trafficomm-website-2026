# Trafficomm — supplied service illustrations, integrated

A note on the report format first: the exact A–Q letter labels from your brief are no longer in my context after a conversation compaction. Rather than guess which letter went with which heading, I have reported **every item the brief asked for**, under its own heading, in the brief's order. If your lettering differs, tell me and I will relabel.

---

## 1. ZIP inspection, before any code was touched

Extracted `Service illustrations redesign.zip`:

```
design_handoff_service_illustrations/
  README.md
  Service Illustrations.dc.html     ← design reference, explicitly "Do not ship it"
  screenshots/
    illustrations-2x.png
    menu-in-context.png
  svg/
    ad-operations.svg
    creative-adtech.svg
    measurement-analytics.svg
    performance-marketing.svg
    programmatic-operations.svg
    reporting-insights.svg
```

The handoff was unambiguous, so nothing had to be inferred:

- **Explicit service → file mapping** in the README.
- **"`svg/*.svg` are production-ready assets. Use them directly."**
- **"High fidelity. Use the SVG geometry exactly as delivered."**
- `viewBox="0 0 144 80"`, render at 144×80, keep the 9:5 ratio, `flex: none`.
- "Sits to the left of the title/description, top-aligned. ~24px gap."
- **"Decorative: `aria-hidden="true"` / `alt=""` (the adjacent title labels the item)."**
- **"There is no new behavior."**
- One red element per illustration, marking the outcome.
- Palette: ink `#141414`, red `#e8463d`, grey `#b9b9b4`, light `#ecece8`, paper `#ffffff`.

`Service Illustrations.dc.html` was read as reference and **not shipped**.

## 2. SERVICE → SUPPLIED ILLUSTRATION → WEBSITE COMPONENT mapping

| Service (route slug) | Supplied file | Shipped as | Rendered in |
|---|---|---|---|
| Ad Operations (`ad-operations`) | `ad-operations.svg` | `public/illustrations/services/ad-operations.svg` | Mega-menu, mobile nav, homepage explorer, `/services` card |
| Performance Marketing (`performance-marketing`) | `performance-marketing.svg` | `…/performance-marketing.svg` | Mega-menu, mobile nav, homepage explorer, `/services` card |
| Programmatic Operations (`programmatic`) | `programmatic-operations.svg` | `…/programmatic.svg` | Mega-menu, mobile nav, homepage explorer, `/services` card, **page hero** |
| Measurement & Analytics (`measurement`) | `measurement-analytics.svg` | `…/measurement.svg` | Mega-menu, mobile nav, homepage explorer, `/services` card, **page hero** |
| Reporting & Insights (`reporting`) | `reporting-insights.svg` | `…/reporting.svg` | Mega-menu, mobile nav, homepage explorer, `/services` card, **page hero** |
| Creative & AdTech (`creative-adtech`) | `creative-adtech.svg` | `…/creative-adtech.svg` | Mega-menu, mobile nav, homepage explorer, `/services` card |

Three files were **renamed only**, to match the existing route slugs (`measurement-analytics` → `measurement`, `programmatic-operations` → `programmatic`, `reporting-insights` → `reporting`), so the illustration map is keyed by the same slug as everything else in the codebase.

**All six are byte-identical to the supplied files.** Verified with `cmp`:

```
ad-operations.svg          IDENTICAL to supplied ad-operations.svg
creative-adtech.svg        IDENTICAL to supplied creative-adtech.svg
measurement.svg            IDENTICAL to supplied measurement-analytics.svg
performance-marketing.svg  IDENTICAL to supplied performance-marketing.svg
programmatic.svg           IDENTICAL to supplied programmatic-operations.svg
reporting.svg              IDENTICAL to supplied reporting-insights.svg
```

Nothing was redesigned, reinterpreted, recoloured, cropped, redrawn or re-exported.

## 3. Component built

`components/visual/ServiceIllustration.tsx` — one file, three exports:

- **`ServiceIllustration({ slug, width })`** — fixed-width, for menu rows and explorer tabs.
- **`ServiceIllustrationFluid({ slug })`** — `w-full`, for cards and page heroes.
- **`serviceCaption`** — one short line per service describing what its illustration shows.

Both renderers emit `<img>` with `alt=""`, `aria-hidden="true"`, `loading="lazy"`, explicit `width`/`height`, and `aspectRatio: "144 / 80"` so the ratio is preserved and the box is reserved before load (no layout shift).

## 4. (A) Services mega-menu

The `ServiceGlyph` miniatures are gone. Each row is now:

```
[ ILLUSTRATION 144×80 ]   Service Name
                          Short supporting description
```

`gap-5 py-3` on service rows (vs `gap-3 py-2.5` for Solutions/Platforms), matching the handoff's ~24px gap, with `shrink-0` so the illustration never compresses.

**The panel was widened** from `w-[min(60rem,92vw)]` to `w-[min(70rem,94vw)]` for `kind === "service"` only. Without the extra width the 144px illustration forced service names onto two lines. Solutions and Platforms keep 60rem — they have no illustration and did not need it.

Service names carry `whitespace-nowrap` so they cannot wrap.

**The panel background is `bg-white`** — which is exactly the condition the handoff's `#ffffff` knock-outs assume, so the QA check circles in Ad Operations and Measurement read correctly with no adaptation at all.

Frames `01-services-mega-menu-1440.png`, `18-BEFORE` / `19-AFTER`.

## 5. Mobile navigation

The same illustration at `width={92}` inside the Services accordion. Not a shrunken desktop row and not a 20px icon — still a legible illustration, sized to the narrower column.

Frame `02-services-menu-mobile-390.png`.

## 6. (B) Homepage service explorer

- **Tabs** — `ServiceIllustration width={72}`, so each of the six tabs is identifiable by artwork before you read it.
- **Panel** — `ServiceIllustrationFluid` at `max-w-[30rem]`, the largest presentation on the site.
- The panel's `glyphCaption` was replaced by `serviceCaption`.
- Panel min-height retuned to `min-h-[17rem] … sm:min-h-[16rem]` so switching services does not jump the page.

Frames `03`–`08` (all six states), `09-explorer-mobile-390.png`.

## 7. (C) `/services` index

This is the page the brief asked to become the clearest visual overview of the portfolio, so it got the most attention.

`ServiceModuleCard` now leads with a dedicated illustration block:

```tsx
<div className="flex justify-center bg-paper px-5 py-6">
  <ServiceIllustrationFluid slug={service.slug} className="max-w-[15rem]" />
</div>
```

Two supporting fixes:

- **`service.short` was removed** from the card and replaced with `serviceCaption[service.slug]`. The old summary re-explained in prose what the illustration now shows. The caption instead tells you what you are looking at — "Bid, scan inventory, win the impression" — which is the brief's instruction to reduce text the illustration already carries.
- **`min-h-[3.25rem]` on the scope header.** The Reporting scope line wraps to two lines and was knocking the card row out of alignment.

A test asserts **all six cards resolve to six different `src` values** — "all six services are distinguishable by artwork alone". If two ever collide, the suite fails.

Frames `10`–`11`, `20-BEFORE` / `21-AFTER`.

## 8. (D) Individual service pages — three changed, three deliberately not

This is where I applied the brief's constraint most conservatively.

| Service | Hero visual | Decision |
|---|---|---|
| Ad Operations | Lifecycle rail (unchanged) | **Kept** — an approved bespoke system |
| Performance Marketing | `PerformanceSignalBoard` (unchanged) | **Kept** — an approved bespoke system |
| Creative & AdTech | `CreativeFormatBoard` (unchanged) | **Kept** — an approved bespoke system |
| Programmatic | **Now the supplied illustration** | Was a generic `ModuleViz` module diagram |
| Measurement | **Now the supplied illustration** | Was a generic `ModuleViz` module diagram |
| Reporting | **Now the supplied illustration** | Was a generic `ModuleViz` module diagram |

The rule in `ServiceTemplate` is explicit in code: if a service declares its own `heroVisual`, use it; otherwise use the illustration. So the illustration replaced only the generic placeholder, never approved work — exactly the brief's *"DO NOT replace the detailed visual storytelling systems we already built"*.

**Every deeper system on every one of the six pages is untouched.** The ad-operations 8-stage pipeline, the measurement signal journey, the reporting dashboard, the programmatic ownership lanes, the optimization engine, the format explorer — all unchanged.

One layout bug found and fixed: the hero container was `h-40`, a fixed height sized for the old `ModuleViz`. The illustration sets its own height from its 9:5 ratio, so at `h-40` it collided with the "Platforms involved" row on Measurement. Changed to `px-6 py-7`, letting the ratio decide.

Frames `12`–`17` (all six heroes).

## 9. Text reduction

Measured on the live previews — baseline `b3d5b3f` vs candidate `78e9bfb` — by stripping tags and scripts and counting words.

| Page | Before | After | Δ |
|---|---|---|---|
| `/services` | 627 | 597 | **−30** |
| `/services/ad-operations` | 1,345 | 1,330 | −15 |
| `/services/performance-marketing` | 1,064 | 1,067 | +3 |
| `/services/programmatic` | 748 | 751 | +3 |
| `/services/measurement` | 864 | 867 | +3 |
| `/services/reporting` | 948 | 951 | +3 |
| `/services/creative-adtech` | 913 | 916 | +3 |
| `/` | 1,618 | 1,633 | +15 |

The −30 on `/services` is the six card summaries replaced by six shorter captions. The uniform **+3 per service page** is the launch-preparation metric qualifier, not illustration copy. The −15 on ad-operations is that +3 against the removed form chip labels. The +15 on the homepage is the three hero qualifier lines.

**Nothing protected was removed.** No SEO terminology, no documented capability, no proof point, and no ownership boundary was cut on any page. The only prose removed anywhere is the six card summaries, and each was replaced by a caption describing the artwork.

## 10. Art direction preservation

| Constraint | Status |
|---|---|
| No recolouring | ✅ Files byte-identical; nothing was mapped to CSS variables |
| No gradients added | ✅ |
| No stock imagery | ✅ |
| No shadows on the artwork | ✅ |
| No cropping | ✅ `viewBox` untouched |
| No distortion | ✅ `aspectRatio: "144 / 80"` at every placement |
| No Lucide / icon-library redraws | ✅ `ServiceGlyph` deleted, not reimplemented |
| One red outcome mark per illustration | ✅ preserved as supplied |

The handoff offered an optional adaptation: *"Paper `#ffffff`: knock-outs… If the menu background isn't white, set this to the menu background."* The knock-outs are the QA checkpoint circle fills in Ad Operations and Measurement, each with its own `#141414` stroke.

- In the mega-menu the background **is** `bg-white`, so it is exact.
- On `/services` cards and page heroes the background is `bg-paper` `#f6f6f3` — a 3-unit luminance difference inside a stroked 7px circle, imperceptible.

Taking the adaptation would have meant editing the supplied geometry for no visible gain, against an explicit "use the geometry exactly as delivered". **I left the files alone and am reporting the decision** rather than making it silently.

## 11. Background integration — and one finding that shaped every placement

I rendered all six illustrations on white, on paper `#f6f6f3` and on ink `#0c0c0d`.

**On ink, the artwork breaks.** The primary `#141414` strokes are nearly the background colour, so Performance loses its funnel baseline, Programmatic loses its buyer node, and Reporting loses its trend line — the exact elements that carry the meaning.

So **no illustration was placed on a dark section anywhere on the site.** Every placement is on white or paper. This was not a stylistic preference; a dark placement would have shipped six illustrations with their content invisible.

Worth recording for future work: if a dark-section placement is ever wanted, it needs a light-stroke variant from the original design source — not a filter, and not a recolour on my side.

## 12. Responsive behaviour at all six widths

**48 combinations** — 8 pages × 6 widths (1440 / 1280 / 1024 / 768 / 430 / 390): **0 issues**. No horizontal overflow, no clipping, no collision, and **nothing rendering below 60px**.

Mobile does not simply shrink the desktop illustration; each surface has its own size:

| Surface | Width |
|---|---|
| Mega-menu row (desktop) | 144px, `shrink-0` |
| Mobile nav row | 92px |
| Explorer tab | 72px |
| Explorer panel | fluid to `max-w-[30rem]` |
| `/services` card | fluid to `max-w-[15rem]` |
| Service page hero | fluid to `max-w-[24rem]` |

### Mobile heights, baseline → candidate, at 390px

| Page | Before | After | Δ | Cause |
|---|---|---|---|---|
| `/services` | 7,722 | 8,019 | **+297** | Six illustration blocks added to the cards |
| `/services/ad-operations` | 14,931 | 14,583 | **−348** | Form chip grids removed (launch-prep) |
| `/services/performance-marketing` | 11,318 | 11,314 | −4 | Approved hero kept |
| `/services/programmatic` | 9,882 | 9,946 | +64 | Illustration hero replacing the fixed-height `ModuleViz` box |
| `/services/measurement` | 11,369 | 11,434 | +65 | Same |
| `/services/reporting` | 14,023 | 14,087 | +64 | Same |
| `/services/creative-adtech` | 12,476 | 12,472 | −4 | Approved hero kept |
| `/` | 21,994 | 22,228 | +234 | Explorer panel min-height + metric qualifiers |

The three unchanged-hero pages move by −4px, which is the right sanity check: where the illustration did not land, nothing moved.

## 13. Asset quality

| File | On disk | Gzipped |
|---|---|---|
| `ad-operations.svg` | 8,909 B | 2,435 B |
| `creative-adtech.svg` | 8,609 B | 2,391 B |
| `measurement.svg` | 8,790 B | 2,427 B |
| `performance-marketing.svg` | 8,536 B | 2,375 B |
| `programmatic.svg` | 9,161 B | 2,394 B |
| `reporting.svg` | 8,701 B | 2,410 B |
| **Total** | **52.7 KB** | **14.4 KB** |

All six are SVG. No raster, no huge payload.

The supplied files carry **C2PA content credentials**, which are roughly 60% of the on-disk bytes. They compress to almost nothing — 8.9 KB becomes 2.4 KB over the wire. **I kept them.** Stripping provenance metadata from supplied design assets to save bytes that do not exist in transit is a bad trade.

Homepage image budget with all six illustrations and twelve platform marks in place: **86.6 KB across 20 requests**, total page transfer 409 KB, **0 B third-party**.

## 14. Accessibility

Exactly as the handoff specified, at all 13 instances: `alt=""` and `aria-hidden="true"`.

The illustrations reinforce a visible title in every placement — menu row, explorer tab, card, hero — so they are genuinely decorative, and announcing them would duplicate the heading a screen reader has just read. Verified: 13 of 13 instances are decorative.

Lighthouse **Accessibility 100** on `/` and `/services/ad-operations`, all three runs.

## 15. No automatic animation

**The supplied illustrations are never animated.** No entrance transition, no hover transform, no scroll reveal, no drawing effect. The handoff said *"There is no new behavior. Keep the menu item's existing hover state."*

The existing menu row hover — `hover:bg-paper` on the row — is unchanged. The illustration inside it does not react.

Under `prefers-reduced-motion` there is nothing to disable, because nothing moves.

## 16. Scope kept

- **Platform work untouched.** No change to `EcosystemHero`, `PlatformNetwork`, `PlatformMark`, `platform-logos.ts` or any platform asset in this commit.
- **Solutions untouched.** The six service illustrations are **not** reused for Solutions. `SolutionGlyph` keeps its own five distinct diagrams (`fanout`, `loop`, `extend`, `inventory`, `behind`), and a test asserts five distinct DOM signatures.

## 17. Obsolete code removed

Audited for remaining usage after integration, then deleted:

| Deleted | Evidence it was fully superseded |
|---|---|
| `components/visual/ServiceGlyph.tsx` | Zero references site-wide |
| `components/visualizations/ModuleViz.tsx` | Only consumer was the `ServiceTemplate` hero fallback |
| `viz` field on the `Service` type | Only consumer was `ModuleViz` |
| `viz:` entries in all six `data/services.ts` records | Same |
| `glyphCaption` | Replaced by `serviceCaption` |

`grep -rn "ServiceGlyph\|ModuleViz\|glyphCaption\|\bviz\b"` across `app`, `components`, `data`, `lib` and `tests` returns **nothing**. No dead export, no orphaned data field.

## 18. Performance

`@lhci/cli@0.15.1`, `throttlingMethod: devtools`, 3 runs per URL, production build, **after** the illustrations landed. All assertions passed.

| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT | DOM |
|---|---|---|---|---|---|---|---|---|
| `/` | 99 / 99 / 98 | 100 | 100 | 100 | 1.66–1.79s | **0.000** | 66–87ms | 1,675 |
| `/services/ad-operations` | 99 / 99 / 99 | 100 | 100 | 100 | 1.64–1.68s | 0.031 / 0.031 / 0.000 | 15–20ms | 969 |

**The 98–99 Performance range and 100 / 100 / 100 target is preserved**, with all six illustrations and the ecosystem motion in place.

Specific checks the brief asked for:

- **Image payload** — 86.6 KB / 20 requests on the homepage; the six illustrations are 14.4 KB of that over the wire.
- **Startup JS** — 170.5 KB / 10 requests. The illustrations add **no JavaScript**: they are `<img>` tags, not components with runtime logic.
- **DOM** — 1,675 nodes on `/`, well under the 2,500 assertion. Replacing inline glyph SVG with `<img>` reduced node count on menu-bearing pages.
- **LCP** — 1.66–1.79s; the illustrations are `loading="lazy"` and none is the LCP element.
- **CLS** — **0.000** on the homepage. Explicit `width`/`height` plus a fixed `aspectRatio` reserve the box before load, so an illustration cannot shift anything.
- **Menu opening** — no measurable cost; the menu renders six `<img>` instead of six inline SVG trees.

The CLS 0.031 on `/services/ad-operations` is pre-existing and intermittent (0.000 in the third run, 0.000 un-throttled on both baseline and branch). Not caused by this work, and I am reporting it rather than rounding it away.

## 19. Tests

**653 passed · 37 skipped · 0 failed** — the full suite at `78e9bfb`, including visual regression across 18 pages × 6 widths. Re-run fresh for this report; runtime 8.7 minutes.

Two assertions were re-pointed, neither weakened:

1. **Explorer test, `tests/interactions.spec.ts`** — the old guarantee was "selecting a service changes the central visual", checked via `ServiceGlyph` stage words. Those words lived in the generated glyph, which no longer exists. It now asserts the illustration `src` changes per selection. Same guarantee, new mechanism.
2. **`tests/visual-sitewide.spec.ts`** — same change, re-pointed at the image `src`.

And one assertion was **added**: "all six services are distinguishable by artwork alone", asserting six distinct `src` values across the explorer. That is a guarantee the old glyph system never had.

## 20. Visual QA captures and before/after

Branch **`wave-1-visual-review-artifacts`** @ `d8b79d2`, at `review-artifacts/service-illustrations/` — 23 items:

| # | Frame |
|---|---|
| 01–02 | Services mega-menu, 1440 and 390 |
| 03–08 | Homepage explorer, all six states |
| 09 | Explorer at 390 |
| 10–11 | `/services` overview, 1440 and 390 |
| 12–17 | All six service-page heroes |
| **18 / 19** | **BEFORE / AFTER — mega-menu** (generated glyphs → supplied illustrations) |
| **20 / 21** | **BEFORE / AFTER — `/services`** (generic module diagrams → supplied illustrations) |
| 22 | Six-illustration contact sheet, as implemented |
| 23 | Before/after contact sheet |

Nothing was added to the website branch. `.vercelignore` already excludes every QA output directory.

## 21. Concerns

1. **Dark sections are permanently closed to these illustrations** until a light-stroke variant exists from the original design source (section 11). Nothing on the site needs one today, but it will constrain any future dark-section design.
2. **Ad Operations, Performance Marketing and Creative & AdTech page heroes still use their own approved boards**, so their supplied illustration appears only in navigation, the explorer and the `/services` card. That follows the brief's instruction not to supersede the approved systems, but it does mean three of the six illustrations never appear at hero size. If you would rather see them there, that is a design call I deliberately left to you.
3. **The C2PA content credentials remain embedded.** They cost nothing in transit but are inspectable in the served file. Say the word if you would rather they were stripped.

---

**STOPPED.** Committed and pushed to `final-launch-preparation`; preview deployed and verified `noindex, nofollow`. Not merged, production not deployed, indexing not enabled.

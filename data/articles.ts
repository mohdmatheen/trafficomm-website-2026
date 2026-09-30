import type { Article } from "./types";

/**
 * Performance Lab content. Structured blocks keep the renderer CMS-agnostic:
 * a headless CMS adapter only needs to map its rich text into ArticleBlock[].
 * Charts use Trafficomm's documented figures only — no third-party market
 * statistics are included until they can be cited.
 */
const labAuthor = { name: "Trafficomm Performance Lab", role: "Operations & performance team" };

export const articles: Article[] = [
  {
    slug: "saudi-digital-advertising-outlook-2027",
    title: "Saudi Digital Advertising Outlook 2027",
    dek: "What media teams planning for Saudi Arabia in 2027 should prepare for operationally — from platform mix and Arabic-first creative to measurement and campaign velocity.",
    category: "Industry Insight",
    author: labAuthor,
    publishedAt: "2026-09-08",
    hero: { kicker: "Market Outlook", motif: "bars" },
    tags: ["Saudi Digital Advertising", "GCC Digital Advertising", "Planning"],
    body: [
      {
        type: "callout",
        title: "Editor's note",
        text: "This outlook is qualitative and drawn from operating experience on Gulf campaigns. It deliberately contains no market-size or growth forecasts; quantitative data will be added only with cited sources.",
      },
      {
        type: "p",
        text: "In our operating experience, Saudi Arabia is an operationally demanding advertising market. Campaign calendars are dense, platform mixes are broad and audiences move quickly between formats. For media teams, the question for 2027 is less about whether to invest and more about whether the operation behind the plan can keep up.",
      },
      { type: "h2", text: "1. Platform mix will keep widening", id: "platform-mix" },
      {
        type: "p",
        text: "Saudi media plans routinely span social, search, video and programmatic in a single flight. Snapchat, TikTok, Meta, YouTube and X often sit alongside Google search and DV360 buys. Each platform has its own specs, naming, approval flows and reporting logic — and every additional platform multiplies setup, QA and reporting work.",
      },
      {
        type: "ul",
        items: [
          "Standardize naming conventions across platforms before the year starts, not mid-flight.",
          "Build a single creative spec matrix that covers every placement in the plan.",
          "Consolidate cross-platform reporting into one template to avoid manual reconciliation.",
        ],
      },
      { type: "h2", text: "2. Arabic-first creative multiplies versions", id: "creative" },
      {
        type: "p",
        text: "Bilingual executions, right-to-left layouts and market-specific messaging increase the number of creative variants per campaign. Every variant needs auditing against platform specs and every tag needs testing. Creative QA becomes a volume problem, not an occasional check.",
      },
      { type: "h2", text: "3. Seasonal peaks compress timelines", id: "seasonality" },
      {
        type: "p",
        text: "Ramadan, Eid, national occasions and major entertainment and sporting events create sharp launch peaks. Teams sized for average months struggle during these windows. The practical answer is elastic operational capacity: a trained team that can absorb launch spikes without rushed hiring.",
      },
      {
        type: "quote",
        text: "More media shouldn't mean more operational complexity. The teams that win peak season are the ones who planned their operation, not just their media.",
        cite: "Trafficomm Performance Lab",
      },
      { type: "h2", text: "4. Measurement must be settled before spend", id: "measurement" },
      {
        type: "p",
        text: "As more budget moves to performance objectives, the reliability of GA4, Google Tag Manager and server-side signals such as Meta CAPI directly affects platform optimization. Measurement gaps discovered mid-campaign are expensive. Audit and validate tracking before the first flight of the year.",
      },
      { type: "h2", text: "5. Operating model is the real differentiator", id: "operating-model" },
      {
        type: "p",
        text: "Agencies and brands serving Saudi Arabia increasingly separate what must be close to the client — strategy, planning, relationships — from what benefits from centralization and scale: trafficking, QA, monitoring and reporting. Getting that split right frees senior talent to focus on the work clients value most.",
      },
      {
        type: "table",
        caption: "A 2027 operational readiness checklist",
        head: ["Area", "Question to answer before Q1", "Owner"],
        rows: [
          ["Platforms", "Is every platform in the plan covered by trained operators?", "Ad operations lead"],
          ["Creative", "Is there a spec matrix and QA step for every variant?", "Creative / ad ops"],
          ["Peaks", "What capacity is available for Ramadan and event launches?", "Head of media"],
          ["Measurement", "Are GA4, GTM and CAPI validated end to end?", "Measurement lead"],
          ["Reporting", "Is cross-platform reporting consolidated and scheduled?", "Account lead"],
        ],
      },
    ],
    related: ["agency-guide-to-outsourcing-ad-operations", "building-vs-outsourcing-ad-operations-team"],
    links: [
      { href: "/services/performance-marketing", label: "Performance Marketing", meta: "Service" },
      { href: "/solutions/media-agencies", label: "For media agencies", meta: "Solution" },
    ],
  },
  {
    slug: "campaign-launch-qa-checklist",
    title: "The Agency Campaign Launch QA Checklist",
    dek: "A practical pre-launch and post-launch QA checklist for digital advertising campaigns — covering brief, structure, budget, targeting, placements, creative, tracking, final review and launch verification.",
    category: "Guide",
    author: labAuthor,
    publishedAt: "2026-10-01",
    hero: { kicker: "Operator's Checklist", motif: "grid" },
    tags: ["Campaign QA", "Campaign Trafficking", "Ad Operations", "Campaign Setup"],
    body: [
      {
        type: "p",
        text: "Campaign errors are rarely dramatic. They are usually small mismatches between the approved plan and what actually reaches the advertising platform — a budget entered at ad-set level instead of campaign level, a start date in the wrong timezone, a landing URL missing its tracking parameters, a creative mapped to a placement it does not fit. Each is trivial to fix before launch and expensive to discover afterwards, because by then it has produced delivery.",
      },
      {
        type: "p",
        text: "This checklist covers the checks worth running before a campaign goes live and immediately after it does. It is platform-neutral: the disciplines are the same everywhere, but the field names differ, so adapt it to the campaign, the platform and your own workflow rather than applying it literally.",
      },
      {
        type: "callout",
        title: "In brief",
        text: "Campaign QA has two jobs. Before launch, it validates the campaign as configured against the campaign as briefed and planned — structure, budget, dates, targeting, placements, creative, tracking and naming. After launch, it confirms that the platform is actually delivering and that tracking and reporting behave as expected, because some faults only become visible once serving begins. Not every check below applies to every platform or every campaign; items marked \"where applicable\" depend on the platform, the buying type or the measurement setup in use.",
      },

      { type: "h2", text: "01 — Brief and media plan", id: "brief-media-plan" },
      {
        type: "p",
        text: "Before anything is built, confirm that the instruction is complete and approved. Most downstream QA failures trace back to a gap at this stage rather than a mistake in the platform.",
      },
      {
        type: "ul",
        items: [
          "Correct advertiser or client, and the correct brand or product within it.",
          "Correct advertising platform and the correct account or entity within that platform.",
          "Approved media plan available, and the version being built from is the current one.",
          "Campaign objective and the KPI it will be measured against, both stated rather than inferred.",
          "Approved budget, and whether it is gross or net of fees.",
          "Flight dates, including any phase or burst structure.",
          "Geography and audience instructions as briefed.",
          "Creative requirements, formats and the source of the approved assets.",
          "Reporting requirements, format and cadence.",
          "Named approval owner — who signs off before this goes live.",
        ],
      },
      {
        type: "p",
        text: "Where a field is missing, ask rather than assume. Why structured briefs matter, and what an execution team needs from one, is covered in [the ad operations outsourcing guide](/insights/agency-guide-to-outsourcing-ad-operations).",
      },

      { type: "h2", text: "02 — Account and campaign structure", id: "campaign-structure" },
      {
        type: "p",
        text: "Structure determines what can be reported on later, so it is worth checking against the plan rather than against convenience.",
      },
      {
        type: "ul",
        items: [
          "Campaign built in the correct account, and under the correct advertiser or brand where the platform separates them.",
          "Campaign objective matches the brief — not the objective the platform defaulted to.",
          "Campaign, ad set or ad group structure matches how the plan needs to be reported and optimised.",
          "Naming convention applied consistently at every level of the hierarchy.",
          "Buying type correct — where applicable.",
          "Optimisation event set to the action the KPI actually depends on — where applicable.",
          "Conversion location correct — where applicable.",
          "Bid strategy matches the plan — where applicable.",
          "Campaign status is paused or in draft until final approval is given.",
          "Duplicated, test or draft campaigns removed, or clearly named so they cannot be mistaken for live ones.",
        ],
      },

      { type: "h2", text: "03 — Budget, dates and pacing setup", id: "budget-dates" },
      {
        type: "p",
        text: "Budget and date errors are among the easiest to make and the most immediately costly, because they affect delivery from the first hour.",
      },
      {
        type: "ul",
        items: [
          "Total approved budget matches the media plan.",
          "Budget entered in the platform matches the plan after any fee or currency conversion.",
          "Daily versus lifetime budget set as intended.",
          "Budget applied at the correct level — campaign versus ad set or ad group — and not duplicated across both.",
          "Start date and end date correct, including the end date's inclusivity.",
          "Start time correct where the platform allows one.",
          "Account timezone confirmed, and the dates interpreted in that timezone rather than the operator's.",
          "Pacing set as intended — even, accelerated or front-loaded.",
          "Bid caps, budget caps or spend limits set as briefed — where applicable.",
          "Scheduled changes, dayparting or flight-phase changes configured — where applicable.",
        ],
      },
      {
        type: "p",
        text: "Timezone is the most common silent error here: an account set to a different timezone from the plan can start a campaign a day early or end it a day late, and neither is visible in the setup sheet.",
      },

      { type: "h2", text: "04 — Targeting and geography", id: "targeting" },
      {
        type: "p",
        text: "Every targeting setting should trace back to the approved brief. Restrictions that were not asked for narrow delivery as effectively as mistakes do.",
      },
      {
        type: "ul",
        items: [
          "Countries, regions or cities match the plan, at the granularity the plan specifies.",
          "Location targeting method correct — presence, interest or residence — where the platform distinguishes them.",
          "Audience segments correct, and sourced from the intended audience set.",
          "First-party or customer-list audiences applied and matched — where applicable.",
          "Remarketing audiences applied at the correct level — where applicable.",
          "Audience exclusions applied as briefed.",
          "Remarketing or converter exclusions applied — where required by the plan.",
          "Age and gender set only where the brief specifies them, and left open where it does not.",
          "Language targeting set only where specified.",
          "Device targeting matches the plan and the creative formats in use — where applicable.",
          "Frequency controls configured — where applicable.",
        ],
      },

      { type: "h2", text: "05 — Placements and inventory", id: "placements" },
      {
        type: "p",
        text: "Placement settings decide where a campaign can serve and, often unintentionally, how much of the planned audience it can reach at all.",
      },
      {
        type: "ul",
        items: [
          "Automatic versus manual placements set as the plan intends.",
          "Selected placements match the plan, and the plan's placements are all actually available on this objective.",
          "Device and inventory settings correct.",
          "Placement exclusions applied — where applicable.",
          "Publisher, site or app exclusion lists applied — where applicable.",
          "Brand-safety or inventory-quality controls set to the agreed level — where applicable.",
          "Inventory type correct — where applicable.",
          "Deal or PMP identifiers attached and transacting — where applicable.",
          "Every selected placement is compatible with the creative formats being trafficked to it.",
          "No delivery setting unintentionally restricts scale below what the plan assumes.",
        ],
      },

      { type: "h2", text: "06 — Creative", id: "creative" },
      {
        type: "p",
        text: "Creative should be checked against two things: the asset that was approved, and the placement it will actually serve in.",
      },
      {
        type: "ul",
        items: [
          "Correct approved asset, from the agreed source rather than an earlier email.",
          "Correct creative version where more than one exists.",
          "Dimensions, aspect ratio, file size and duration within platform specification.",
          "Headline, body copy and any text overlay match the approved version.",
          "Call to action correct and consistent with the landing experience.",
          "Landing URL attached to the correct creative.",
          "Creative-to-placement compatibility confirmed — the asset renders as intended where it will serve, not only in the preview.",
          "Creative naming follows the convention.",
          "Tracking attached to the creative — where applicable.",
          "All required approvals complete, including client approval where the engagement requires it.",
          "Platform creative status checked for rejection, limited status or policy flags — where the platform exposes it.",
        ],
      },

      { type: "h2", text: "07 — URLs, tracking and measurement", id: "tracking-measurement" },
      {
        type: "p",
        text: "This is the stage most worth slowing down for. A tracking fault does not stop delivery, so nothing signals it — the campaign runs normally and the data is wrong until someone checks.",
      },
      {
        type: "ul",
        items: [
          "Final landing URL correct for each creative, and pointing at the intended page rather than a homepage.",
          "URL valid, served over HTTPS, loading without error, and the live version of the page — with any redirect resolving to the intended destination rather than chaining or dropping parameters.",
          "UTM parameters present and correctly formed.",
          "Campaign, source and medium values follow the account's taxonomy rather than being improvised per campaign.",
          "Click trackers or redirect URLs applied and resolving — where applicable.",
          "Pixels or tags present and firing on the destination.",
          "Conversion events configured, and the event being optimised toward is the one the KPI depends on.",
          "Floodlight activities assigned — where applicable.",
          "Attribution settings match what reporting will assume.",
          "Conversion window set as agreed — where applicable.",
          "Analytics receipt confirmed where it can be tested before launch, and noted for post-launch checking where it cannot.",
          "Landing-page tracking present and not blocked by consent or tag-manager configuration, including third-party measurement or verification tags — where applicable.",
        ],
      },
      {
        type: "p",
        text: "Validation methods differ by platform and no single test covers all of them, so check tracking in the place it will actually be read. Where reporting is produced from this data, [reporting and insights](/services/reporting) covers how figures should be reconciled before they reach a client.",
      },

      { type: "h2", text: "08 — Final pre-launch review", id: "final-review" },
      {
        type: "p",
        text: "A last pass across everything already checked, performed against the live platform configuration rather than the trafficking sheet or setup document. The sheet records what was intended; only the platform shows what exists.",
      },
      {
        type: "ul",
        items: [
          "Media plan reconciled line by line against the platform setup.",
          "Campaign structure and naming correct at every level, and budget, dates and timezone correct.",
          "Targeting and geography correct.",
          "Placements and inventory settings correct.",
          "Creatives correct, approved and mapped to the right placements.",
          "Landing URLs resolving and carrying their tracking.",
          "Conversion event and attribution settings correct.",
          "All required approvals recorded.",
          "Campaign status ready for activation, with nothing left paused that should run and nothing live that should not.",
        ],
      },

      { type: "h2", text: "09 — Post-launch verification", id: "post-launch" },
      {
        type: "p",
        text: "QA does not end when the campaign is switched on. Some faults are only observable once the platform begins serving, and the window in which they are cheap to fix is short.",
      },
      {
        type: "ul",
        items: [
          "Campaign has entered delivery rather than sitting in review or pending status.",
          "Impressions registering, and clicks registering where the format produces them.",
          "Spend beginning, and at a rate consistent with the pacing setting.",
          "Creatives approved and serving, with no asset silently withheld.",
          "No rejected, disapproved or limited ads.",
          "Conversion tracking firing — where it can be tested.",
          "Data reaching analytics and the reporting pipeline.",
          "No unexpected delivery — geography, placement or audience behaving differently from the setup.",
          "Pacing on track against the plan and the remaining flight, with budget consuming neither stalled nor running ahead.",
          "No obvious delivery anomalies in the first reportable period.",
          "Reporting populated with the campaign and mapped to the right client and plan line.",
          "Anything materially different from expectation escalated rather than absorbed.",
        ],
      },

      {
        type: "p",
        text: "These are the disciplines Trafficomm applies to campaign execution work, where QA runs as a function separate from the build rather than as the builder's final pass. Operating since 2015, the same sequence is used across platforms and markets. For how that works as an engagement, see [ad operations outsourcing](/ad-operations-outsourcing).",
      },
    ],
    related: ["agency-guide-to-outsourcing-ad-operations", "building-vs-outsourcing-ad-operations-team"],
    links: [
      { href: "/services/ad-operations", label: "Ad Operations", meta: "Service" },
      { href: "/how-we-work", label: "How we work", meta: "Transition & QA" },
      { href: "/insights/agency-guide-to-outsourcing-ad-operations", label: "Ad operations outsourcing guide", meta: "Guide" },
      { href: "/ad-operations-outsourcing", label: "Ad operations outsourcing", meta: "Service" },
    ],
  },
  {
    slug: "agency-guide-to-outsourcing-ad-operations",
    title: "Ad Operations Outsourcing: The Complete Guide for Agencies",
    dek: "What agencies can outsource and what they should keep, when the model fits and when it does not, how campaign handoff and QA should work, and how to evaluate an ad operations partner.",
    category: "Guide",
    author: labAuthor,
    publishedAt: "2026-08-18",
    updatedAt: "2026-09-30",
    hero: { kicker: "Operator's Guide", motif: "flow" },
    tags: ["Ad Operations Outsourcing", "Media Agency Outsourcing", "Agency Operations", "Campaign Trafficking", "Campaign QA"],
    body: [
      {
        type: "p",
        text: "Campaign volume rarely grows in a neat line. A client win, a seasonal peak, a market launch or an unfamiliar platform can each add operational load faster than a permanent team absorbs it. None of the work is difficult in isolation — a campaign has to be built, checked, launched, monitored and reported — but it multiplies with every account, market and platform, and it arrives whether or not there is capacity for it.",
      },
      {
        type: "p",
        text: "Ad operations outsourcing is one way to add execution capacity without transferring strategy, commercial control or the client relationship. It is also routinely misread: as a cost exercise, as a loss of control, or as something only large networks do.",
      },
      {
        type: "p",
        text: "This guide covers what can be outsourced and what should not be, when the model fits, how the operating layer works day to day, what a complete handoff contains, how QA should be staged, and what to examine in a partner before committing.",
      },
      {
        type: "callout",
        title: "In brief",
        text: "Ad operations outsourcing is the delegation of campaign execution and operational advertising tasks to a specialist external team while the agency retains strategic, commercial and client ownership. Commonly outsourced work includes campaign setup, trafficking, creative and tracking QA, pacing monitoring, reporting and specialised platform operations. Engagements are typically structured as overflow support during peaks, dedicated external capacity, white-label execution under the agency's own brand, or a hybrid of these. The model that fits depends on campaign volume, the capability already inside the team, how many platforms are in play, and how much direct control the agency wants to keep over execution decisions.",
      },

      { type: "h2", text: "What is ad operations outsourcing?", id: "what-is" },
      {
        type: "p",
        text: "Ad operations outsourcing is the delegation of campaign execution — the building, checking, launching, monitoring and reporting of advertising campaigns — to a specialist team outside the agency, while the agency keeps strategy, commercial decisions and the client relationship.",
      },
      {
        type: "p",
        text: "The distinction that matters most is between execution and ownership. Execution is the work: implementing a plan, applying targeting, trafficking creative, validating tracking, watching delivery, producing reports. Ownership is the authority: what the plan should be, what the budget is spent on, what is said to the client, what is approved before launch. Outsourcing execution does not require transferring ownership, and an engagement that quietly transfers both is a different arrangement with different risks.",
      },
      {
        type: "p",
        text: "In practice the external team operates inside an operating model the agency defines: the agency sets the brief, naming conventions, QA standards, approval points and reporting formats, and the external team works to them. That is why the model succeeds where an agency already knows how it wants campaigns run, and struggles where it does not.",
      },

      { type: "h2", text: "What ad operations work can be outsourced?", id: "what-to-outsource" },
      {
        type: "p",
        text: "The work that transfers well is process-driven, specification-led and benefits from a separate pair of eyes. It falls into four groups.",
      },
      {
        type: "ul",
        items: [
          "Build and launch — campaign setup, trafficking, creative implementation, targeting and placement configuration, budget and flight-date validation.",
          "Verification — creative QA against specification, tracking validation, UTM implementation, conversion-event checks, naming enforcement, pre-launch review.",
          "In-flight operations — pacing and delivery monitoring, optimisation support within agreed scope, delegated budget reallocation, delivery and ad-server troubleshooting.",
          "Reporting and reconciliation — scheduled and end-of-campaign reporting, report QA, reconciliation against the plan, proof of delivery, measurement support.",
        ],
      },
      {
        type: "p",
        text: "Programmatic execution sits across several of these: trafficking in an ad server, line-item setup, inventory and deal configuration, and delivery troubleshooting are all specification-driven, while the strategy behind them is not.",
      },
      {
        type: "p",
        text: "Scope should be written down rather than assumed. Providers differ substantially — some handle build only, some include measurement work, some will not touch optimisation decisions. A useful test: for every task above, both sides should be able to say without hesitating whether it is in scope, and who approves it.",
      },

      { type: "h2", text: "What should stay with the agency?", id: "what-to-keep" },
      {
        type: "p",
        text: "Some responsibilities are difficult to delegate without changing what the agency is. These commonly stay internal:",
      },
      {
        type: "ul",
        items: [
          "The client relationship and all direct client communication.",
          "Strategy and media planning — what to run, where, and why.",
          "Commercial decisions, budget authority and negotiation.",
          "Final approval before a campaign goes live.",
          "Brand and client context — the standing constraints and sensitivities that never appear in a brief.",
          "Escalation ownership — what happens when something goes wrong in front of the client.",
        ],
      },
      {
        type: "p",
        text: "There is no single correct division, and the line moves with the engagement. Some agencies delegate optimisation within defined guardrails; others require every change to be approved. What matters is less where the line sits than that both sides describe it the same way.",
      },

      { type: "h2", text: "When outsourcing makes sense — and when it doesn't", id: "when" },
      { type: "h3", text: "When it can make sense" },
      {
        type: "p",
        text: "The model fits where the operational load is real and the process is describable:",
      },
      {
        type: "ul",
        items: [
          "Campaign volume peaks around seasons or launches, and permanent hiring would leave the team over-staffed the rest of the year.",
          "New client wins arrive faster than recruitment can support.",
          "The account mix has widened across platforms and no one internally covers all of them to the same depth.",
          "A specific capability is missing — ad-server trafficking, a programmatic stack, a measurement implementation — and hiring for it alone is hard to justify.",
          "Coverage is needed in a market or time zone the team does not operate in.",
          "Senior specialists spend a significant share of the week on builds and reporting rather than planning and client work.",
          "Reporting has grown to consume the days it is meant to inform.",
        ],
      },
      { type: "h3", text: "When it may not make sense" },
      {
        type: "p",
        text: "It is equally worth being clear about where outsourcing tends to disappoint:",
      },
      {
        type: "ul",
        items: [
          "Campaign volume is low enough that coordination overhead exceeds the execution saved.",
          "Internal workflows are undocumented — if the process lives in one operator's head, there is nothing to hand over.",
          "Responsibility is unclear internally — outsourcing adds a participant to an ownership problem rather than resolving it.",
          "There is no functioning approval process, so nothing can be checked before it goes live.",
          "Platform access cannot be granted appropriately, for client-policy or contractual reasons.",
          "The work depends on continuous client context — informal input, live calls, shifting verbal direction — that cannot be transferred in a brief.",
        ],
      },
      {
        type: "p",
        text: "Outsourcing is not a general improvement over doing the work internally. It performs well under some conditions and poorly under others, and the conditions are mostly about how well the agency has defined its own operating model.",
      },

      { type: "h2", text: "In-house, outsourced or hybrid", id: "models" },
      {
        type: "p",
        text: "Most agencies are choosing between three structures rather than two, and the trade-offs differ by dimension rather than one option dominating.",
      },
      {
        type: "table",
        caption: "Operating models compared",
        head: ["Dimension", "In-house", "Outsourced", "Hybrid"],
        rows: [
          ["Capacity", "Fixed to headcount; changes at hiring speed", "Adjusts with agreed volume", "Stable core with flexible overflow"],
          ["Platform breadth", "Limited to the skills on the team", "Pooled across a wider specialist group", "Internal depth plus external coverage"],
          ["Control", "Direct and immediate", "Exercised through brief, scope and approval", "Direct on decisions, delegated on execution"],
          ["Management overhead", "Recruitment, training, retention", "Governance, briefing and review", "Both, at smaller scale"],
          ["Knowledge retention", "Held internally; concentrated in individuals", "Held by the partner; depends on documentation", "Retained internally, documented externally"],
          ["Scaling", "Slow in both directions", "Faster, within contracted terms", "Core stays stable while volume moves"],
        ],
      },
      {
        type: "p",
        text: "Hybrids are common in practice: a small internal core owns strategy, client relationships and escalation, while an external team runs build, QA and reporting at volume. For a fuller treatment of the decision — including what building actually costs — see [building versus outsourcing an ad operations team](/insights/building-vs-outsourcing-ad-operations-team).",
      },

      { type: "h2", text: "How the outsourcing operating model works", id: "operating-model" },
      {
        type: "p",
        text: "A working engagement is a repeatable loop rather than an ad-hoc request queue. The typical sequence:",
      },
      {
        type: "ul",
        items: [
          "The agency defines strategy and the media plan.",
          "A structured brief is handed over, complete enough to build from without follow-up.",
          "The execution team builds the campaign to the agency's conventions.",
          "QA is completed as a separate step, by someone other than the builder.",
          "The agency approves, where the engagement requires it.",
          "The campaign goes live.",
          "Delivery and pacing are monitored against the plan.",
          "Optimisation is implemented within agreed scope; anything outside it is raised rather than actioned.",
          "Reporting is produced, checked against the platforms, and delivered in the agency's format.",
          "Exceptions and escalations route back through a named path.",
        ],
      },
      {
        type: "p",
        text: "Four things make that loop hold: ownership is explicit at every step, handoffs are documented rather than verbal, approval boundaries are agreed before the first campaign rather than after the first mistake, and escalation follows a defined path. None of this removes management — it replaces reactive coordination with a smaller amount of structured governance.",
      },

      { type: "h2", text: "How campaign handoff should work", id: "handoff" },
      {
        type: "p",
        text: "Most execution problems are brief problems. A campaign built from an incomplete handoff either waits on clarification or proceeds on an assumption — and an assumption that survives to launch becomes a delivery or tracking issue found later, usually by the client.",
      },
      {
        type: "p",
        text: "An execution team needs the same categories of information every time: which account the campaign is built under, what it is meant to achieve and how it is measured, the budget and flight it runs to, who it targets and where, the creative and where it points, how it is tracked, how it is named, how it is reported, and who approves it before launch.",
      },
      {
        type: "p",
        text: "A brief template that enforces those fields is a more reliable investment than any amount of post-launch checking. A missing field at brief stage costs a question; the same field missing after launch costs a rebuild. The field-by-field version is set out in [the campaign launch QA checklist](/insights/campaign-launch-qa-checklist).",
      },
      { type: "h2", text: "How QA should work", id: "qa" },
      {
        type: "p",
        text: "QA is most useful as a distinct function rather than a final habit of the person who did the build — someone checking their own work checks it against the assumptions they built it on. Staging it across the campaign lifecycle catches different classes of error at the point they are cheapest to fix.",
      },
      { type: "h3", text: "Pre-launch QA" },
      {
        type: "p",
        text: "Everything checked while it is still free to correct: the campaign as configured against the campaign as briefed. This is the largest of the stages and the one that determines how much of the rest is needed.",
      },
      { type: "h3", text: "Launch verification" },
      {
        type: "p",
        text: "Confirmation that activation actually produced delivery. A campaign that is live is not necessarily a campaign that is working, and some faults are only observable once a platform begins serving.",
      },
      { type: "h3", text: "Delivery and pacing checks" },
      {
        type: "p",
        text: "Delivery and spend measured against the plan through the flight. Pacing problems compound quietly — the earlier they surface, the more of the flight remains to correct them in.",
      },
      { type: "h3", text: "Optimisation controls" },
      {
        type: "p",
        text: "Discipline around changes to a live campaign: what may be changed without approval, what must be raised first, and a record of what changed and when. Without that record, end-of-flight analysis cannot separate the effect of the market from the effect of the changes.",
      },
      { type: "h3", text: "Reporting QA" },
      {
        type: "p",
        text: "Figures reconciled against the platforms before a report reaches a client. A wrong report costs more trust than an underdelivering campaign, because it calls everything else into question.",
      },
      {
        type: "p",
        text: "Those are the stages and what each is for. The checks that belong inside them — stage by stage, from brief through to post-launch verification — are set out in [the campaign launch QA checklist](/insights/campaign-launch-qa-checklist). How a partner structures and staffs these stages is worth asking about in detail; [how we work](/how-we-work) sets out one way of sequencing transition, ownership and QA.",
      },
      { type: "h2", text: "How to evaluate an ad operations outsourcing partner", id: "evaluate" },
      {
        type: "p",
        text: "The most common evaluation error is comparing price per hour or per campaign across providers whose scope is not equivalent. Cheap capacity and reliable operations are different products, and the difference shows up in QA, documentation and escalation rather than in the build.",
      },
      {
        type: "p",
        text: "Worth examining directly:",
      },
      {
        type: "ul",
        items: [
          "Platform experience — which platforms the team runs regularly, and to what depth.",
          "Complexity handled — the hardest campaign type they run routinely, not the most common.",
          "QA process — whether it is a separate function, who performs it, and at which stages.",
          "Documentation — whether process and account knowledge are written down or held by individuals.",
          "Handoff process — the brief format they work from, and what happens to an incomplete brief.",
          "Escalation model — who is contacted, and who has authority to resolve.",
          "Reporting capability — working in the agency's templates, and validating figures before sending.",
          "Measurement knowledge — tracking validation and conversion-event configuration.",
          "Communication — named accountability rather than a shared inbox.",
          "Ability to work inside the agency's own platforms, naming, tooling and workflows rather than their own.",
          "White-label capability, where execution must sit invisibly behind the agency's brand.",
          "Evidence of operating scale — volume actually handled, and continuity of the assigned team.",
        ],
      },
      {
        type: "p",
        text: "References are more informative than capability decks, and the most useful question is not whether they are satisfied but what went wrong at some point and how it was handled.",
      },

      { type: "h2", text: "Questions to ask before outsourcing", id: "questions" },
      {
        type: "p",
        text: "A practical checklist for a first conversation, and for the contract that follows:",
      },
      {
        type: "ul",
        items: [
          "Which tasks are actually in scope, task by task?",
          "Who retains final approval before launch?",
          "Who owns client communication, and under whose name?",
          "What platform access is required, at what permission level?",
          "How are campaign briefs submitted, and in what format?",
          "What happens when a brief is incomplete — build on assumption, or stop and ask?",
          "What is the QA process, and who performs it?",
          "How are errors identified, reported and escalated?",
          "How are urgent changes handled outside normal hours?",
          "Who approves optimisation changes, and which changes need no approval?",
          "How is reporting validated before it is sent?",
          "How is account knowledge documented, and what happens when a team member changes?",
          "How are access permissions removed when an engagement or a person ends?",
          "Can the model scale down as well as up, and on what notice?",
        ],
      },

      { type: "h2", text: "Access, security and confidentiality", id: "access" },
      {
        type: "p",
        text: "Outsourcing execution means granting access to accounts holding client budget, audience data and performance information — a manageable risk handled deliberately, and a significant one arranged informally.",
      },
      {
        type: "p",
        text: "Principles worth applying regardless of partner:",
      },
      {
        type: "ul",
        items: [
          "Accounts stay owned by the agency or client, with the partner granted access rather than possession.",
          "Access is role-based and set to the least permission the work requires.",
          "Individual named accounts rather than shared logins, so activity is attributable.",
          "Onboarding and offboarding are documented, with access removal a defined step rather than an afterthought.",
          "Campaign information, performance data and client identity are confidential by default.",
          "Where the engagement is white-label, boundaries are explicit: what carries the agency's name, and what the partner may reference.",
          "Responsibility for approvals is written down, so nobody can authorise a change no one agreed to.",
        ],
      },
      {
        type: "p",
        text: "These are operating practices, not compliance guarantees. Where clients impose specific security or data-handling requirements, raise them during evaluation and confirm them in the contract rather than assuming them from a general assurance.",
      },

      { type: "h2", text: "How Trafficomm's operating model works", id: "trafficomm" },
      {
        type: "p",
        text: "Trafficomm has operated as an execution layer behind agencies, ad-tech companies, publishers and brands since 2015. The model is the one described throughout this guide: the agency keeps strategy, commercial decisions, client ownership and final approval, while Trafficomm's team works inside the agency's tools, naming conventions and reporting formats rather than imposing its own.",
      },
      {
        type: "p",
        text: "The operating scale behind that is documented rather than estimated: 10K+ campaigns handled, 1M+ creatives and placements, a largest single campaign value of approximately $10M, 250+ campaigns in the largest month, and 70+ team members. QA runs as a function separate from the build, and each engagement has named account management rather than a shared queue.",
      },
      {
        type: "p",
        text: "For scope, platform coverage, the campaign lifecycle and how an engagement starts, see [ad operations outsourcing](/ad-operations-outsourcing).",
      },

      { type: "h2", text: "Common questions", id: "faq" },
      { type: "h3", text: "How is outsourced ad operations different from managed media?" },
      {
        type: "p",
        text: "Managed media means an external party takes responsibility for strategy, budget allocation and performance outcomes. Outsourced ad operations is narrower: the external team executes against a plan the agency owns, and the agency remains accountable for the media decisions and the client relationship.",
      },
      { type: "h3", text: "Can execution be outsourced while strategy stays internal?" },
      {
        type: "p",
        text: "Yes, and it is the most common arrangement. The separation works when the agency can express its strategy as a brief specific enough to build from. Where strategy is communicated informally and adjusted verbally, the split needs process work first.",
      },
      { type: "h3", text: "Can outsourcing be used only during peak campaign periods?" },
      {
        type: "p",
        text: "Overflow arrangements exist for exactly this. The constraint is ramp-up: a team working an account occasionally needs its conventions documented well enough to rejoin quickly. Agencies that use overflow well keep the partner lightly engaged between peaks rather than fully disengaged.",
      },
      { type: "h3", text: "What does white-label ad operations mean for an agency?" },
      {
        type: "p",
        text: "Execution sits behind the agency's brand: work is delivered in the agency's templates and under its name, and the partner is not visible to the client. It changes presentation and confidentiality boundaries rather than the operating model, and those boundaries belong in the engagement rather than in convention.",
      },
      { type: "h3", text: "How should account access be structured?" },
      {
        type: "p",
        text: "Accounts remain owned by the agency or client, with named individual access at the least permission the work requires, and removal treated as a documented step when someone leaves. Shared logins make activity unattributable and are worth avoiding even when more convenient.",
      },
      { type: "h3", text: "Can one external operations team support multiple advertising platforms?" },
      {
        type: "p",
        text: "A pooled team can cover a wider platform range than most individual operators, which is much of the appeal. Confirm depth platform by platform rather than accepting a coverage list — breadth across a team does not guarantee depth on the platforms an account actually depends on.",
      },
      { type: "h3", text: "What should an agency document before outsourcing?" },
      {
        type: "p",
        text: "At minimum: brief format, naming conventions, QA expectations, approval points, reporting templates and cadence, and the escalation path. If these exist as practice rather than documentation, writing them down before selecting a partner improves internal operations regardless of the outcome.",
      },
      { type: "h3", text: "How does a hybrid ad operations model work?" },
      {
        type: "p",
        text: "A small internal core keeps strategy, client relationships and escalation ownership, while an external team handles build, QA, monitoring and reporting at volume. Optimisation is usually shared: the partner surfaces what the data shows, the agency decides what to act on.",
      },
    ],
    related: ["campaign-launch-qa-checklist", "building-vs-outsourcing-ad-operations-team"],
    links: [
      { href: "/ad-operations-outsourcing", label: "Ad operations outsourcing", meta: "Service" },
      { href: "/services/ad-operations", label: "Ad Operations", meta: "Service" },
      { href: "/solutions/white-label-ad-operations", label: "White-label ad operations", meta: "Solution" },
      { href: "/how-we-work", label: "How we work", meta: "Transition & QA" },
      { href: "/case-studies/mena-agency-ad-operations", label: "Case study: from 4 specialists to ~30", meta: "Evidence" },
    ],
  },
  {
    slug: "building-vs-outsourcing-ad-operations-team",
    title: "Building vs Outsourcing an Ad Operations Team",
    dek: "A practical framework for deciding when to hire, when to partner and when a hybrid model gives an agency the best of both.",
    category: "Guide",
    author: labAuthor,
    publishedAt: "2026-07-21",
    hero: { kicker: "Decision Framework", motif: "grid" },
    tags: ["Ad Operations Outsourcing", "Agency Operations", "Digital Advertising Operations"],
    body: [
      {
        type: "p",
        text: "Every growing agency reaches the same decision point: campaign volume is rising, operators are stretched, and the choice is to hire more ad operations staff or bring in a partner. Neither answer is always right. The right answer depends on volume, volatility, specialization and how much management attention the agency can spare.",
      },
      { type: "h2", text: "The real cost of building", id: "build" },
      {
        type: "p",
        text: "Salary is the visible cost. The less visible costs are recruitment time, onboarding, training across every platform, management overhead, cover for leave and attrition, and the key-person risk that comes from relying on one or two experienced traffickers.",
      },
      { type: "h2", text: "The real cost of outsourcing", id: "outsource" },
      {
        type: "p",
        text: "Outsourcing carries its own costs: transition effort, the need for clear process documentation, and governance to keep quality high. A partner without structured account management and dedicated QA will simply relocate your problems.",
      },
      {
        type: "table",
        caption: "Build vs outsource at a glance",
        head: ["Factor", "Build in-house", "Outsource to a specialist"],
        rows: [
          ["Time to capacity", "Recruitment and onboarding cycles", "Phased transition into a trained team"],
          ["Scaling up or down", "Slow; fixed headcount", "Flexible with volume"],
          ["Platform coverage", "Limited by individual skills", "Pooled multi-platform expertise"],
          ["Quality assurance", "Often the builder checks their own work", "Dedicated QA as a separate step"],
          ["Key-person risk", "High in small teams", "Distributed across a structured team"],
          ["Management overhead", "Hiring, training, retention", "Governance and SLA management"],
        ],
      },
      { type: "h2", text: "What one engagement documented", id: "evidence" },
      {
        type: "chart",
        kind: "compare",
        title: "Resource cost index — before and after centralized operations",
        caption: "Indexed to the pre-engagement cost (100). Documented in one Trafficomm engagement with a leading MENA agency; outcomes vary by scope.",
        series: [
          { label: "Before", value: 100 },
          { label: "After", value: 50, display: "50", highlight: true },
        ],
      },
      { type: "h2", text: "When a hybrid model wins", id: "hybrid" },
      {
        type: "p",
        text: "Most agencies land on a hybrid: a small in-house core owns strategy, client relationships and escalations, while a partner runs execution, QA and reporting at scale. The in-house team gets leverage; the partner gets clear direction.",
      },
      {
        type: "ul",
        items: [
          "Keep in-house: strategy, planning, buying decisions, client relationships.",
          "Outsource: setup, trafficking, creative audit, QA, monitoring and reporting.",
          "Share: optimization decisions, with the partner surfacing insight and the agency deciding.",
        ],
      },
    ],
    related: ["agency-guide-to-outsourcing-ad-operations", "campaign-launch-qa-checklist"],
    links: [
      { href: "/solutions/media-agencies", label: "For media agencies", meta: "Solution" },
      { href: "/solutions/white-label-ad-operations", label: "White-label ad operations", meta: "Solution" },
      { href: "/services/ad-operations", label: "Ad Operations", meta: "Service" },
    ],
  },
];

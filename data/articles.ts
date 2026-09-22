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
        text: "Saudi Arabia has become one of the most operationally demanding advertising markets in the region. Campaign calendars are dense, platform mixes are broad and audiences move quickly between formats. For media teams, the question for 2027 is less about whether to invest and more about whether the operation behind the plan can keep up.",
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
  },
  {
    slug: "agency-guide-to-outsourcing-ad-operations",
    title: "The Agency Guide to Outsourcing Ad Operations",
    dek: "What to outsource, what to keep, how transition should work and how to measure whether an ad operations partner is actually delivering.",
    category: "Guide",
    author: labAuthor,
    publishedAt: "2026-08-18",
    hero: { kicker: "Operator's Guide", motif: "flow" },
    tags: ["Ad Operations Outsourcing", "Media Agency Outsourcing", "Agency Operations"],
    body: [
      {
        type: "p",
        text: "Outsourcing ad operations is no longer a cost-cutting experiment. For many agencies it is how they scale delivery across clients, markets and platforms without adding the same proportion of headcount. Done well, it improves quality. Done badly, it moves problems offshore. This guide covers how to do it well.",
      },
      { type: "h2", text: "What to outsource", id: "what" },
      {
        type: "p",
        text: "The best candidates are high-volume, process-driven tasks that follow clear specifications and benefit from a dedicated QA step:",
      },
      {
        type: "ul",
        items: [
          "Creative spec sheets and creative auditing — standard, rich media, video, third-party tags and custom executions",
          "Campaign setup, trafficking and ad-server troubleshooting",
          "Screenshots and proof of delivery",
          "Weekly, monthly and end-of-campaign reporting",
          "Campaign monitoring and optimization against agreed KPIs",
          "Social campaign setup across Meta, X, Snapchat, LinkedIn, TikTok and YouTube",
        ],
      },
      { type: "h2", text: "What to keep", id: "keep" },
      {
        type: "p",
        text: "Keep strategy, planning and buying decisions, client relationships and commercial negotiations in-house. An operations partner should strengthen these functions by giving them time back — not replace them.",
      },
      { type: "h2", text: "How transition should work", id: "transition" },
      {
        type: "p",
        text: "Transition is where outsourcing succeeds or fails. A structured approach sequences business areas by complexity, criticality and ease of transition, then moves each through four stages:",
      },
      {
        type: "ul",
        items: [
          "Knowledge acquisition — the partner's team learns every business area of the account.",
          "Secondary shadow — the team monitors and learns the process from your in-house operator.",
          "Primary shadow — the team works on live campaigns while your operator oversees.",
          "Steady state — the partner's team takes over the process completely.",
        ],
      },
      {
        type: "callout",
        title: "Tip",
        text: "Transition in waves. Move account structure and ad operations guidelines first; move reporting templates and support management second.",
      },
      { type: "h2", text: "What good looks like", id: "results" },
      {
        type: "p",
        text: "On Trafficomm's longest-running agency engagement — a leading MENA advertising agency operating from approximately 12 offices — the team began with four specialists and now numbers around thirty, over a partnership of more than seven years.",
      },
      {
        type: "chart",
        kind: "bar",
        title: "Dedicated team size — leading MENA agency engagement",
        caption: "Source: Trafficomm case study. Client identity withheld in accordance with confidentiality obligations.",
        unit: "specialists",
        series: [
          { label: "Engagement start", value: 4 },
          { label: "Today", value: 30, display: "~30", highlight: true },
        ],
      },
      {
        type: "p",
        text: "The same engagement documented a 50% reduction in resource costs and 99.34% work quality. The lesson is not the specific numbers — every agency is different — but that quality and cost can improve together when QA is a dedicated function and work is structured under accountable account management.",
      },
      { type: "h2", text: "How to measure your partner", id: "measure" },
      {
        type: "ul",
        items: [
          "SLA adherence by task type",
          "Work quality measured by a dedicated QA step",
          "Turnaround time from brief to live",
          "Transparency of productivity reporting",
          "Retention and continuity of the assigned team",
        ],
      },
    ],
    related: ["building-vs-outsourcing-ad-operations-team", "saudi-digital-advertising-outlook-2027"],
  },
  {
    slug: "building-vs-outsourcing-ad-operations-team",
    title: "Building vs Outsourcing an Ad Operations Team",
    dek: "A practical framework for deciding when to hire, when to partner and when a hybrid model gives an agency the best of both.",
    category: "Research",
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
    related: ["agency-guide-to-outsourcing-ad-operations", "saudi-digital-advertising-outlook-2027"],
  },
];

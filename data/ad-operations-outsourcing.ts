import type { FAQ } from "./types";
import type { PressureTier } from "@/components/sections/shared/PressureCascade";
import type { ChainStage } from "./service-depth";

/**
 * Content for the /ad-operations-outsourcing cornerstone page.
 *
 * Every capability named here is documented on an existing service page, and every
 * figure comes from data/metrics.ts. Nothing about clients, certifications,
 * partnerships, turnaround times, SLAs, error rates or savings appears, because
 * none of it is documented. Historical figures are phrased as history throughout —
 * "has handled", "peak", "largest" — never as a current run rate.
 */

/**
 * The one-sentence answer, placed early and written to stand on its own when a
 * search engine or assistant lifts it out of the page.
 */
export const definition =
  "Trafficomm is a performance operations partner that provides outsourced ad operations, performance marketing execution, programmatic operations, measurement and reporting support for agencies and advertising teams.";

export const intro = [
  "Ad operations outsourcing means moving the execution layer of digital advertising — campaign setup, trafficking, QA, pacing, optimization support and reporting — to a specialist team that works alongside your own. Strategy, client relationships and commercial decisions stay in-house. The operational hours move.",
  "Agencies reach for it for a structural reason: campaign volume is uneven, but headcount is fixed. A pitch win, a seasonal peak or a client's multi-market launch can double the build-and-QA workload in a fortnight. Hiring cannot move that quickly, and hiring for the peak leaves the same team under-occupied in the trough.",
  "Trafficomm operates as that execution layer. We work inside your platforms, your naming conventions and your reporting cadence — and, where an agency needs it, entirely behind your brand.",
];

/** Growth creates volume, volume creates pressure, pressure creates risk. */
export const pressureTiers: readonly PressureTier[] = [
  {
    title: "What growth actually adds",
    tone: "base",
    items: ["More campaigns", "More platforms", "More markets", "More creative variants", "More reporting lines"],
  },
  {
    title: "Where it lands operationally",
    tone: "mid",
    items: [
      "Senior strategists building campaigns",
      "QA compressed to hit launch dates",
      "Pacing checked less often",
      "Reporting assembled by hand",
      "Platform depth spread thin",
    ],
  },
  {
    title: "What it costs",
    tone: "risk",
    items: ["Launch errors found late", "Budget under- or over-delivery", "Strategy time lost to execution", "Capacity capped by hiring speed"],
  },
];

export const pressureResolution = {
  label: "The operations layer",
  statement: "Execution capacity that moves with campaign volume, without moving headcount.",
};

/**
 * The operational lifecycle. Owners follow the ChainStage convention: "client"
 * where the agency decides, "trafficomm" where we execute, "output" for what
 * returns to the team.
 */
export const lifecycle: readonly ChainStage[] = [
  { label: "Brief intake", owner: "client", items: ["Objectives", "Budgets", "Flight dates", "Naming conventions"] },
  { label: "Campaign build", items: ["Structure", "Targeting setup", "Budget splits", "Tracking parameters"] },
  { label: "QA", items: ["Naming", "Budget", "Audience", "Creative", "URL", "Tracking", "Placement", "Dates"] },
  { label: "Launch", owner: "client", items: ["Client approval", "Scheduled activation", "Live checks"] },
  { label: "Pacing", items: ["Delivery vs target", "Budget burn", "Flight-end projection"] },
  { label: "Optimization support", items: ["Bid and budget shifts", "Creative rotation", "Audience adjustments"] },
  { label: "Reporting", items: ["Daily", "Weekly", "Monthly", "Campaign wrap"] },
  { label: "Insights", owner: "output", items: ["What changed", "Why it changed", "What to do next"] },
];

/** Grouped by the service pages the work is documented on. */
export const scopeGroups = [
  { title: "Ad operations", items: ["Campaign setup", "Trafficking", "Creative QA", "Pacing", "Reporting"] },
  { title: "Performance", items: ["Account architecture", "Audiences", "A/B testing", "Optimization support"] },
  { title: "Programmatic", items: ["DV360", "CM360", "Line items", "PMP deals"] },
  { title: "Measurement", items: ["GA4", "GTM", "Conversion tracking", "CAPI", "Validation"] },
  { title: "Reporting", items: ["Daily", "Weekly", "Monthly", "Dashboards", "Campaign analysis"] },
  { title: "Creative & AdTech", items: ["Rich media", "Creative QA", "Ad serving", "Trafficking support"] },
] as const;

/**
 * An honest comparison. No cost percentages, no time savings, no error rates —
 * none of that is documented, and inventing it is what makes pages like this
 * untrustworthy. Every row is a structural difference, not a claimed outcome.
 */
export const comparison = [
  { dimension: "Capacity", inHouse: "Fixed. Sized to a forecast, not to this month's volume.", outsourced: "Variable. Scales with campaign volume rather than with headcount." },
  { dimension: "Recruitment", inHouse: "Each role is a search, an offer and a notice period.", outsourced: "No recruitment cycle for additional execution capacity." },
  { dimension: "Training", inHouse: "Platform depth is built person by person, and leaves when they do.", outsourced: "Platform depth sits in the partner team and persists through staff changes." },
  { dimension: "Platform coverage", inHouse: "Usually deep on two or three platforms, thinner on the rest.", outsourced: "Coverage across the platforms already in your media plans." },
  { dimension: "Volume spikes", inHouse: "Absorbed by overtime, deprioritised QA, or a slower launch.", outsourced: "Absorbed as additional execution hours." },
  { dimension: "Process consistency", inHouse: "Depends on who builds the campaign that week.", outsourced: "One documented set of naming, QA and reporting standards." },
  { dimension: "Management overhead", inHouse: "Line management, utilisation, cover for leave and attrition.", outsourced: "One operational relationship instead of several direct reports." },
] as const;

export const agencyOwns = ["Strategy and planning", "Client relationships", "Commercial decisions", "Final launch approval"] as const;
export const trafficommSupports = [
  "Campaign build",
  "Trafficking",
  "QA",
  "Pacing checks",
  "Optimization support",
  "Reporting",
  "Measurement setup",
  "Documentation",
] as const;

export const engagementSteps = [
  { step: "Assess", body: "We map where setup, QA, optimization and reporting hours currently go, and which of them are worth moving." },
  { step: "Define workflow", body: "Ownership is agreed stage by stage: what your team decides, what we execute, and where approval sits." },
  { step: "Integrate", body: "We work inside your platforms, access model, naming conventions and communication channels — not a parallel system." },
  { step: "Execute", body: "Campaigns are built, QA'd and trafficked to your standards, with launch on your approval rather than automatically." },
  { step: "Measure", body: "Pacing and delivery are checked against target, and reporting arrives on the cadence your clients already expect." },
  { step: "Scale", body: "Capacity moves with volume — up for a peak, back down afterwards — without changing your permanent headcount." },
] as const;

export const faqs: FAQ[] = [
  {
    q: "What is ad operations outsourcing?",
    a: "Ad operations outsourcing is the practice of moving the execution layer of digital advertising — campaign setup, trafficking, QA, pacing, optimization support and reporting — to a specialist external team, while strategy, client relationships and commercial decisions stay with the internal team.",
  },
  {
    q: "What ad operations tasks can be outsourced?",
    a: "Commonly: campaign setup and structure, trafficking, creative QA, pre-launch checks across naming, budget, audience, creative, URL, tracking, placement and dates, pacing and delivery checks, optimization support, measurement setup such as GA4 and Google Tag Manager, and daily, weekly and monthly reporting.",
  },
  {
    q: "Can Trafficomm work as a white-label AdOps partner?",
    a: "Yes. Trafficomm can operate behind an agency's brand, working inside the agency's platforms, naming conventions and reporting templates so that output reaches the end client as the agency's own.",
  },
  {
    q: "Which advertising platforms does Trafficomm support?",
    a: "Trafficomm has campaign experience across Meta, Google Ads, TikTok, Snapchat, X, LinkedIn, Display & Video 360, Campaign Manager 360, Search Ads 360 and Amazon Ads, among others. Platform experience indicates operational familiarity and does not imply partnership, certification or endorsement by those platforms.",
  },
  {
    q: "Can an agency outsource only part of its ad operations?",
    a: "Yes. Scope is set stage by stage. Some teams move only campaign build and QA; others move reporting because it consumes the most account-team hours; others move a single platform where internal depth is thinnest.",
  },
  {
    q: "How does outsourced AdOps integrate with an internal media team?",
    a: "Trafficomm works inside the agency's existing platform access, naming conventions, approval steps and communication channels rather than introducing a parallel process. Ownership is agreed per stage, and campaigns go live on the agency's approval rather than automatically.",
  },
  {
    q: "Can Trafficomm support campaign volume spikes?",
    a: "Handling uneven volume is the main reason agencies use an operations partner. Trafficomm has handled 10,000+ campaigns since 2015, with a peak of 250+ campaigns in a single month. That figure is the largest month on record, not a current monthly run rate.",
  },
  {
    q: "Does Trafficomm support agencies operating in Saudi Arabia and UAE?",
    a: "Yes. Trafficomm has campaign experience in Saudi Arabia, the UAE, Qatar, Kuwait, Lebanon and Australia. Delivery is centralized rather than run from offices in each market, and one of the largest campaigns handled was a UAE tourism campaign with an approximate campaign value of $10M.",
  },
  {
    q: "What should an agency look for when choosing an AdOps outsourcing partner?",
    a: "Documented QA steps rather than a general promise of quality; clear stage-by-stage ownership; platform coverage that matches your actual media plans; a reporting cadence that fits what clients already receive; and a working model that fits inside your tools instead of requiring new ones.",
  },
  {
    q: "When should an agency outsource AdOps instead of hiring?",
    a: "Outsourcing tends to fit when volume is uneven, when senior strategists are spending significant time on execution, when a platform is needed occasionally but not enough to justify a permanent specialist, or when capacity is required faster than a recruitment cycle allows. A steady, predictable workload on one or two platforms is usually better served by hiring.",
  },
];

/** Contextual links out. Deliberately short: the pages a reader actually needs next. */
export const relatedLinks = [
  { href: "/services/ad-operations", label: "Ad Operations", meta: "Setup · Trafficking · QA · Reporting" },
  { href: "/services/performance-marketing", label: "Performance Marketing", meta: "Paid social · Paid search" },
  { href: "/services/programmatic", label: "Programmatic Operations", meta: "DV360 · CM360" },
  { href: "/services/reporting", label: "Reporting & Insights", meta: "Daily · Weekly · Monthly" },
  { href: "/solutions/media-agencies", label: "For Media Agencies", meta: "Operating model" },
  { href: "/how-we-work", label: "How We Work", meta: "Process" },
  { href: "/case-studies", label: "Case Studies", meta: "Documented engagements" },
  { href: "/insights", label: "Performance Lab", meta: "Analysis" },
] as const;

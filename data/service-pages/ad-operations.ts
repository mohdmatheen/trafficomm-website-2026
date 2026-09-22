import { companyScaleSentence } from "../metrics";
import type { ServicePageContent } from "./types";

/**
 * Ad Operations service page.
 * Process content follows the Trafficomm services deck (offshore ad ops
 * process, services that can be outsourced, transition model) and the MENA
 * agency case study. No figures beyond approved proof points.
 */
export const adOperationsPage: ServicePageContent = {
  slug: "ad-operations",
  seo: {
    title: "Ad Operations Outsourcing for Agencies",
    description:
      "Outsourced ad operations for agencies and media teams: campaign intake, trafficking, creative and campaign QA, monitoring, optimization support and reporting — delivered as an extension of your team.",
  },
  hero: {
    eyebrow: "Ad Operations",
    title: ["The Operational Layer", "Behind Your Campaigns."],
    lead: "Trafficomm provides scalable Ad Operations support across campaign setup, trafficking, QA, monitoring, optimization and reporting — operating as an extension of agency and media teams.",
    capabilityLine: ["Campaign Setup", "Trafficking", "QA", "Monitoring", "Optimization", "Reporting"],
    lifecycle: ["Media plan", "Build", "QA", "Launch", "Monitor", "Optimize", "Report"],
  },
  proof: {
    note: "Company-wide figures across Trafficomm's operations since 2015 — ad operations, performance, programmatic and creative work combined.",
  },
  pressure: {
    title: ["Campaign Complexity", "Grows Faster Than Headcount."],
    lead: "Each new client, platform and market adds setup, QA and reporting work. Teams sized for last year's volume absorb it until something gives.",
    tiers: [
      { title: "Campaign growth", tone: "base", items: ["More clients", "More platforms", "More markets", "More creatives", "More reporting"] },
      { title: "Operational pressure", tone: "mid", items: ["Campaign setup", "Trafficking", "QA", "Monitoring", "Troubleshooting", "Pacing", "Reporting"] },
      { title: "Business risk", tone: "risk", items: ["Bottlenecks", "Quality errors", "Slow turnaround", "Resource dependency", "Inconsistent processes"] },
    ],
    resolution: { label: "Trafficomm", statement: "A specialized operational layer designed to absorb campaign complexity." },
  },
  lifecycle: {
    title: ["From Media Plan", "to Final Report."],
    lead: "Every campaign moves through the same eight stages. Trafficomm can run all of them, or the ones where your team needs capacity.",
    stages: [
      { code: "01", title: "Campaign intake", summary: "The approved plan becomes an executable brief, received through your existing channel or ticketing tool.", items: ["Media plan review", "Campaign requirements", "Specs", "Assets", "Timelines"] },
      { code: "02", title: "Campaign build", summary: "Campaigns are set up and trafficked in the ad server and platforms, to your conventions.", items: ["Campaign setup", "Trafficking", "Ad-server setup", "Platform setup", "Tags", "Naming conventions"] },
      { code: "03", title: "Creative & technical QA", summary: "Creatives and tags are audited against publisher and platform specs before anything goes live.", items: ["Creative audit", "Specs", "Landing URLs", "Third-party tags", "Tracking", "Ad-server validation"] },
      { code: "04", title: "Campaign QA", summary: "The build is checked independently of the person who built it.", items: ["Budget", "Dates", "Targeting", "Frequency", "Creative mapping", "Tracking", "Booking / order validation"] },
      { code: "05", title: "Launch", summary: "Go-live is executed and verified, with booking orders and tags sent to publishers where required.", items: ["Activation", "Publisher coordination", "Screenshots", "Initial delivery validation"] },
      { code: "06", title: "Monitoring", summary: "Delivery is watched in flight so issues are caught before they cost the campaign.", items: ["Delivery", "Pacing", "Spend", "Impressions", "Clicks", "Issues", "Discrepancies"] },
      { code: "07", title: "Optimization support", summary: "In-flight adjustments against the plan and the KPIs your client is measured on.", items: ["Budget", "Pacing", "Delivery", "KPI signals", "Creative performance", "Audience performance"] },
      { code: "08", title: "Reporting", summary: "Reporting in your templates, from daily pacing to end-of-campaign summaries.", items: ["Daily", "Weekly", "Monthly", "End-of-campaign", "Performance summaries", "Insights"] },
    ],
  },
  operatingChain: {
    title: ["Built to Work", "Behind Your Team."],
    lead: "A defined chain of responsibility — the structure behind our longest-running agency engagement.",
    nodes: [
      { label: "Client / agency", owner: "client", items: ["Strategy", "Media planning", "Client management"] },
      { label: "Trafficomm account management", owner: "trafficomm", items: ["Requirements", "Task allocation", "SLA management", "Communication"] },
      { label: "Trafficomm ad operations", owner: "trafficomm", items: ["Build", "Trafficking", "Monitoring", "Reporting"] },
      { label: "Dedicated QA", owner: "qa", items: ["Validation", "Accuracy", "Compliance"] },
      { label: "Client / agency", owner: "client", items: ["Performance", "Scale", "Client delivery"] },
    ],
  },
  qaGates: {
    title: ["Quality Is a Process.", "Not a Final Check."],
    lead: "Work passes five gates between intake and reporting. Each gate has its own checks, and QA is performed separately from the build.",
    gates: [
      { code: "Gate 01", title: "Input QA", checks: ["Media plan", "Assets", "Specs"] },
      { code: "Gate 02", title: "Build QA", checks: ["Campaign settings", "Budget", "Dates", "Targeting"] },
      { code: "Gate 03", title: "Creative QA", checks: ["Creative", "URLs", "Tags", "Tracking"] },
      { code: "Gate 04", title: "Launch QA", checks: ["Delivery", "Screenshots", "Tracking validation"] },
      { code: "Gate 05", title: "Ongoing QA", checks: ["Pacing", "Discrepancies", "Performance signals"] },
    ],
  },
  platforms: {
    title: ["Built Across the Platforms", "Your Teams Already Use."],
    lead: "Select a platform to see the ad operations work we run on it.",
    functions: {
      meta: ["Campaign setup", "Creative", "Tracking", "QA", "Monitoring", "Reporting"],
      "google-ads": ["Campaign setup", "Conversion tracking", "QA", "Monitoring", "Reporting"],
      tiktok: ["Campaign setup", "Creative audit", "QA", "Monitoring", "Reporting"],
      snapchat: ["Campaign setup", "Creative audit", "QA", "Monitoring", "Reporting"],
      x: ["Campaign setup", "Creative audit", "Screenshots", "Monitoring", "Reporting"],
      linkedin: ["Campaign setup", "Creative audit", "Tracking", "Monitoring", "Reporting"],
      dv360: ["Campaign build", "IO / line items", "Creative QA", "PMP", "Troubleshooting", "Monitoring", "Reporting"],
      cm360: ["Campaign setup", "Placements", "Creative assignment", "Tags", "Tracking", "QA", "Reporting"],
      "search-ads-360": ["Campaign structure", "Tracking", "QA", "Monitoring", "Reporting"],
      "amazon-ads": ["Campaign setup", "QA", "Monitoring", "Reporting"],
    },
  },
  caseStudy: {
    slug: "mena-agency-ad-operations",
    eyebrow: "Case study / MENA / Ad Operations",
    context:
      "A leading MENA advertising agency operating across approximately 12 offices faced operational challenges around productivity, resource dependency, QA consistency and talent retention.",
  },
  reporting: {
    title: ["Reporting That Goes", "Beyond Delivery."],
    lead: "Recurring reports in your templates — each cadence answering a different question.",
    cadences: [
      { label: "Daily", items: ["Delivery", "Spend", "Pacing", "Issues"] },
      { label: "Weekly", items: ["Performance", "Trends", "Optimization", "Exceptions"] },
      { label: "Monthly", items: ["KPI performance", "Campaign analysis", "Insights", "Recommendations"] },
      { label: "End of campaign", items: ["Results", "Learnings", "Performance summary", "Future recommendations"] },
    ],
  },
  integration: {
    title: ["Your Team.", "Extended."],
    lead: "Trafficomm adds operational capacity behind your agency. It does not replace your team or sit between you and your clients.",
    agencyOwns: ["Client relationship", "Strategy", "Planning", "Commercial relationship"],
    trafficommSupports: ["Execution", "Trafficking", "QA", "Monitoring", "Programmatic operations", "Reporting"],
  },
  engagement: {
    title: ["Operating Structures", "That Fit the Workload."],
    lead: "Engagements are shaped around volume and continuity. Scope, service levels and commercial terms are agreed with each client.",
    models: [
      { title: "Dedicated team", body: "For sustained campaign volume and ongoing operational requirements — named specialists under a dedicated account manager." },
      { title: "Shared operations", body: "For variable campaign workloads and specialist support, drawing on a pooled operations team." },
      { title: "Project / transition support", body: "For migrations, setup, backlogs, reporting transformation or a phased operational transition." },
    ],
  },
  faqs: [
    {
      q: "What parts of Ad Operations can Trafficomm handle?",
      a: "The full lifecycle: campaign intake and spec sheets, creative auditing, campaign setup and trafficking, ad-server troubleshooting, screenshots, campaign monitoring and optimization against KPIs, and weekly, monthly and end-of-campaign reporting. You can hand over all of it or specific stages.",
    },
    {
      q: "Can Trafficomm work as a white-label extension of an agency?",
      a: "Yes. Trafficomm can operate behind your agency brand, in your tools and templates, with client relationships remaining with you.",
    },
    {
      q: "Which advertising platforms does Trafficomm support?",
      a: "Trafficomm has operational experience across Meta, Google Ads, TikTok, Snapchat, X, LinkedIn, DV360, CM360, Search Ads 360 and Amazon Ads. This reflects platform experience, not a partnership or certification.",
    },
    {
      q: "How does Trafficomm manage QA?",
      a: "QA is a separate function from the build. Work passes checks at input, build, creative, launch and in flight, and account managers are responsible for quality standards. On our longest-running agency engagement, measured work quality is 99.34%.",
    },
    {
      q: "Can Trafficomm support multiple markets?",
      a: "Yes. Trafficomm has campaign experience across Saudi Arabia, the UAE, Qatar, Kuwait, Lebanon and Australia, delivered from a centralized operations team. Our flagship engagement supports an agency operating from approximately 12 offices.",
    },
    {
      q: "How does campaign reporting work?",
      a: "Reporting cadence, KPIs and templates are agreed at the start. Typical cadences are daily, weekly, monthly and end-of-campaign, with commentary on what changed and what to do next.",
    },
    {
      q: "Can Trafficomm work with an agency's existing workflows and tools?",
      a: "Yes. Our teams work inside your ad servers, platforms, ticketing and task-management tools, following your naming conventions and approval steps. Transition is phased — knowledge acquisition, shadowing, then steady state.",
    },
    {
      q: "How does Trafficomm handle confidential client information?",
      a: "Confidentiality is standard. We do not publicize client relationships, and every case study we publish is anonymized. Specific confidentiality terms are agreed with each client.",
    },
    {
      q: "Can Trafficomm support high-volume campaign operations?",
      a: `${companyScaleSentence} Engagements are staffed to the agreed workload; the flagship agency engagement scaled from 4 specialists to approximately 30 as requirements grew.`,
    },
  ],
  related: [
    { href: "/services/programmatic", label: "Programmatic Operations", meta: "DV360 · CM360" },
    { href: "/services/performance-marketing", label: "Performance Marketing", meta: "CPL · CPA · ROAS" },
    { href: "/services/reporting", label: "Reporting & Insights", meta: "Daily to executive" },
    { href: "/services/measurement", label: "Measurement & Analytics", meta: "GA4 · GTM · CAPI" },
    { href: "/case-studies", label: "Case studies", meta: "Documented results" },
    { href: "/how-we-work", label: "How we work", meta: "Transition & QA" },
  ],
  cta: {
    eyebrow: "Let's talk Ad Operations",
    title: ["Where Is Operational Complexity", "Slowing Your Team Down?"],
    lead: "Tell us about your campaign volume, platforms, markets and current operating model. We'll look at where Trafficomm could add specialized execution capacity.",
  },
};

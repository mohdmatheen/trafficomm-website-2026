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
    // The pipeline visual carries the stage-by-stage explanation; the lead only frames it.
    lead: "Trafficomm can run every stage, or the ones where your team needs capacity. QA runs separately from the build, at five gates between intake and reporting.",
    visual: "campaign-pipeline",
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
  integration: {
    title: ["Your Team.", "Extended."],
    lead: "Trafficomm builds, traffics, checks, monitors and reports. Strategy, client relationships and the approval before launch stay with your agency.",
    agencyOwns: ["Strategy", "Client relationship", "Media direction", "Approval & strategic decisions"],
    trafficommSupports: ["Build", "Traffic", "QA", "Monitor", "Report"],
  },
  engagement: {
    title: ["Operating Structures", "That Fit the Workload."],
    lead: "Scope, service levels and commercial terms are agreed with each client.",
    models: [
      { title: "Dedicated team", body: "Named specialists under a dedicated account manager." },
      { title: "Shared operations", body: "Pooled operations capacity for variable workloads." },
      { title: "Project / transition support", body: "Migrations, backlogs and phased transitions." },
    ],
  },
  faqs: [
    {
      q: "Can Trafficomm work as a white-label extension of an agency?",
      a: "Yes. Trafficomm can operate behind your agency brand, in your tools and templates, with client relationships remaining with you. QA stays a separate function from the build — on our longest-running agency engagement, measured work quality is 99.34%.",
    },
    {
      q: "Which advertising platforms does Trafficomm support?",
      a: "Trafficomm has operational experience across Meta, Google Ads, TikTok, Snapchat, X, LinkedIn, DV360, CM360, Search Ads 360 and Amazon Ads. This reflects platform experience, not a partnership or certification.",
    },
    {
      q: "Can Trafficomm support multiple markets?",
      a: "Yes. Trafficomm has campaign experience across Saudi Arabia, the UAE, Qatar, Kuwait, Lebanon and Australia, delivered from a centralized operations team. Our flagship engagement supports an agency operating from approximately 12 offices.",
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
    { href: "/ad-operations-outsourcing", label: "Ad operations outsourcing", meta: "For agencies" },
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

import type { EcosystemPlatform, Platform } from "./types";

/**
 * Trafficomm's own four operations, used where a platform's scope is not
 * separately documented. These describe Trafficomm's operating model — they are
 * never a claim about a platform's features, partnership or certification.
 */
const STANDARD_MODEL = ["Execute", "Optimize", "Measure", "Report"] as const;

export const platforms: Platform[] = [
  {
    slug: "meta",
    hierarchy: ["Campaign", "Ad set", "Ad", "Pixel / CAPI", "Reporting"],
    name: "Meta",
    short: "Facebook & Instagram",
    category: "Social",
    headline: "Meta campaign operations, from pixel to performance.",
    intro:
      "Trafficomm builds, audits, optimizes and reports Meta campaigns across Facebook and Instagram — and implements the Conversions API and tracking that Meta's delivery system depends on.",
    seo: {
      title: "Meta Campaign Operations",
      description:
        "Meta campaign operations for agencies and brands: Facebook and Instagram setup, creative QA, audience strategy, Conversions API implementation, optimization and reporting.",
    },
    capabilities: ["Campaign setup & trafficking", "Creative auditing", "Audience strategy", "Meta CAPI", "A/B testing", "CPL / CPA / ROAS optimization", "Weekly & monthly reporting"],
    operations: [
      { title: "Build", body: "Campaign, ad set and ad structures built to your naming conventions and objectives, with creative assets audited against placement specs." },
      { title: "Signal", body: "Pixel and Conversions API implementation and validation so optimization is based on complete conversion data." },
      { title: "Optimize", body: "Audience, placement, budget and creative optimization against the KPI your client is measured on." },
      { title: "Report", body: "Recurring reporting with commentary on what changed and what to do next." },
    ],
    services: ["performance-marketing", "ad-operations", "measurement", "reporting"],
    ecosystem: ["Campaign Architecture", "Audience", "Creative Testing", "Pixel / CAPI", "Optimization", "Reporting"],
  },
  {
    slug: "google-ads",
    hierarchy: ["Campaign", "Ad group", "Ad", "Conversion", "Reporting"],
    name: "Google Ads",
    short: "Search, YouTube & more",
    category: "Search",
    headline: "Google Ads operations built for efficient, measurable demand.",
    intro:
      "Trafficomm structures and runs Google Ads accounts — paid search, YouTube and other campaign types — with conversion tracking and GA4 set up to support bidding and reporting.",
    seo: {
      title: "Google Ads Operations",
      description:
        "Google Ads operations: paid search and YouTube campaign architecture, conversion tracking, GA4 integration, budget allocation, optimization and reporting.",
    },
    capabilities: ["Account & campaign architecture", "Paid search", "YouTube campaigns", "Conversion tracking", "GA4 integration", "Budget allocation", "Performance reporting"],
    operations: [
      { title: "Structure", body: "Account and campaign architecture aligned to products, markets and KPIs." },
      { title: "Track", body: "Conversion tracking via Google Tag Manager and GA4, validated before optimization begins." },
      { title: "Optimize", body: "Budget, keyword, audience and creative optimization against CPL, CPA or ROAS targets." },
      { title: "Report", body: "Performance reporting from daily pacing to end-of-campaign analysis." },
    ],
    services: ["performance-marketing", "measurement", "reporting"],
    ecosystem: ["Search", "Display", "YouTube", "Campaign Management", "Conversion Tracking", "Optimization", "Reporting"],
  },
  {
    slug: "tiktok",
    name: "TikTok",
    short: "TikTok Ads Manager",
    category: "Social",
    headline: "TikTok campaigns operated with the same rigor as search.",
    intro:
      "Trafficomm handles TikTok campaign setup, creative auditing, testing and optimization — bringing structured operations to a platform where creative velocity matters.",
    seo: {
      title: "TikTok Campaign Operations",
      description:
        "TikTok campaign operations for agencies and brands: setup and trafficking, creative auditing, A/B testing, pixel and event tracking, optimization and reporting.",
    },
    capabilities: ["Campaign setup & trafficking", "Creative auditing", "Creative testing", "Pixel & event tracking", "Video performance optimization", "Reporting"],
    operations: [
      { title: "Build", body: "Campaigns built to objective, with video assets checked against TikTok specs before launch." },
      { title: "Test", body: "Structured creative testing to identify the hooks and formats that perform." },
      { title: "Optimize", body: "Delivery, audience and budget optimization toward view and conversion KPIs." },
      { title: "Report", body: "Weekly, monthly and end-of-campaign reporting." },
    ],
    services: ["performance-marketing", "ad-operations", "reporting"],
    ecosystem: ["Campaign Setup", "Audience", "Creative Testing", "Optimization", "Reporting"],
  },
  {
    slug: "snapchat",
    name: "Snapchat",
    short: "Snapchat Ads",
    category: "Social",
    headline: "Snapchat operations for audiences that matter in the Gulf.",
    intro:
      "Trafficomm sets up, audits, optimizes and reports Snapchat campaigns for agencies and brands, including the pixel and conversion tracking behind performance objectives.",
    seo: {
      title: "Snapchat Campaign Operations",
      description:
        "Snapchat campaign operations: setup and trafficking, creative auditing, pixel and conversion tracking, optimization and reporting for agencies and brands.",
    },
    capabilities: ["Campaign setup & trafficking", "Creative auditing", "Pixel & conversion tracking", "Audience strategy", "Optimization", "Reporting"],
    operations: [
      { title: "Build", body: "Campaigns and ad squads structured to objective, with creatives audited to spec." },
      { title: "Track", body: "Pixel and conversion tracking implemented and validated." },
      { title: "Optimize", body: "Budget, audience and creative optimization in flight." },
      { title: "Report", body: "Recurring reporting in your templates." },
    ],
    services: ["performance-marketing", "ad-operations", "measurement", "reporting"],
    ecosystem: ["Campaign Setup", "Audience", "Creative Management", "Optimization", "Reporting"],
  },
  {
    slug: "x",
    name: "X",
    short: "Formerly Twitter",
    category: "Social",
    headline: "X campaign operations, executed and reported consistently.",
    intro:
      "Trafficomm manages X (formerly Twitter) campaign setup, creative auditing, monitoring and reporting as part of multi-platform social programs.",
    seo: {
      title: "X (Twitter) Campaign Operations",
      description:
        "X (formerly Twitter) campaign operations: setup and trafficking, creative auditing, monitoring, optimization and reporting within multi-platform social programs.",
    },
    capabilities: ["Campaign setup & trafficking", "Creative auditing", "Screenshots", "Monitoring & optimization", "Reporting"],
    operations: [
      { title: "Build", body: "Campaigns built to objective and naming conventions, with creatives audited." },
      { title: "Monitor", body: "Delivery and pacing monitored alongside your other social platforms." },
      { title: "Optimize", body: "In-flight adjustments against KPI." },
      { title: "Report", body: "Consolidated reporting across social platforms." },
    ],
    services: ["ad-operations", "performance-marketing", "reporting"],
    ecosystem: ["Campaign Setup", "Audience", "Creative Management", "Monitoring", "Reporting"],
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    short: "LinkedIn Campaign Manager",
    category: "Professional",
    headline: "LinkedIn operations for B2B demand and lead generation.",
    intro:
      "Trafficomm builds and optimizes LinkedIn campaigns for B2B lead generation and awareness, with conversion tracking and reporting that connects spend to pipeline metrics.",
    seo: {
      title: "LinkedIn Campaign Operations",
      description:
        "LinkedIn campaign operations: B2B lead generation setup, audience targeting, creative auditing, Insight Tag and conversion tracking, optimization and reporting.",
    },
    capabilities: ["Campaign setup & trafficking", "B2B audience strategy", "Lead generation", "Insight Tag & conversion tracking", "CPL optimization", "Reporting"],
    operations: [
      { title: "Build", body: "Campaign groups and campaigns structured by audience and objective." },
      { title: "Track", body: "Insight Tag and conversion tracking implemented and validated." },
      { title: "Optimize", body: "Audience, bid and creative optimization toward CPL." },
      { title: "Report", body: "Lead and performance reporting." },
    ],
    services: ["performance-marketing", "measurement", "reporting"],
    ecosystem: ["Campaign Setup", "Audience", "Lead Generation", "Optimization", "Reporting"],
  },
  {
    slug: "dv360",
    hierarchy: ["Campaign", "Insertion order", "Line item", "Creative", "Inventory"],
    name: "DV360",
    short: "Display & Video 360",
    category: "Programmatic",
    headline: "DV360 operations: structure, deals, delivery.",
    intro:
      "Trafficomm supports agency programmatic teams and trading desks in Display & Video 360 — plan structure, line items, creative approvals, PMP deal troubleshooting, monitoring and reporting.",
    seo: {
      title: "DV360 Operations",
      description:
        "DV360 operations for agencies and trading desks: insertion order and line-item structure, display, video and YouTube, PMP deal troubleshooting, creative approval and reporting.",
    },
    capabilities: ["Plan & line-item structure", "Display, video & YouTube", "PMP deal troubleshooting", "Creative approval tracking", "Pacing & monitoring", "Reporting"],
    operations: [
      { title: "Structure", body: "Insertion orders and line items built from the approved plan and booking order." },
      { title: "Approve", body: "Creative approval status tracked; issues coordinated with the agency team." },
      { title: "Deals", body: "PMP deals checked and troubleshot so they transact." },
      { title: "Report", body: "Delivery monitoring, optimization and reporting; completed requests logged in your CRM." },
    ],
    services: ["programmatic", "ad-operations", "reporting"],
    officialName: "Display & Video 360",
    ecosystem: ["Campaign Build", "Line Items", "Creative QA", "PMP", "Deal Troubleshooting", "Optimization", "Reporting"],
  },
  {
    slug: "cm360",
    hierarchy: ["Campaign", "Placement", "Ad", "Creative", "Tracking"],
    name: "CM360",
    short: "Campaign Manager 360",
    category: "Ad Serving",
    headline: "CM360 trafficking and ad-server operations at volume.",
    intro:
      "Trafficomm traffics and troubleshoots campaigns in Campaign Manager 360 — placements, creatives, third-party tags, floodlights and reporting — for agencies running high campaign volumes.",
    seo: {
      title: "CM360 Campaign Management & Trafficking",
      description:
        "CM360 campaign management: placement and creative trafficking, tag generation and troubleshooting, creative QA, screenshots and ad-server reporting.",
    },
    capabilities: ["Placement & creative trafficking", "Tag generation & troubleshooting", "Creative auditing", "Ad-server troubleshooting", "Screenshots", "Ad-server reporting"],
    operations: [
      { title: "Traffic", body: "Campaigns, placements and creatives set up from the media plan and spec sheet." },
      { title: "Tag", body: "Tags generated, sent to publishers and troubleshot until serving correctly." },
      { title: "Verify", body: "QA and live screenshots confirm delivery." },
      { title: "Report", body: "Ad-server reporting, discrepancy checks and end-of-campaign reports." },
    ],
    services: ["ad-operations", "programmatic", "creative-adtech", "reporting"],
    officialName: "Campaign Manager 360",
    ecosystem: ["Trafficking", "Tag Management", "Creative QA", "Ad-server Troubleshooting", "Screenshots", "Reporting"],
  },
  {
    slug: "search-ads-360",
    name: "Search Ads 360",
    short: "Search Ads 360",
    category: "Search",
    headline: "Search Ads 360 operations across engines and accounts.",
    intro:
      "Trafficomm supports Search Ads 360 management for advertisers running search across engines and accounts — structure, bidding support, tracking and consolidated reporting.",
    seo: {
      title: "Search Ads 360 Operations",
      description:
        "Search Ads 360 operations: cross-engine campaign management, structure, conversion tracking, optimization support and consolidated search reporting.",
    },
    capabilities: ["Cross-engine campaign management", "Account structure", "Conversion tracking", "Optimization support", "Consolidated reporting"],
    operations: [
      { title: "Structure", body: "Consistent campaign structures across engines and accounts." },
      { title: "Track", body: "Conversion tracking aligned between engines and analytics." },
      { title: "Optimize", body: "Bidding and budget optimization support against targets." },
      { title: "Report", body: "Consolidated search reporting." },
    ],
    services: ["performance-marketing", "measurement", "reporting"],
    ecosystem: ["Cross-engine Management", "Campaign Structure", "Conversion Tracking", "Optimization", "Reporting"],
  },
  {
    slug: "amazon-ads",
    name: "Amazon Ads",
    short: "Retail media",
    category: "Retail Media",
    headline: "Amazon Ads operations for retail media programs.",
    intro:
      "Trafficomm supports Amazon Ads campaign setup, monitoring, optimization and reporting as part of multi-platform performance programs.",
    seo: {
      title: "Amazon Ads Operations",
      description:
        "Amazon Ads operations: campaign setup, monitoring, budget and bid optimization support, and reporting within multi-platform retail media and performance programs.",
    },
    capabilities: ["Campaign setup", "Monitoring & pacing", "Optimization support", "ROAS reporting"],
    operations: [
      { title: "Build", body: "Campaigns structured by product and objective." },
      { title: "Monitor", body: "Pacing and delivery monitored in flight." },
      { title: "Optimize", body: "Bid and budget optimization support toward ROAS targets." },
      { title: "Report", body: "Reporting consolidated with your other performance channels." },
    ],
    services: ["performance-marketing", "reporting"],
    ecosystem: ["Campaign Setup", "Sponsored Advertising", "Optimization", "Reporting"],
  },
];

export const getPlatform = (slug: string) => platforms.find((p) => p.slug === slug);

/**
 * Platforms Trafficomm operates across that do not yet have enough approved,
 * documented Trafficomm content to support a dedicated operations page.
 *
 * They are real coverage and belong in the ecosystem, the menus and the lists —
 * but a page here would have to be invented, so there is none. Each carries the
 * standard Trafficomm operating model (execute, optimize, measure, report)
 * rather than a platform-specific scope, and `standardModel` makes the UI say so.
 *
 * Naming: current product names only. "Microsoft Advertising" is the official
 * name; "Bing" appears once, in brackets, purely for recognition.
 */
export const additionalPlatforms: readonly EcosystemPlatform[] = [
  { slug: "microsoft-advertising", name: "Microsoft Advertising", officialName: "Microsoft Advertising (Bing)", category: "Search", ecosystem: STANDARD_MODEL, standardModel: true },
  { slug: "noon", name: "Noon", category: "Commerce & Delivery", ecosystem: STANDARD_MODEL, standardModel: true },
  { slug: "talabat", name: "Talabat", category: "Commerce & Delivery", ecosystem: STANDARD_MODEL, standardModel: true },
  { slug: "chatgpt", name: "ChatGPT", category: "AI Platforms", ecosystem: STANDARD_MODEL, standardModel: true },
] as const;

/**
 * The full ecosystem, in the order the visuals and menus read it: documented
 * platforms first (they link to their page), then the rest.
 *
 * Nothing derived from this list states a count. Platform coverage keeps
 * expanding, so the copy around it is written to stay true as it grows.
 */
export const ecosystemPlatforms: readonly EcosystemPlatform[] = [
  ...platforms.map(({ slug, name, officialName, category, ecosystem }) => ({ slug, name, officialName, category, ecosystem, href: `/platforms/${slug}` })),
  ...additionalPlatforms,
];

/** Platform names for prose and metadata, without implying the list is closed. */
export const ecosystemNames = ecosystemPlatforms.map((p) => p.name);

import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "ad-operations",
    code: "AD-OPS",
    scopeLine: ["Setup", "Trafficking", "QA", "Reporting"],
    name: "Ad Operations",
    short: "Setup, trafficking, QA, pacing and reporting — run as a managed operation.",
    headline: "The operational core behind every campaign you launch.",
    intro:
      "From booking order to end-of-campaign report, Trafficomm runs the day-to-day mechanics of digital advertising for agencies, networks and publishers — with dedicated account management, structured task allocation and a separate QA layer.",
    summary:
      "Campaign setup, trafficking, creative auditing, tag and ad-server troubleshooting, pacing, monitoring and reporting — delivered by a dedicated team working inside your workflow.",
    seo: {
      title: "Ad Operations Outsourcing",
      description:
        "Outsourced digital advertising operations: campaign setup, trafficking, creative QA, tag troubleshooting, pacing and reporting for agencies, ad networks and publishers.",
    },
    functions: ["Campaign setup", "Trafficking", "Creative QA", "Pacing", "Reporting"],
    groups: [
      {
        title: "Setup & trafficking",
        items: ["Campaign setup", "Trafficking", "Booking / order QA", "Screenshots", "Workflow management"],
      },
      {
        title: "Creative & tag QA",
        items: ["Creative auditing", "Creative QA", "Tag troubleshooting", "Ad-server troubleshooting"],
      },
      {
        title: "In-flight management",
        items: ["Campaign monitoring", "Pacing", "KPI optimization"],
      },
      {
        title: "Reporting",
        items: ["Weekly reporting", "Monthly reporting", "End-of-campaign reporting"],
      },
    ],
    outcomes: [
      {
        title: "Capacity without hiring cycles",
        body: "Add trained ad operations specialists to your delivery model without recruiting, onboarding and retaining every role internally.",
      },
      {
        title: "Consistent quality",
        body: "A dedicated QA layer checks setups, creatives and tags before they go live — so quality does not depend on who happened to build the campaign.",
      },
      {
        title: "Less key-person risk",
        body: "Work is allocated across a structured team under an account manager, not concentrated on a single trafficker who becomes a bottleneck.",
      },
      {
        title: "More time for optimization",
        body: "When setup and trafficking are handled, your planners and account leads spend their time on performance and client relationships.",
      },
    ],
    workflow: [
      { step: "Intake", body: "Approved media plan, booking order, spec sheet and materials arrive through your existing channel or ticketing tool." },
      { step: "Creative audit", body: "Creatives and third-party tags are checked against publisher and platform specs; issues are returned with specifics." },
      { step: "Setup & trafficking", body: "Campaigns are built and trafficked in the ad server or platform, with booking orders and tags sent to publishers where required." },
      { step: "QA & screenshots", body: "An independent QA pass verifies the build; live screenshots are captured as proof of delivery." },
      { step: "Monitor & optimize", body: "Delivery, pacing and KPIs are monitored in flight and adjusted to plan." },
      { step: "Report", body: "Weekly, monthly and end-of-campaign reports are delivered in your templates." },
    ],
    platforms: ["cm360", "dv360", "meta", "google-ads", "tiktok", "snapchat", "linkedin", "x"],
    relatedCases: ["mena-agency-ad-operations", "uae-broadcaster-monetization"],
    faqs: [
      {
        q: "Do you work in our tools or yours?",
        a: "Yours. Our teams operate inside your ad servers, platforms, ticketing and task-management tools, and follow your naming conventions, templates and approval steps.",
      },
      {
        q: "How is quality controlled?",
        a: "Every engagement has a dedicated account manager accountable for SLAs, and QA is performed as a separate step from the build. On our longest-running agency engagement, measured work quality stands at 99.34%.",
      },
      {
        q: "How do you take over work from an in-house team?",
        a: "Through a phased transition: knowledge acquisition, secondary shadowing, primary shadowing and steady state — sequenced by complexity and business criticality. See How We Work for the full model.",
      },
    ],
    viz: "pacing",
    explorer: {
      flow: [
        { label: "Plan", details: ["Media plan review", "Requirements", "Specs & assets"] },
        { label: "Build", details: ["Campaign setup", "Trafficking", "Tags"] },
        { label: "QA", details: ["Creative QA", "Campaign QA", "Tracking validation"] },
        { label: "Launch", details: ["Activation", "Publisher coordination", "Screenshots"] },
        { label: "Monitor", details: ["Pacing", "Delivery", "Issues"] },
        { label: "Optimize", details: ["Budget", "KPI", "Audience", "Creative"] },
        { label: "Report", details: ["Performance", "Insights", "Recommendations"] },
      ],
      capabilities: ["Campaign Setup", "Trafficking", "Creative QA", "Tag Troubleshooting", "Pacing", "Campaign Monitoring", "KPI Monitoring", "Reporting"],
    },
  },
  {
    slug: "performance-marketing",
    code: "PERF",
    scopeLine: ["Paid social", "Paid search", "Optimization"],
    name: "Performance Marketing",
    short: "Paid social and search campaigns engineered around CPL, CPA and ROAS.",
    headline: "Performance marketing run like an operation, not a guess.",
    intro:
      "Trafficomm's performance team starts with your historical data — audiences, demographics, behavior and gaps — then builds, tests and continuously optimizes multichannel campaigns against the cost and return metrics that matter to your clients.",
    summary:
      "Campaign architecture, audience strategy, paid social, paid search, budget allocation, creative and A/B testing, and continuous optimization against CPL, CPA and ROAS.",
    seo: {
      title: "Performance Marketing Outsourcing",
      description:
        "Outsourced performance marketing for agencies and brands: campaign architecture, audience strategy, paid social and search, A/B testing and optimization for CPL, CPA and ROAS.",
    },
    functions: ["Architecture", "Audiences", "A/B testing", "Optimization", "ROAS"],
    groups: [
      {
        title: "Strategy & structure",
        items: ["Campaign architecture", "Audience strategy", "Budget allocation", "Performance analysis"],
      },
      { title: "Channels", items: ["Paid social", "Paid search", "Lead generation"] },
      { title: "Testing", items: ["Creative testing", "A/B testing"] },
      { title: "Optimization targets", items: ["Campaign optimization", "CPL", "CPA", "ROAS"] },
    ],
    outcomes: [
      {
        title: "Decisions grounded in history",
        body: "We analyze past account performance to find the audience, demographic and structural gaps before spending another dollar.",
      },
      {
        title: "Structured testing",
        body: "Creative and audience hypotheses are tested deliberately with A/B frameworks, so learnings compound across flights.",
      },
      {
        title: "Continuous optimization",
        body: "Campaigns are monitored and adjusted throughout the flight — not only at the weekly report.",
      },
      {
        title: "White-label ready",
        body: "Our specialists can work under your agency brand, reporting through your account teams to your clients.",
      },
    ],
    workflow: [
      { step: "Audit", body: "Review historical account data, tracking and structure to identify what is driving cost." },
      { step: "Strategy", body: "Define audiences, channel mix, budget allocation and a test plan aligned to KPI targets." },
      { step: "Build", body: "Architect campaigns across social and search platforms with clean naming and tracking." },
      { step: "Test", body: "Run creative and audience A/B tests with clear success criteria." },
      { step: "Optimize", body: "Reallocate budget and refine targeting continuously against CPL, CPA, CPV or ROAS." },
      { step: "Analyze", body: "Report performance with the analysis behind it and the next actions agreed." },
    ],
    platforms: ["meta", "google-ads", "tiktok", "snapchat", "linkedin", "x", "amazon-ads", "search-ads-360"],
    relatedCases: ["middle-east-performance-marketing"],
    faqs: [
      {
        q: "Do you set strategy or just execute?",
        a: "Both, depending on the model you need. A common model is for the agency to keep strategy and client ownership while Trafficomm handles architecture, execution, testing and optimization. We can also contribute to strategy using historical performance analysis.",
      },
      {
        q: "Which metrics do you optimize toward?",
        a: "The ones your clients are judged on — typically CPL, CPA, CPV, VTR and ROAS — defined at the start of each engagement.",
      },
    ],
    viz: "funnel",
    explorer: {
      flow: [
        { label: "Data", details: ["Historical performance", "Account structure", "Tracking check"] },
        { label: "Audience", details: ["Segments", "Demographics", "Behavior"] },
        { label: "Structure", details: ["Campaign architecture", "Budget allocation", "Naming"] },
        { label: "Creative testing", details: ["Variants", "Hypotheses", "Formats"] },
        { label: "Launch", details: ["Activation", "Tracking validation"] },
        { label: "A/B testing", details: ["Creative", "Audience", "Placement"] },
        { label: "Optimize", details: ["CPL", "CPA", "ROAS"] },
        { label: "Insights", details: ["Performance analysis", "Next actions"] },
      ],
      capabilities: ["Meta", "Google Ads", "TikTok", "Snapchat", "LinkedIn", "Audience Strategy", "Budget Allocation", "Creative Testing", "CPA", "CPL", "ROAS"],
    },
  },
  {
    slug: "programmatic",
    code: "PROG",
    scopeLine: ["DV360", "CM360", "Programmatic execution"],
    name: "Programmatic Operations",
    short: "DV360 and CM360 execution — from line-item structure to deal troubleshooting.",
    headline: "Programmatic execution, handled by people who live in DV360 and CM360.",
    intro:
      "Trading desks and agency programmatic teams use Trafficomm to build plan structures, traffic creatives, resolve approval and PMP deal issues, and keep display, video and YouTube campaigns delivering to plan.",
    summary:
      "DV360 and CM360 campaign setup, line-item structure, display, video, YouTube, PMP deals, creative approval, deal troubleshooting, monitoring, optimization and reporting.",
    seo: {
      title: "Programmatic Operations — DV360 & CM360",
      description:
        "Programmatic operations support for agencies and trading desks: DV360 plan structure, CM360 trafficking, PMP deal troubleshooting, creative approvals, monitoring and reporting.",
    },
    functions: ["DV360", "CM360", "Line items", "PMP deals", "YouTube"],
    groups: [
      { title: "Platforms", items: ["DV360", "CM360"] },
      { title: "Build", items: ["Campaign setup", "Line-item structure", "Creative approval"] },
      { title: "Formats & inventory", items: ["Display", "Video", "YouTube", "PMP"] },
      { title: "Run", items: ["Deal troubleshooting", "Campaign monitoring", "Optimization", "Reporting"] },
    ],
    outcomes: [
      {
        title: "Traders focus on trading",
        body: "Plan structures, trafficking and approvals are handled so your traders spend their time on inventory, bidding and performance.",
      },
      {
        title: "Faster issue resolution",
        body: "Our team coordinates directly with your agency team to troubleshoot creative, tag and PMP deal issues before they cost delivery.",
      },
      {
        title: "Clean, auditable builds",
        body: "Consistent line-item structures and naming make optimization and reporting simpler for everyone downstream.",
      },
    ],
    workflow: [
      { step: "Brief", body: "Approved media plan, booking order and materials come from the trader or trading desk." },
      { step: "Structure", body: "Insertion orders and line items are structured in DV360; placements and creatives trafficked in CM360." },
      { step: "Approvals", body: "Creative approval status is tracked and issues are escalated with the agency team." },
      { step: "Deals", body: "PMP deals are checked and troubleshot so they transact as expected." },
      { step: "Monitor", body: "Pacing and delivery are monitored; optimizations applied per plan." },
      { step: "Report", body: "Completed requests are logged in your CRM or task tool; reporting delivered on schedule." },
    ],
    platforms: ["dv360", "cm360", "search-ads-360"],
    relatedCases: ["mena-agency-ad-operations"],
    faqs: [
      {
        q: "Can you work alongside our existing trading desk?",
        a: "Yes. The typical model is that your traders own strategy and buying decisions while Trafficomm handles structure, trafficking, approvals, troubleshooting and reporting.",
      },
    ],
    viz: "lineitems",
    explorer: {
      flow: [
        { label: "Media plan", details: ["Approved plan", "Booking order", "Materials"] },
        { label: "DV360 structure", details: ["Insertion orders", "Line items"] },
        { label: "Build", details: ["Campaign setup", "Targeting"] },
        { label: "Creative approval", details: ["Approval status", "Tag issues"] },
        { label: "PMP / deals", details: ["Deal setup", "Troubleshooting"] },
        { label: "QA", details: ["Build check", "Tracking"] },
        { label: "Launch", details: ["Activation", "Screenshots"] },
        { label: "Optimize", details: ["Pacing", "Delivery"] },
        { label: "Report", details: ["Reporting", "CRM updates"] },
      ],
      capabilities: ["DV360", "CM360", "Display", "Video", "YouTube", "PMP", "Creative QA", "Deal Troubleshooting", "Optimization", "Reporting"],
    },
  },
  {
    slug: "measurement",
    code: "MEAS",
    scopeLine: ["GA4", "GTM", "Conversion tracking", "CAPI"],
    name: "Measurement & Analytics",
    short: "GA4, GTM, conversion tracking and CAPI — so the numbers can be trusted.",
    headline: "Optimization is only as good as the data underneath it.",
    intro:
      "Trafficomm implements and validates the measurement layer your campaigns depend on — tag management, conversion tracking, server-side signals and analytics configuration — and documents it so it stays reliable.",
    summary:
      "GA4, Google Tag Manager, conversion tracking, Meta Conversions API, tag implementation, data validation, measurement architecture and attribution support.",
    seo: {
      title: "Measurement & Analytics — GA4, GTM, Meta CAPI",
      description:
        "GA4 and Google Tag Manager implementation, conversion tracking, Meta Conversions API, data validation and measurement architecture for advertisers and agencies.",
    },
    functions: ["GA4", "GTM", "CAPI", "Validation", "Attribution"],
    groups: [
      { title: "Analytics", items: ["GA4", "Measurement architecture", "Attribution support"] },
      { title: "Tagging", items: ["Google Tag Manager", "Tag implementation", "Conversion tracking"] },
      { title: "Signals", items: ["Meta CAPI"] },
      { title: "Assurance", items: ["Data validation"] },
    ],
    outcomes: [
      {
        title: "Numbers you can defend",
        body: "Validated conversion tracking means optimization decisions and client reports rest on data that has been checked.",
      },
      {
        title: "A documented architecture",
        body: "Events, tags and conversions are mapped and documented, so the setup survives team changes.",
      },
      {
        title: "Stronger platform signals",
        body: "Server-side signals such as Meta CAPI complement browser tracking to support platform optimization.",
      },
    ],
    workflow: [
      { step: "Audit", body: "Review existing tags, events, conversions and analytics configuration." },
      { step: "Architecture", body: "Define the measurement plan \u2014 events, parameters, conversions and ownership." },
      { step: "Implement", body: "Deploy through Google Tag Manager, GA4 and platform integrations including CAPI." },
      { step: "Validate", body: "Test and reconcile data across analytics and ad platforms." },
      { step: "Document", body: "Hand over a clear map of what is tracked, where and why." },
    ],
    platforms: ["meta", "google-ads", "tiktok", "snapchat", "linkedin", "cm360"],
    relatedCases: [],
    faqs: [
      {
        q: "Do you replace our analytics team?",
        a: "No. We typically implement and validate the tracking layer and support your analysts and media teams with reliable data.",
      },
    ],
    viz: "tags",
    explorer: {
      flow: [
        { label: "User action", details: ["Conversions", "Key events"] },
        { label: "Tag", details: ["Pixels", "Tags"] },
        { label: "GTM", details: ["Containers", "Triggers", "Variables"] },
        { label: "GA4 / platform", details: ["GA4", "Meta CAPI", "Platform events"] },
        { label: "Conversion", details: ["Conversion tracking", "Validation"] },
        { label: "Attribution", details: ["Attribution support"] },
        { label: "Insight", details: ["Reliable reporting", "Optimization signals"] },
      ],
      capabilities: ["GA4", "Google Tag Manager", "Meta CAPI", "Conversion Tracking", "Tag Implementation", "Data Validation", "Measurement Architecture", "Attribution Support"],
    },
  },
  {
    slug: "reporting",
    code: "RPT",
    scopeLine: ["Daily", "Weekly", "Monthly", "Campaign analysis"],
    name: "Reporting & Insights",
    short: "Daily to executive reporting, with the analysis that turns data into action.",
    headline: "Reporting that tells your team what to do next.",
    intro:
      "Trafficomm produces the recurring reporting agencies and brands depend on — daily, weekly, monthly and end-of-campaign — in your templates, and adds the analysis that explains what happened and what should change.",
    summary:
      "Daily, weekly, monthly and end-of-campaign reporting, dashboards, campaign analysis, KPI monitoring, executive reporting and actionable insights.",
    seo: {
      title: "Advertising Reporting & Campaign Insights",
      description:
        "Outsourced advertising reporting: daily, weekly, monthly and end-of-campaign reports, dashboards, KPI monitoring and executive-level campaign insights.",
    },
    functions: ["Daily", "Weekly", "Monthly", "Dashboards", "Insights"],
    groups: [
      {
        title: "Cadence",
        items: ["Daily reporting", "Weekly reporting", "Monthly reporting", "End-of-campaign reporting"],
      },
      { title: "Formats", items: ["Dashboards", "Executive reporting"] },
      { title: "Analysis", items: ["Campaign analysis", "KPI monitoring", "Actionable insights"] },
    ],
    outcomes: [
      {
        title: "On-time, every time",
        body: "Recurring reports run to an agreed schedule and template, reducing late-night report building for account teams.",
      },
      {
        title: "Insight, not just export",
        body: "Each report carries commentary on what moved, why, and the recommended next action.",
      },
      {
        title: "Transparent operations",
        body: "Reporting extends to the operation itself — so you can see what was delivered, when and to what standard.",
      },
    ],
    workflow: [
      { step: "Define", body: "Agree KPIs, cadence, audiences and templates for each report." },
      { step: "Collect", body: "Pull and reconcile data from ad platforms, ad servers and analytics." },
      { step: "Validate", body: "Check totals and discrepancies before anything is shared." },
      { step: "Analyze", body: "Add commentary on performance drivers and recommended actions." },
      { step: "Deliver", body: "Ship to your team or directly to clients under your brand." },
    ],
    platforms: ["meta", "google-ads", "dv360", "cm360", "tiktok", "snapchat", "linkedin", "x", "search-ads-360", "amazon-ads"],
    relatedCases: ["uae-broadcaster-monetization", "mena-agency-ad-operations"],
    faqs: [
      {
        q: "Can reports go directly to our clients?",
        a: "Yes. Reports can be produced in your templates and under your brand, so Trafficomm stays invisible to your clients if you prefer.",
      },
    ],
    viz: "report",
    explorer: {
      flow: [
        { label: "Platform data", details: ["Ad platforms", "Ad servers", "Analytics"] },
        { label: "Validation", details: ["Reconciliation", "Discrepancies"] },
        { label: "Aggregation", details: ["Templates", "Consolidation"] },
        { label: "KPI analysis", details: ["KPIs", "Trends"] },
        { label: "Dashboard", details: ["Dashboards", "Scheduled reports"] },
        { label: "Insight", details: ["Commentary", "Exceptions"] },
        { label: "Recommendation", details: ["Next actions", "Priorities"] },
      ],
      capabilities: ["Daily Reporting", "Weekly Reporting", "Monthly Reporting", "Dashboards", "KPI Monitoring", "Campaign Analysis", "Executive Reporting", "Recommendations"],
    },
  },
  {
    slug: "creative-adtech",
    code: "CRTV",
    scopeLine: ["Rich media", "Creative QA", "Ad serving"],
    name: "Creative & AdTech",
    short: "Rich media production, third-party tags, ad-server integration and monetization.",
    headline: "Where creative production meets advertising technology.",
    intro:
      "Trafficomm combines a creative production team — designers, developers and creative direction — with ad-tech depth in rich media platforms, third-party tags, Google Ad Manager and inventory architecture for publishers.",
    summary:
      "Creative auditing, static, video and rich media creative, third-party tags, creative development in Celtra and Bonzai, ad-server integration, Google Ad Manager, publisher monetization and inventory architecture.",
    seo: {
      title: "Rich Media Creative & AdTech Services",
      description:
        "Rich media creative development in Celtra and Bonzai, creative auditing, third-party tags, Google Ad Manager integration and publisher monetization.",
    },
    functions: ["Rich media", "Celtra", "Bonzai", "GAM", "Monetization"],
    groups: [
      { title: "Creative", items: ["Static creative", "Video creative", "Rich media", "Creative development"] },
      { title: "Rich media platforms", items: ["Celtra", "Bonzai"] },
      { title: "Creative QA", items: ["Creative auditing", "Third-party tags"] },
      {
        title: "Publisher ad tech",
        items: ["Ad-server integration", "Google Ad Manager", "Publisher monetization", "Advertising inventory architecture"],
      },
    ],
    outcomes: [
      {
        title: "A studio on demand",
        body: "Access a creative director, designers and developers who specialize in advertising formats — without building a studio.",
      },
      {
        title: "Formats that work in market",
        body: "Creatives are built to platform and publisher specs, with tags and executions audited before launch.",
      },
      {
        title: "Inventory that earns",
        body: "For publishers, a structured ad inventory framework, ad-server integration and reporting turn digital properties into revenue.",
      },
    ],
    workflow: [
      { step: "Brief", body: "Objectives, brand guidelines, formats and placements are agreed." },
      { step: "Concept", body: "Creative direction and storyboards for static, video or rich media executions." },
      { step: "Develop", body: "Production in Celtra, Bonzai or custom HTML5, with third-party tags as required." },
      { step: "Audit", body: "Specs, weight, interactions and tracking are checked before delivery." },
      { step: "Integrate", body: "Tags delivered and trafficked through the ad server or Google Ad Manager." },
    ],
    platforms: ["cm360", "dv360", "meta", "snapchat", "tiktok"],
    relatedCases: ["rich-media-creative-studio", "uae-broadcaster-monetization"],
    faqs: [
      {
        q: "Do you work with publishers as well as agencies?",
        a: "Yes. For publishers we design advertising inventory frameworks, integrate Google Ad Manager, manage campaigns and automate inventory and billing reporting.",
      },
    ],
    viz: "creative",
    explorer: {
      flow: [
        { label: "Brief", details: ["Objectives", "Formats", "Placements"] },
        { label: "Specification", details: ["Publisher specs", "File weights"] },
        { label: "Creative audit", details: ["Specs", "Third-party tags"] },
        { label: "Development", details: ["Static", "Video", "Rich media \u00b7 Celtra / Bonzai"] },
        { label: "Ad server", details: ["Google Ad Manager", "Ad-server integration"] },
        { label: "QA", details: ["Interactions", "Tracking"] },
        { label: "Delivery", details: ["Trafficking", "Handover"] },
      ],
      capabilities: ["Static", "Video", "Rich Media", "Third-party Tags", "Celtra", "Bonzai", "Google Ad Manager", "Ad-server Integration"],
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

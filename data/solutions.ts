import type { Solution } from "./types";

export const solutions: Solution[] = [
  {
    slug: "media-agencies",
    name: "For Media Agencies",
    audience: "Media agencies",
    headline: "Scale media delivery without scaling operational headcount.",
    intro:
      "Media agencies win on strategy, planning and client relationships. Trafficomm takes on the execution layer underneath — trafficking, QA, programmatic builds, monitoring and reporting — as a dedicated extension of your team.",
    seo: {
      title: "Media Agency Outsourcing — Ad Operations & Programmatic",
      description:
        "An operations extension for media agencies: trafficking, creative QA, DV360 and CM360 execution, pacing and reporting delivered by a dedicated team under SLA.",
    },
    pressures: [
      "More clients, markets and platforms per planner",
      "Ad operations dependent on one or two key people",
      "Inconsistent quality across offices and teams",
      "Difficulty hiring and retaining ad operations talent",
      "Reporting absorbing account teams' time",
    ],
    model: {
      theyOwn: ["Strategy", "Media planning & buying", "Client relationships", "Commercial decisions"],
      weOwn: ["Campaign setup & trafficking", "Creative audit & QA", "Programmatic builds", "Monitoring & pacing", "Reporting"],
    },
    engagements: [
      {
        title: "Dedicated ad operations team",
        body: "Account managers and ad operations specialists assigned to your agency, working in your tools and templates under agreed SLAs.",
      },
      {
        title: "Centralized multi-office operations",
        body: "One structured team serving multiple offices — the model behind our 7+ year partnership with a leading MENA advertising agency.",
      },
      {
        title: "Overflow and peak capacity",
        body: "Additional operational capacity for launch-heavy periods, new client wins and market expansion.",
      },
    ],
    services: ["ad-operations", "programmatic", "reporting", "creative-adtech"],
    relatedCases: ["mena-agency-ad-operations"],
    faqs: [
      {
        q: "Will our clients know you are involved?",
        a: "Only if you want them to. We can operate entirely behind your agency brand.",
      },
      {
        q: "How quickly can a team be in place?",
        a: "Transition is phased by business area — knowledge acquisition, shadowing and steady state — and planned with you at the outset based on complexity and criticality.",
      },
    ],
  },
  {
    slug: "performance-agencies",
    name: "For Performance Agencies",
    audience: "Performance marketing agencies",
    headline: "More campaigns. Tighter optimization loops. Same core team.",
    intro:
      "Performance agencies live and die by CPL, CPA and ROAS. Trafficomm adds campaign architects, analysts and optimizers who work inside your accounts — so your strategists can take on more clients without diluting attention on each one.",
    seo: {
      title: "Performance Marketing Outsourcing for Agencies",
      description:
        "White-label performance marketing execution for agencies: campaign architecture, audience strategy, A/B testing and continuous optimization across paid social and search.",
    },
    pressures: [
      "Optimization cadence slipping as account load grows",
      "Senior strategists doing hands-on campaign builds",
      "Creative and audience testing done ad hoc",
      "Tracking gaps undermining optimization",
      "Reporting consuming analysis time",
    ],
    model: {
      theyOwn: ["Client strategy", "Commercial targets", "Client relationships", "Creative direction"],
      weOwn: ["Campaign architecture", "Audience builds", "A/B testing", "Daily optimization", "Tracking & reporting"],
    },
    engagements: [
      {
        title: "Performance pod",
        body: "A dedicated team of performance specialists aligned to your key accounts, optimizing continuously against agreed KPIs.",
      },
      {
        title: "Account turnaround",
        body: "Historical data analysis, restructuring and a testing roadmap for accounts with rising CPL or CPV.",
      },
      {
        title: "Measurement foundation",
        body: "GA4, GTM and CAPI implementation so optimization rests on reliable signals.",
      },
    ],
    services: ["performance-marketing", "measurement", "reporting"],
    relatedCases: ["middle-east-performance-marketing"],
    faqs: [
      {
        q: "Do you work white-label?",
        a: "Yes. Our specialists can work under your agency brand, reporting through your account leads.",
      },
    ],
  },
  {
    slug: "brands",
    name: "For Brands",
    audience: "Large brands and in-house teams",
    headline: "Operational depth behind your in-house marketing team.",
    intro:
      "Brands bringing media in-house need more than platform access. Trafficomm provides the operational layer — execution, measurement, QA and reporting — so in-house teams can own strategy without building every specialist capability internally.",
    seo: {
      title: "Digital Advertising Operations for Brands",
      description:
        "Operational support for in-house brand marketing teams: campaign execution, GA4 and CAPI measurement, creative QA and executive reporting across major ad platforms.",
    },
    pressures: [
      "In-house teams stretched across many platforms",
      "Specialist skills needed only part of the time",
      "Measurement setups that no one fully owns",
      "Leadership asking for clearer performance reporting",
      "Agencies and in-house teams working from different data",
    ],
    model: {
      theyOwn: ["Brand & marketing strategy", "Budget ownership", "Agency relationships", "Business decisions"],
      weOwn: ["Campaign execution", "Measurement & tracking", "Creative QA", "Optimization support", "Executive reporting"],
    },
    engagements: [
      {
        title: "In-house operations support",
        body: "A dedicated team that executes and monitors campaigns across the platforms your brand runs on.",
      },
      {
        title: "Measurement architecture",
        body: "A documented GA4, GTM and conversion-tracking setup that brand, agency and leadership can all rely on.",
      },
      {
        title: "Executive reporting",
        body: "Consistent reporting that connects media activity to business KPIs.",
      },
    ],
    services: ["performance-marketing", "measurement", "reporting", "ad-operations"],
    relatedCases: ["middle-east-performance-marketing"],
    faqs: [
      {
        q: "Can you work alongside our existing agencies?",
        a: "Yes. Trafficomm can operate alongside agency partners, supporting execution, measurement or reporting without competing for strategy.",
      },
    ],
  },
  {
    slug: "publishers-adtech",
    name: "For Publishers & AdTech",
    audience: "Publishers, ad networks and ad-tech companies",
    headline: "Monetization, ad serving and platform operations — handled.",
    intro:
      "Publishers, ad networks and ad-tech companies use Trafficomm for the operational work behind revenue: inventory frameworks, ad-server integration, trafficking, creative services and automated inventory and billing reporting.",
    seo: {
      title: "Publisher Monetization & AdTech Operations",
      description:
        "Operations for publishers, ad networks and ad-tech companies: ad inventory architecture, Google Ad Manager integration, trafficking, rich media creative and automated billing reporting.",
    },
    pressures: [
      "Digital inventory not structured for monetization",
      "Ad-server integration and migration complexity",
      "Manual inventory, discrepancy and billing reporting",
      "Rising demand for rich media and custom executions",
      "Operational support needed across time zones",
    ],
    model: {
      theyOwn: ["Sales & partnerships", "Product roadmap", "Commercial terms", "Audience strategy"],
      weOwn: [
        "Inventory framework & placements",
        "Ad-server integration",
        "Trafficking & takeovers",
        "Creative services",
        "Inventory & billing reporting",
      ],
    },
    engagements: [
      {
        title: "Monetization build-out",
        body: "Website analysis, ad inventory framework, placement and video preroll strategy, and Google Ad Manager integration.",
      },
      {
        title: "Ad operations for publishers & networks",
        body: "Trafficking, sponsorship and takeover setup, screenshots, discrepancy reporting and delivery optimization.",
      },
      {
        title: "Creative services for networks",
        body: "A dedicated studio producing standard IAB and rich media creatives in Celtra and Bonzai.",
      },
    ],
    services: ["creative-adtech", "ad-operations", "reporting", "programmatic"],
    relatedCases: ["uae-broadcaster-monetization", "rich-media-creative-studio"],
    faqs: [
      {
        q: "Can you help us choose or migrate an ad server?",
        a: "Yes — ad-server recommendation and migration execution are part of our publisher and network support.",
      },
    ],
  },
  {
    slug: "white-label-ad-operations",
    name: "White-Label Ad Operations",
    audience: "Agencies and networks that resell operations",
    headline: "Your brand in front. Our operations team behind it.",
    intro:
      "Trafficomm's white-label model lets agencies and networks offer complete ad operations, performance and reporting capability under their own name — delivered by our team, invisible to your clients.",
    seo: {
      title: "White-Label Ad Operations",
      description:
        "White-label ad operations and performance execution for agencies and networks. Trafficomm delivers setup, QA, optimization and reporting under your brand.",
    },
    pressures: [
      "Clients asking for capabilities you do not staff",
      "Margin pressure on execution-heavy work",
      "Risk of losing scope to specialist competitors",
      "Hiring lead times slowing new business",
    ],
    model: {
      theyOwn: ["Your brand", "Client relationships", "Pricing & contracts", "Account leadership"],
      weOwn: ["Execution under your brand", "Your templates & naming", "QA & SLAs", "Reporting in your format"],
    },
    engagements: [
      {
        title: "Fully white-labeled team",
        body: "Specialists who work in your tools, follow your processes and report in your templates.",
      },
      {
        title: "Capability extension",
        body: "Add programmatic, measurement or rich media capability to your offer without building a new department.",
      },
      {
        title: "Confidential by design",
        body: "We do not publicize client relationships. Confidentiality is standard, not an add-on.",
      },
    ],
    services: ["ad-operations", "performance-marketing", "programmatic", "reporting"],
    relatedCases: ["mena-agency-ad-operations", "rich-media-creative-studio"],
    faqs: [
      {
        q: "Do you compete with our agency for clients?",
        a: "Trafficomm is built to work behind agencies, not against them. Our role is to make your offer stronger — client relationships stay with you.",
      },
    ],
  },
];

export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);

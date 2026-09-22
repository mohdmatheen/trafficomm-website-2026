import { caseMetrics as cm } from "./metrics";
import type { CaseStudy } from "./types";

/**
 * Source: "Trafficomm Case Study" documents supplied by Trafficomm.
 * Only documented results are stated. Where the source describes an
 * improvement without a figure, no figure is given here.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "mena-agency-ad-operations",
    number: "01",
    category: "Enterprise Ad Operations",
    market: "MENA",
    client: "Leading MENA Advertising Agency",
    title: "From 4 Specialists to ~30.",
    cardTitle: "From 4 Specialists to ~30",
    subtitle: "How Trafficomm built a scalable Ad Operations model for a leading MENA advertising agency.",
    seo: {
      title: "Case Study: Scaling Ad Operations for a Leading MENA Agency",
      description:
        "How Trafficomm centralized ad operations for a MENA advertising agency with ~12 offices — 50% lower resource costs, 99.34% work quality and a dedicated team that scaled from 4 to approximately 30 specialists over an engagement spanning 7+ years.",
    },
    headlineStat: { value: cm.menaTeam.value, label: cm.menaTeam.cardLabel },
    scan: { challenge: "Distributed ad operations across ~12 offices, key-person dependency and inconsistent QA.", role: "Centralized ad operations team with account management, task allocation and dedicated QA." },
    metrics: [
      cm.menaCost,
      cm.menaQuality,
      { value: cm.menaTeam.value, label: cm.menaTeam.label },
      { value: cm.menaPartnership.short, label: cm.menaPartnership.label },
    ],
    context:
      "The client is a leading advertising agency with a strong presence across the MENA region, operating from approximately 12 offices. With teams spread across multiple locations — and a reliance on single resources to serve many stakeholders — ad operations had become hard to run efficiently and dependably.",
    challenges: [
      { title: "Productivity", body: "Maintaining consistent productivity across multiple offices and teams." },
      { title: "Resource dependency", body: "Relying on a single resource to manage diverse stakeholders created bottlenecks and delayed executions and deliverables." },
      { title: "Quality consistency", body: "Distributed teams made consistent quality across ad operations processes difficult to assure." },
      { title: "Talent", body: "Finding and retaining the right ad operations talent was a persistent problem." },
    ],
    solution: [
      { title: "Centralized offshore operations", body: "A dedicated offshore team was established in Chennai, India, centralizing ad operations across the agency's regional offices." },
      { title: "Structured team", body: "Dedicated account managers and ad operations specialists, organized to streamline workflow and increase accountability." },
      { title: "Account management & SLAs", body: "Account managers act as the primary point of contact, oversee deliverables and ensure adherence to SLAs." },
      { title: "Structured task allocation", body: "Account managers allocate work across the ad operations team for a centralized, efficient workflow." },
      { title: "Dedicated QA", body: "A dedicated QA team applies rigorous quality assurance to every stage of delivery." },
      { title: "Transparent reporting", body: "Productivity and delivery are reported transparently to the client." },
    ],
    results: [
      { title: "50% reduction in resource costs", body: "Optimized workflow and centralized resources halved resource costs." },
      { title: "99.34% work quality", body: "Rigorous QA delivered consistently high-quality ad operations." },
      { title: "Team scaled from 4 to ~30", body: cm.menaTeam.copy },
      { title: "7+ year engagement", body: "The engagement spanned more than seven years." },
    ],
    conclusion:
      "By centralizing delivery, structuring the workflow and making quality assurance a dedicated function, Trafficomm gave the agency a scalable ad operations model — one that grew alongside the agency over an engagement spanning more than seven years.",
    services: ["ad-operations", "reporting"],
    platforms: [],
  },
  {
    slug: "middle-east-performance-marketing",
    number: "02",
    category: "Performance Marketing",
    market: "Middle East",
    client: "International Advertising Agency",
    title: "Turning Campaign Data Into Performance.",
    cardTitle: "Turning Campaign Data Into Performance",
    subtitle: "How a data-led performance team improved cost efficiency and lead volume for an international agency's key advertiser accounts.",
    seo: {
      title: "Case Study: Data-Led Performance Marketing in the Middle East",
      description:
        "How Trafficomm used historical performance analysis, audience strategy, A/B testing and continuous optimization to improve CPL, CPV and VTR for an international agency — 250+ campaigns managed.",
    },
    headlineStat: cm.perfCampaigns,
    scan: { challenge: "Key advertiser accounts below target, with high CPL and CPV.", role: "Performance team: historical analysis, audience strategy, A/B testing and continuous optimization." },
    metrics: [
      cm.perfCampaigns,
      { value: "CPL ↓", label: "Improved cost per lead" },
      { value: "CPV ↓", label: "Improved cost per view" },
      { value: "VTR ↑", label: "Improved view-through rate" },
    ],
    context:
      "An international advertising agency operating in the Middle East was not achieving the results it needed on key performance-focused advertiser accounts. Despite its internal teams' efforts, results were below target, with high cost per lead (CPL) and cost per view (CPV).",
    challenges: [
      { title: "Suboptimal results", body: "Campaigns were not generating the video views and conversions required, leading to inefficient use of budget." },
      { title: "High CPL and CPV", body: "Ineffective targeting and campaign management pushed up CPL and CPV and weakened ROI." },
    ],
    solution: [
      { title: "Performance team setup", body: "An experienced performance marketing team with expertise in data analysis and campaign optimization." },
      { title: "Historical & audience analysis", body: "Historical account data analyzed to identify gaps, audience segments, demographics and behavior patterns." },
      { title: "Campaign strategy", body: "A strategic plan focused on maximizing conversion rates and ROI." },
      { title: "Multichannel execution", body: "Targeted campaigns across social media and performance platforms, with precise audience targeting." },
      { title: "A/B testing", body: "Structured testing of creatives and audiences throughout." },
      { title: "Continuous optimization", body: "Ongoing monitoring and optimization to maximize results and reduce costs." },
    ],
    results: [
      { title: "Improved CPL and CPV efficiency", body: "Refined targeting and strategy reduced CPL and CPV, saving budget." },
      { title: "Increased leads", body: "Higher lead volume at a lower cost per lead." },
      { title: "Improved video performance", body: "Strategic placements and creatives maximized video views across platforms." },
      { title: "Improved VTR", body: "Strong view-through rates indicated sustained viewer engagement." },
      { title: "Improved ROI", body: "Higher conversion rates and optimized campaigns increased return on investment." },
      { title: "250+ campaigns managed", body: "More than 250 campaigns managed to date." },
    ],
    conclusion:
      "Meticulous analysis, clear strategy and continuous optimization turned underperforming accounts into efficient lead and video programs — and a relationship that has run to more than 250 campaigns.",
    services: ["performance-marketing", "reporting"],
    platforms: [],
  },
  {
    slug: "rich-media-creative-studio",
    number: "03",
    category: "Creative Technology",
    market: "Middle East",
    client: "International Ad Network",
    title: "300+ Rich Media Experiences.",
    cardTitle: "300+ Rich Media Experiences",
    subtitle: "How a dedicated creative technology team helped an international ad network meet advertiser demand for high-end mobile rich media.",
    seo: {
      title: "Case Study: 300+ Rich Media Mobile Creatives for an Ad Network",
      description:
        "How Trafficomm built a dedicated creative team — creative director, designers and developers — producing 300+ high-end rich media mobile creatives in Celtra and Bonzai for an international ad network.",
    },
    headlineStat: cm.richMedia,
    scan: { challenge: "Rising advertiser demand for mobile rich media, without in-house specialists.", role: "Dedicated creative technology team producing in Celtra and Bonzai." },
    metrics: [
      { value: "300+", label: "Rich media mobile creatives" },
      { value: "2", label: "Rich media platforms: Celtra & Bonzai" },
      { value: "3", label: "Disciplines: direction, design, development" },
    ],
    context:
      "An international ad network in the Middle East needed to meet advertisers' growing demand for immersive, interactive mobile advertising — but lacked the specialist talent to conceptualize and develop high-end rich media creatives in-house.",
    challenges: [
      { title: "Limited in-house expertise", body: "No specialist capability to conceptualize and build high-end rich media mobile creatives internally." },
      { title: "Rising demand", body: "Advertisers increasingly expected immersive, interactive mobile experiences." },
      { title: "Competitive pressure", body: "Staying ahead of creative trends was essential to attract and retain advertisers." },
    ],
    solution: [
      { title: "Specialized creative team", body: "A dedicated team of a creative director, designers and developers experienced in rich media mobile creative." },
      { title: "Platform expertise", body: "Production in Celtra and Bonzai for immersive, interactive mobile formats." },
      { title: "Concept to delivery", body: "Creatives conceptualized and developed to each advertiser's requirements." },
      { title: "Collaborative process", body: "Close alignment with brand objectives, audiences and industry best practice." },
      { title: "Scalable capacity", body: "Flexible capacity that let the network onboard multiple brands." },
    ],
    results: [
      { title: "300+ high-end creatives", body: "More than 300 rich media mobile creatives conceptualized and developed." },
      { title: "Stronger creative offering", body: "Innovative mobile experiences elevated the network's proposition to advertisers." },
      { title: "More business opportunities", body: "The creative work supported the onboarding of multiple brands." },
      { title: "Streamlined operations", body: "The network accessed specialist expertise while focusing on its core business." },
    ],
    conclusion:
      "A dedicated creative technology team gave the network a capability it could sell — without building a studio — and delivered more than 300 rich media experiences.",
    services: ["creative-adtech"],
    platforms: [],
  },
  {
    slug: "uae-broadcaster-monetization",
    number: "04",
    category: "Publisher Monetization",
    market: "UAE",
    client: "UAE Broadcast Group",
    title: "Turning Digital Inventory Into Revenue.",
    cardTitle: "Turning Digital Inventory Into Revenue",
    subtitle: "How Trafficomm designed and operated an advertising framework that monetized a UAE television broadcaster's website.",
    seo: {
      title: "Case Study: Website Monetization for a UAE Broadcaster",
      description:
        "How Trafficomm built an ad inventory framework, integrated Google Ad Manager, ran 50+ campaigns and automated inventory and billing reporting for a UAE television broadcaster.",
    },
    headlineStat: cm.broadcasterCampaigns,
    scan: { challenge: "Website inventory with no structured monetization approach.", role: "Inventory framework, Google Ad Manager integration, campaign management and automated reporting." },
    metrics: [
      cm.broadcasterCampaigns,
      { value: "GAM", label: "Google Ad Manager integration" },
      { value: "Auto", label: "Inventory, billing & campaign reporting" },
    ],
    context:
      "A prominent television broadcaster in the UAE, operating multiple channels, saw an opportunity to complement broadcasting with digital revenue — but lacked a structured approach to monetizing its website.",
    challenges: [
      { title: "Monetization strategy", body: "No structured approach to monetization, leaving advertising inventory underused." },
      { title: "Advertising integration", body: "Integrating ad solutions into the website's architecture required ad operations and platform expertise." },
      { title: "Performance tracking", body: "Manual tracking of inventory, billing and campaign performance slowed decisions." },
    ],
    solution: [
      { title: "Website analysis", body: "Analysis of site structure, design and content to identify placement opportunities." },
      { title: "Advertising inventory framework", body: "A structured framework for ad slots and placements that protects the user experience." },
      { title: "Video preroll strategy", body: "Preroll placements for video content to capture additional revenue." },
      { title: "Google Ad Manager integration", body: "Website integrated with Google Ad Manager for ad serving, targeting and optimization." },
      { title: "Campaign management", body: "50+ advertising campaigns launched and managed through Google Ad Manager." },
      { title: "Automated reporting", body: "Automated inventory, billing and campaign reporting." },
    ],
    results: [
      { title: "Advertising revenue generation", body: "The website was successfully monetized through targeted placements." },
      { title: "User experience maintained", body: "Placement strategy kept advertising from compromising the viewer experience." },
      { title: "Operational efficiency", body: "Automated reporting saved time managing inventory, billing and performance." },
      { title: "Scalable infrastructure", body: "An ad stack designed to accommodate future growth." },
    ],
    conclusion:
      "Trafficomm turned an underused digital property into a revenue channel — with the inventory structure, ad serving and reporting to keep scaling it.",
    services: ["creative-adtech", "ad-operations", "reporting"],
    platforms: [],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

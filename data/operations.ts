/** Operating workflow used on the homepage engine and How We Work. */
export const engineStages = [
  { key: "plan", label: "Plan", summary: "Approved plans and requirements become an executable, platform-ready brief.", functions: ["Media Plan", "Campaign Requirements", "Platform Structure"] },
  { key: "build", label: "Build", summary: "Campaigns are structured, trafficked and implemented across platforms and ad servers.", functions: ["Campaign Setup", "Trafficking", "Tags", "Creative Implementation"] },
  { key: "qa", label: "QA", summary: "An independent QA layer checks every build, creative, tag and booking before go-live.", functions: ["Creative Audit", "Campaign QA", "Tracking Validation", "Booking / Order QA"] },
  { key: "launch", label: "Launch", summary: "Go-live is executed and verified across platforms and publishers.", functions: ["Platform Execution", "Publisher Coordination", "Campaign Activation"] },
  { key: "optimize", label: "Optimize", summary: "Delivery is managed in flight — not only at the weekly report.", functions: ["Pacing", "Budget", "Audience", "Creative", "KPI Monitoring"] },
  { key: "measure", label: "Measure", summary: "Tracking and conversions are validated so decisions rest on checked data.", functions: ["Tracking", "Performance", "Conversions", "Analytics"] },
  { key: "report", label: "Report", summary: "Reporting that explains what happened and what to do next.", functions: ["Dashboards", "Insights", "Weekly / Monthly Reporting", "Recommendations"] },
] as const;

export const aiPipeline = [
  { label: "Campaign data", kind: "input", body: "Platform, ad server and analytics data collected across accounts." },
  { label: "Automated QA", kind: "machine", body: "Rule-based checks flag setup, naming and tracking inconsistencies." },
  { label: "Anomaly detection", kind: "machine", body: "Pacing, spend and KPI deviations surfaced early." },
  { label: "AI-assisted analysis", kind: "machine", body: "Patterns summarized to speed up diagnosis." },
  { label: "Trafficomm analyst", kind: "human", body: "An experienced operator validates findings and decides what to change." },
  { label: "Optimization", kind: "human", body: "Changes are made deliberately, in line with client strategy and KPIs." },
  { label: "Insight", kind: "output", body: "Clear, actionable commentary for your team and your clients." },
] as const;

/** Phased transition model, from the Trafficomm services deck. */
export const transitionPhases = [
  { code: "KAP", label: "Knowledge acquisition", body: "Our team member learns every business area of the account — processes, tools, naming, templates and stakeholders." },
  { code: "SEC", label: "Secondary shadow", body: "The team monitors and learns the business process from your in-house ad operations member." },
  { code: "PRI", label: "Primary shadow", body: "The team works on live campaigns while your in-house member oversees the work." },
  { code: "SS", label: "Steady state", body: "Trafficomm takes over the process for that account completely, under agreed SLAs." },
] as const;

/** Offshore ad operations process flows, from the Trafficomm services deck. */
export const processFlows = [
  {
    key: "agency",
    label: "Ad agency workflow",
    intro: "How a new campaign moves from an approved media plan to reporting when Trafficomm runs ad operations for an agency.",
    steps: [
      { actor: "Agency", title: "Approved media plan", body: "Planning / buying issues the approved plan; the agency coordinator sends the initial email for new campaigns." },
      { actor: "Trafficomm", title: "Operations contact", body: "A named operations contact receives the request and opens a ticket." },
      { actor: "Trafficomm", title: "Spec sheet & creative audit", body: "Spec sheets are shared with the creative agency; creatives are audited and returned for amendments where needed." },
      { actor: "Trafficomm", title: "Campaign setup", body: "The campaign is set up and trafficked in the ad server." },
      { actor: "Publisher", title: "Booking order & tags", body: "Booking orders and tags are sent to publishers." },
      { actor: "Trafficomm", title: "Screenshots", body: "Live screenshots confirm delivery." },
      { actor: "Trafficomm", title: "Reporting & optimization", body: "Campaigns are monitored, optimized and reported." },
      { actor: "Agency", title: "Billing", body: "Delivery data supports the agency billing team." },
    ],
  },
  {
    key: "programmatic",
    label: "Programmatic workflow",
    intro: "How Trafficomm supports a trader or trading desk from approved plan to reporting in DV360.",
    steps: [
      { actor: "Agency", title: "Plan, BO & materials", body: "The trader or trading desk shares the approved media plan, booking order and materials." },
      { actor: "Trafficomm", title: "Operations contact", body: "Requests are received and tracked by the operations contact." },
      { actor: "Trafficomm", title: "Plan structure (DV360)", body: "Insertion orders and line items are structured and sent for approval." },
      { actor: "Trafficomm", title: "Campaign setup", body: "After approval, the campaign is set up." },
      { actor: "Trafficomm", title: "Creative approval status", body: "Creative approvals are tracked; creative or tag issues are troubleshot with the agency team." },
      { actor: "Trafficomm", title: "PMP deal troubleshooting", body: "Private marketplace deals are checked and fixed so they transact." },
      { actor: "Trafficomm", title: "Screenshots", body: "Delivery is verified." },
      { actor: "Trafficomm", title: "Reporting & optimization", body: "Completed requests are updated in the CRM tool; reporting and optimization continue in flight." },
    ],
  },
] as const;

/** Indicative transition plan for one business area (Wave 1 · Account structure), from the services deck. */
export const indicativeTransition = [
  { code: "KAP", days: 1 },
  { code: "Secondary", days: 2 },
  { code: "Primary", days: 3 },
  { code: "Steady state", days: 4 },
] as const;

/**
 * Additional depth for the five services rendered by ServiceTemplate (Ad
 * Operations has its own full page). Each entry answers the buyer questions
 * the standard template leaves open: what problem it solves, how the work is
 * structured, who owns what, and where the evidence is.
 *
 * Content follows the Trafficomm services deck, the service definitions in
 * services.ts and the anonymized case studies. No outcomes, percentages,
 * SLAs or turnaround times are stated that are not documented.
 */

export type ChainStage = {
  label: string;
  items: string[];
  /** Official platform mark shown beside the stage label. */
  platform?: string;
  /** Visual emphasis: who performs the stage. Default: Trafficomm. */
  owner?: "client" | "trafficomm" | "output";
};

export type ServiceSystem =
  | {
      kind: "optimization";
      eyebrow: string;
      title: [string, string];
      lead: string;
      levers: { label: string; body: string }[];
      kpis: string[];
      loop: { label: string; body: string }[];
      note: string;
    }
  | {
      kind: "chain";
      eyebrow: string;
      title: [string, string];
      lead: string;
      stages: ChainStage[];
      /** Visual storytelling prototype: replaces the static chain with an animated signal pipeline. */
      visual?: "signal-journey" | "reporting-pipeline" | "delivery-architecture";
      /** Optional supporting disciplines shown under the chain. */
      disciplines?: { title: [string, string]; items: { label: string; body: string }[] };
      /** Optional "what this can and cannot do" note. */
      limits?: { title: string; body: string };
      /** Optional question-led distinction (e.g. reporting vs analysis vs insight). */
      distinction?: { title: [string, string]; items: { label: string; question: string; body: string }[] };
    }
  | {
      kind: "split";
      eyebrow: string;
      title: [string, string];
      lead: string;
      sides: { code: string; label: string; summary: string }[];
    };

export type ServiceDepth = {
  problem: { title: [string, string]; lead: string; points: string[] };
  system: ServiceSystem;
  /** "absorbed": the Capabilities grid is folded into the system section as a compact scope table. */
  capabilities?: "absorbed";
  /** Replaces the generic module illustration in the hero with a subject-specific board. */
  heroVisual?: "signal-board" | "format-board";
  /** Adds the creative format explorer section (Creative & AdTech only). */
  formatExplorer?: true;
  /** "compact": ownership and outcomes render as one operating-model band instead of two sections. */
  lowerPage?: "compact";
  /** Domain-specific heading for the step-by-step workflow; omitted when the system section already shows the flow. */
  workflowTitle?: [string, string];
  /** "strip": one compact row of steps instead of cards (used where a visual already carries the process). */
  workflowStyle?: "strip";
  ownership: { frame: string; clientLabel: string; clientOwns: string[]; trafficommSupports: string[]; note: string };
  /** Recurring reporting cadence (Reporting & Insights). */
  cadences?: { label: string; items: string[] }[];
  /** Documented case-study proof, shown only where a case study records it. */
  proof?: { value: string; label: string; context: string; slug: string }[];
  links: { href: string; label: string; meta?: string }[];
  cta: { title: string; body: string };
};

export const serviceDepth: Record<string, ServiceDepth> = {
  "performance-marketing": {
    problem: {
      title: ["Spend Scales Faster", "Than Optimization Time."],
      lead: "As accounts, channels and creatives multiply, optimization slides toward the weekly report. Tests run ad hoc, budgets stay where they were set, and cost per result drifts before anyone has time to look.",
      points: [
        "Optimization cadence slipping as account load grows",
        "Senior strategists doing hands-on campaign builds",
        "Creative and audience testing run ad hoc",
        "Budget allocation reviewed too rarely",
        "Tracking gaps undermining optimization decisions",
      ],
    },
    system: {
      kind: "optimization",
      eyebrow: "Optimization system",
      title: ["Every Change Starts", "With the Evidence."],
      lead: "Trafficomm examines audience, creative, channel, budget, campaign structure and conversion performance against the KPIs your client is judged on — then tests, reallocates and scales what the evidence supports.",
      levers: [
        { label: "Audience", body: "Segments, demographics and behaviour patterns" },
        { label: "Creative", body: "Formats, variants and messages" },
        { label: "Placement / channel", body: "Platform and placement mix" },
        { label: "Budget", body: "Allocation across campaigns and channels" },
        { label: "Campaign structure", body: "Architecture, naming and consolidation" },
        { label: "Conversion performance", body: "Tracked outcomes and signal quality" },
      ],
      kpis: ["CPL", "CPA", "CPV", "VTR", "ROAS"],
      loop: [
        { label: "Historical data", body: "Account history, audiences and tracking reviewed first." },
        { label: "Hypothesis", body: "A specific, testable change with a success metric." },
        { label: "Test", body: "Structured A/B tests on creative, audience or placement." },
        { label: "Measure", body: "Results read against the agreed KPI." },
        { label: "Reallocate", body: "Budget moves toward what is working." },
        { label: "Learn", body: "Learnings documented for the next flight." },
        { label: "Scale", body: "Proven structures and creatives scaled deliberately." },
      ],
      note: "No result is promised in advance. Outcomes are reported only where a case study documents them.",
    },
    capabilities: "absorbed",
    heroVisual: "signal-board",
    lowerPage: "compact",
    ownership: {
      frame: "Your performance team, extended",
      clientLabel: "Agency / brand owns",
      clientOwns: ["Client strategy", "Commercial targets", "Client relationships", "Creative direction"],
      trafficommSupports: ["Campaign architecture", "Audience builds", "A/B testing", "Daily optimization", "Budget reallocation", "Tracking & reporting"],
      note: "Trafficomm can also contribute to strategy using historical performance analysis. Decisions on targets and client commitments stay with you.",
    },
    proof: [{ value: "250+", label: "Campaigns managed", context: "International agency · Middle East", slug: "middle-east-performance-marketing" }],
    links: [
      { href: "/solutions/performance-agencies", label: "For performance agencies", meta: "Operating model" },
      { href: "/services/measurement", label: "Measurement & Analytics", meta: "GA4 · GTM · CAPI" },
      { href: "/platforms/meta", label: "Meta operations", meta: "Platform" },
      { href: "/platforms/google-ads", label: "Google Ads operations", meta: "Platform" },
      { href: "/how-we-work", label: "How we work", meta: "Team & QA" },
    ],
    cta: { title: "Where is optimization time being lost?", body: "Tell us about your accounts, channels and KPIs. We'll look at where a performance operations team would add testing and optimization capacity." },
  },

  programmatic: {
    problem: {
      title: ["Traders Should Trade.", "Not Traffic."],
      lead: "Plan structures, trafficking, creative approvals and deal troubleshooting take hours that trading teams would rather spend on inventory and performance. When those tasks queue, delivery waits with them.",
      points: [
        "Line-item builds queued behind trading work",
        "Creative approval issues discovered late",
        "PMP deals not transacting as expected",
        "Inconsistent naming complicating optimization and reporting",
      ],
    },
    system: {
      kind: "chain",
      eyebrow: "Programmatic architecture",
      title: ["How the Programmatic", "Operation Moves."],
      visual: "delivery-architecture",
      lead: "From approved media plan to operational reporting — structured in DV360, trafficked in CM360, checked before launch and monitored in flight.",
      stages: [
        { label: "Media plan", items: ["Approved plan", "Booking order", "Materials"], owner: "client" },
        { label: "DV360", items: ["Campaign", "Insertion orders", "Line items"], platform: "dv360" },
        { label: "CM360", items: ["Placements", "Creatives", "Tracking"], platform: "cm360" },
        { label: "Approval", items: ["Creative approval status", "Issues escalated"] },
        { label: "PMP / deals", items: ["Deal checks", "Troubleshooting"] },
        { label: "Delivery", items: ["Pacing", "Delivery monitoring"] },
        { label: "Optimization", items: ["Adjustments per the trader's plan"] },
        { label: "Reporting", items: ["Operational reporting", "Requests logged in your CRM or task tool"], owner: "output" },
      ],
    },
    capabilities: "absorbed",
    lowerPage: "compact",
    ownership: {
      frame: "Your trading desk, extended",
      clientLabel: "Trading team owns",
      clientOwns: ["Strategy", "Inventory decisions", "Buying decisions"],
      trafficommSupports: ["Structure", "Setup", "Trafficking", "Creative approvals", "PMP troubleshooting", "Monitoring", "Operational reporting"],
      note: "Strategy, inventory and buying decisions stay with your traders. Trafficomm executes and supports the operation — it does not make trading decisions.",
    },
    links: [
      { href: "/platforms/dv360", label: "DV360 operations", meta: "Platform" },
      { href: "/platforms/cm360", label: "CM360 operations", meta: "Platform" },
      { href: "/services/ad-operations", label: "Ad Operations", meta: "Setup · QA · Reporting" },
      { href: "/solutions/media-agencies", label: "For media agencies", meta: "Operating model" },
      { href: "/how-we-work", label: "How we work", meta: "Team & QA" },
    ],
    cta: { title: "Is programmatic execution slowing your desk down?", body: "Tell us about your DV360 and CM360 volume and where requests queue. We'll look at where Trafficomm could take on structure, trafficking and troubleshooting." },
  },

  measurement: {
    problem: {
      title: ["When Tracking Breaks,", "Decisions Break Quietly."],
      lead: "Undocumented tags, duplicated events and conversions nobody owns produce numbers that look fine until two systems disagree. Media teams then optimize toward signals they cannot verify.",
      points: [
        "Events defined differently across platforms",
        "Tags added over time with no documentation",
        "Analytics and ad-platform conversions that don't reconcile",
        "No clear owner for the measurement setup",
      ],
    },
    system: {
      kind: "chain",
      eyebrow: "Measurement chain",
      title: ["From User Action", "to Validated Signal."],
      visual: "signal-journey",
      lead: "Follow one event through the stack. Every link is defined, implemented, tested and documented.",
      stages: [
        { label: "User action", items: ["Conversion", "Key event"], owner: "client" },
        { label: "Data layer / event", items: ["Event name", "Parameters"] },
        { label: "GTM", items: ["Tags", "Triggers", "Variables"] },
        { label: "GA4 / platform signal", items: ["GA4", "Meta CAPI", "Platform events"] },
        { label: "Conversion", items: ["Conversion definitions"] },
        { label: "Validation", items: ["Testing", "Reconciliation"] },
        { label: "Reporting / optimization", items: ["Reports", "Platform optimization signals"], owner: "output" },
      ],
      limits: {
        title: "What good measurement can — and can't — do",
        body: "No setup delivers perfect attribution or complete tracking. Consent choices, browser restrictions and platform methodologies all leave gaps, and different systems count the same activity differently. Server-side signals such as Meta Conversions API complement browser-side tracking; they do not restore every lost signal. The aim is a setup that is accurate where it can be, explained where it can't, and documented throughout.",
      },
    },
    workflowTitle: ["How a measurement", "engagement runs."],
    workflowStyle: "strip",
    ownership: {
      frame: "Your analytics and media teams, supported",
      clientLabel: "Your team owns",
      clientOwns: ["Business definitions", "Consent & privacy decisions", "Platform access", "Final KPI interpretation"],
      trafficommSupports: ["Measurement plan", "GTM configuration", "GA4 setup", "CAPI integration", "Validation", "Documentation"],
      note: "Trafficomm implements and validates the tracking layer; your team keeps the business definitions and the final read.",
    },
    links: [
      { href: "/platforms/meta", label: "Meta operations", meta: "Conversions API" },
      { href: "/platforms/google-ads", label: "Google Ads operations", meta: "Conversion tracking" },
      { href: "/services/reporting", label: "Reporting & Insights", meta: "Daily to executive" },
      { href: "/services/performance-marketing", label: "Performance Marketing", meta: "Optimization" },
      { href: "/how-we-work", label: "How we work", meta: "Team & QA" },
    ],
    cta: { title: "Can you trace your numbers back to the action?", body: "Tell us which platforms and analytics tools you run. We'll look at where your measurement setup needs definition, validation or documentation." },
  },

  reporting: {
    problem: {
      title: ["Reports Shouldn't Take", "Longer Than the Decision."],
      lead: "Hours go into exports and reconciling platforms that disagree — and the report still arrives without the 'so what'.",
      points: [
        "Manual exports from several platforms",
        "Discrepancies found after the report is sent",
        "Reports that describe results but don't explain them",
        "Leadership asking for a clearer view of performance",
      ],
    },
    system: {
      kind: "chain",
      eyebrow: "Reporting pipeline",
      title: ["From Platform Data", "to Client Decision."],
      visual: "reporting-pipeline",
      lead: "Validated before it is aggregated, analyzed before it is shared, delivered with a recommendation.",
      stages: [
        { label: "Raw platform data", items: ["Ad platforms", "Ad servers", "Analytics"], owner: "client" },
        { label: "Validation", items: ["Totals", "Discrepancies"] },
        { label: "Normalization / aggregation", items: ["Consistent naming", "Consolidation"] },
        { label: "KPI analysis", items: ["Against targets", "Trends"] },
        { label: "Commentary", items: ["What moved", "Why it moved"] },
        { label: "Recommendation", items: ["Next actions", "Priorities"] },
        { label: "Client / leadership output", items: ["Your template", "Your brand"], owner: "output" },
      ],
      distinction: {
        title: ["Reporting, Analysis", "and Insight Are Different Jobs."],
        items: [
          { label: "Reporting", question: "What happened?", body: "Delivery, spend and results against plan — accurate, reconciled and on time." },
          { label: "Analysis", question: "Why did it happen?", body: "The drivers behind the numbers: audiences, creatives, placements and pacing." },
          { label: "Insight", question: "What should we do next?", body: "A specific recommendation your team can act on or take to the client." },
        ],
      },
    },
    cadences: [
      { label: "Daily", items: ["Delivery", "Spend", "Pacing", "Issues"] },
      { label: "Weekly", items: ["Performance", "Trends", "Optimization", "Exceptions"] },
      { label: "Monthly", items: ["KPI performance", "Campaign analysis", "Insights", "Recommendations"] },
      { label: "End of campaign", items: ["Results", "Learnings", "Performance summary", "Future recommendations"] },
    ],
    ownership: {
      frame: "Your account team, extended",
      clientLabel: "Your team owns",
      clientOwns: ["Client relationship", "KPI definitions & targets", "Client presentation"],
      trafficommSupports: ["Data collection", "Validation", "Aggregation", "Analysis", "Commentary", "Report production"],
      note: "Reports can go to your team, or to your clients under your brand.",
    },
    links: [
      { href: "/services/measurement", label: "Measurement & Analytics", meta: "Data you can trust" },
      { href: "/services/ad-operations", label: "Ad Operations", meta: "Setup · QA · Reporting" },
      { href: "/solutions/brands", label: "For brands", meta: "Executive reporting" },
      { href: "/solutions/white-label-ad-operations", label: "White-label reporting", meta: "Your brand" },
      { href: "/how-we-work", label: "How we work", meta: "Team & QA" },
    ],
    cta: { title: "How long does your reporting take?", body: "Tell us which platforms, cadences and templates you report on. We'll look at where Trafficomm could take on collection, validation and analysis." },
  },

  "creative-adtech": {
    problem: {
      title: ["Creative Ambition Meets", "Ad-Server Reality."],
      lead: "Rich media and custom executions need specialist production skills, and every creative still has to pass publisher specs, tag checks and ad-server setup. For publishers, the same technical depth decides whether inventory earns.",
      points: [
        "Specialist rich media skills needed only part of the time",
        "Creatives rejected late for specs, file weight or tags",
        "Ad-server integration and inventory structure complexity",
        "Manual inventory and billing reporting",
      ],
    },
    system: {
      kind: "split",
      eyebrow: "Two connected capabilities",
      title: ["Creative Technology.", "Publisher Operations."],
      lead: "Creative technology produces ad-ready executions. Publisher and ad-tech operations make sure inventory, ad serving and reporting are built to carry them. The same team understands both sides of the tag.",
      sides: [
        { code: "A", label: "Creative technology", summary: "A creative director, designers and developers who specialize in advertising formats." },
        { code: "B", label: "Publisher / AdTech operations", summary: "Inventory frameworks, ad serving and reporting for publishers, networks and ad-tech companies." },
      ],
    },
    capabilities: "absorbed",
    heroVisual: "format-board",
    formatExplorer: true,
    lowerPage: "compact",
    ownership: {
      frame: "Your creative and publishing teams, extended",
      clientLabel: "You own",
      clientOwns: ["Brand & creative direction", "Sales & partnerships", "Commercial terms"],
      trafficommSupports: ["Creative production", "Creative QA", "Tag setup", "Ad-server integration", "Inventory structure", "Reporting"],
      note: "Creative direction and commercial decisions stay with you. Trafficomm produces, checks and integrates.",
    },
    proof: [
      { value: "300+", label: "Rich media creatives", context: "International ad network", slug: "rich-media-creative-studio" },
      { value: "50+", label: "Campaigns managed", context: "UAE broadcast group", slug: "uae-broadcaster-monetization" },
    ],
    links: [
      { href: "/solutions/publishers-adtech", label: "For publishers & ad tech", meta: "Operating model" },
      { href: "/services/ad-operations", label: "Ad Operations", meta: "Trafficking · QA" },
      { href: "/platforms/cm360", label: "CM360 operations", meta: "Ad serving" },
      { href: "/how-we-work", label: "How we work", meta: "Team & QA" },
    ],
    cta: { title: "Need rich media or ad-serving depth on demand?", body: "Tell us about your formats, ad server and inventory. We'll look at where Trafficomm could add creative technology or publisher operations capacity." },
  },
};

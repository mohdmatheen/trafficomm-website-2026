export type Stat = {
  /** Numeric target for animated counters. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Rendered verbatim when counting is not meaningful (e.g. a year). */
  display?: string;
  label: string;
  detail?: string;
};

export type CapabilityGroup = {
  title: string;
  items: string[];
};

export type FAQ = { q: string; a: string };

export type Service = {
  slug: string;
  code: string;
  /** Buyer-facing scope, e.g. "DV360 · CM360 · Programmatic execution". Used instead of internal codes in UI. */
  scopeLine: string[];
  name: string;
  short: string;
  headline: string;
  intro: string;
  summary: string;
  seo: { title: string; description: string };
  functions: string[];
  groups: CapabilityGroup[];
  outcomes: { title: string; body: string }[];
  workflow: { step: string; body: string }[];
  platforms: string[];
  relatedCases: string[];
  faqs: FAQ[];
  viz: "pacing" | "funnel" | "lineitems" | "tags" | "report" | "creative";
  /** Homepage capability explorer: operational flow and headline capabilities. */
  explorer: { flow: { label: string; details: string[] }[]; capabilities: string[] };
};

export type Solution = {
  slug: string;
  name: string;
  audience: string;
  headline: string;
  intro: string;
  seo: { title: string; description: string };
  pressures: string[];
  model: { theyOwn: string[]; weOwn: string[] };
  engagements: { title: string; body: string }[];
  services: string[];
  relatedCases: string[];
  faqs: FAQ[];
  /** How work moves once Trafficomm is in place, step by step, with who performs each step. */
  workflow: { title: [string, string]; lead: string; steps: { label: string; items: string[]; owner: "client" | "trafficomm" | "output" }[] };
  /** Contextual links (services, platforms, sibling models) — kept short to avoid link spam. */
  links: { href: string; label: string; meta?: string }[];
  cta: { title: string; body: string };
};

export type Platform = {
  slug: string;
  name: string;
  short: string;
  category: "Social" | "Search" | "Programmatic" | "Ad Serving" | "Retail Media" | "Professional";
  headline: string;
  intro: string;
  seo: { title: string; description: string };
  capabilities: string[];
  operations: { title: string; body: string }[];
  services: string[];
  /** Official product name when it differs from the UI shorthand (e.g. "Display & Video 360"). */
  officialName?: string;
  /** Homepage ecosystem: what Trafficomm operates on this platform. */
  ecosystem: string[];
};

export type CaseStudy = {
  slug: string;
  number: string;
  category: string;
  market: string;
  client: string;
  title: string;
  cardTitle: string;
  subtitle: string;
  seo: { title: string; description: string };
  headlineStat: { value: string; label: string };
  /** One-line scan summaries for case-study cards. */
  scan: { challenge: string; role: string };
  metrics: { value: string; label: string }[];
  context: string;
  challenges: { title: string; body: string }[];
  solution: { title: string; body: string }[];
  results: { title: string; body: string }[];
  conclusion: string;
  services: string[];
  platforms: string[];
};

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title: string; text: string }
  | {
      type: "chart";
      kind: "bar" | "compare";
      title: string;
      caption: string;
      series: { label: string; value: number; display?: string; highlight?: boolean }[];
      unit?: string;
    }
  | { type: "table"; caption: string; head: string[]; rows: string[][] };

export type ArticleCategory = "Industry Insight" | "Report" | "Benchmark" | "Guide" | "Case Study" | "Research";

export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: ArticleCategory;
  author: { name: string; role: string };
  publishedAt: string;
  updatedAt?: string;
  hero: { kicker: string; motif: "grid" | "bars" | "flow" };
  tags: string[];
  body: ArticleBlock[];
  related: string[];
  /** Services and solutions this article informs — rendered as contextual links. */
  links: { href: string; label: string; meta?: string }[];
};

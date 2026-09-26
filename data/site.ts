/**
 * Single source of truth for company facts.
 * Every number here is a verified proof point supplied by Trafficomm.
 * Do not add statistics that are not documented.
 */
export const company = {
  name: "Trafficomm",
  legalName: "Trafficomm Digital Media Services Pvt Ltd",
  founded: 2015,
  tagline: "Performance Operations. Built for Execution.",
  positioning: "The performance operations layer behind modern media teams.",
  /**
   * Header descriptor under the wordmark. Three words, because it has to sit
   * subordinate to the mark at every width. It says what Trafficomm is — an
   * operations partner — rather than repeating the campaign tagline above the
   * homepage headline that already carries it.
   */
  headerDescriptor: "Performance Operations Partner",
  description:
    "Trafficomm is a digital advertising operations and performance operations company. Since 2015 we have worked behind agencies, ad-tech companies, publishers and brands to execute, optimize, measure and report digital advertising campaigns.",
  /**
   * Contact details are intentionally null until confirmed by Trafficomm.
   * Components omit anything that is null rather than showing invented data.
   */
  email: null as string | null,
  phone: null as string | null,
  linkedin: null as string | null,
  /** Optional booking link (e.g. Calendly). When null, "Schedule a call" routes through the form. */
  bookingUrl: null as string | null,
};

/**
 * Brand film for the homepage "60 seconds" section. Set `src` (MP4/WebM URL)
 * and optionally `poster` when the film is ready; until then the component
 * shows a designed placeholder state.
 */
export const brandFilm = {
  src: null as string | null,
  poster: null as string | null,
  title: "60 Seconds with Trafficomm",
  durationLabel: "01:00",
};

/**
 * The production domain. Every canonical, Open Graph URL, sitemap entry and
 * schema @id is built from this.
 *
 * It is a constant rather than an environment variable because it was one before,
 * and the variable was never set in Vercel: production shipped canonicals,
 * og:url, robots.txt Host and all 37 sitemap URLs pointing at
 * trafficomm-website-2026.vercel.app, which would have handed the brand's search
 * equity to the deployment alias. A domain this stable should not be able to go
 * missing. NEXT_PUBLIC_SITE_URL still overrides it if the domain ever changes.
 */
export const PRODUCTION_ORIGIN = "https://www.trafficomm.com";

/**
 * Canonical origin for a given environment. Explicit NEXT_PUBLIC_SITE_URL wins.
 * The indexable production deployment is the real domain; a preview uses its own
 * URL, so it can never emit a production canonical, and never a localhost one.
 *
 * Pure and exported so the resolution is covered by tests: the previous version
 * silently resolved to the Vercel alias in production, and nothing caught it.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  const previewHost = env.VERCEL_BRANCH_URL ?? env.VERCEL_URL;
  const fallback =
    env.SITE_INDEXABLE === "true" ? PRODUCTION_ORIGIN : previewHost ? `https://${previewHost}` : "http://localhost:3000";
  return (env.NEXT_PUBLIC_SITE_URL || fallback).replace(/\/$/, "");
}

export const siteUrl = resolveSiteUrl(process.env);

/** Company-wide scale figures now live in data/metrics.ts (single source of truth). */
export { scaleStats } from "./metrics";

export const markets = [
  { code: "sa", name: "Saudi Arabia" },
  { code: "ae", name: "UAE" },
  { code: "qa", name: "Qatar" },
  { code: "kw", name: "Kuwait" },
  { code: "lb", name: "Lebanon" },
  { code: "au", name: "Australia" },
] as const;

/** Case studies and case-study references only. */
export const confidentialityNote =
  "Client identity withheld in accordance with confidentiality obligations.";

/** Contact / enquiry context. */
export const enquiryConfidentialityNote = "Your enquiry and operational information are treated confidentially.";

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; intro: string; links: NavLink[]; feature?: NavLink; also?: { label: string; items: string[] } };

export const primaryNav: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    intro: "Six specialized capabilities, one operating team.",
    links: [
      { label: "Ad Operations", href: "/services/ad-operations", description: "Trafficking, QA, pacing and reporting" },
      { label: "Performance Marketing", href: "/services/performance-marketing", description: "Paid social and search built for CPL, CPA, ROAS" },
      { label: "Programmatic Operations", href: "/services/programmatic", description: "DV360 and CM360 execution" },
      { label: "Measurement & Analytics", href: "/services/measurement", description: "GA4, GTM, CAPI and data validation" },
      { label: "Reporting & Insights", href: "/services/reporting", description: "Daily to executive-level reporting" },
      { label: "Creative & AdTech", href: "/services/creative-adtech", description: "Rich media, tags and ad-server integration" },
    ],
    feature: { label: "How we work", href: "/how-we-work", description: "Transition, SLAs and QA, step by step." },
  },
  {
    label: "Solutions",
    href: "/solutions",
    intro: "Operating models shaped around who you are.",
    links: [
      { label: "For Media Agencies", href: "/solutions/media-agencies", description: "Scale delivery without scaling headcount" },
      { label: "For Performance Agencies", href: "/solutions/performance-agencies", description: "More campaigns, tighter optimization loops" },
      { label: "For Brands", href: "/solutions/brands", description: "Operational depth behind in-house teams" },
      { label: "For Publishers & AdTech", href: "/solutions/publishers-adtech", description: "Monetization, ad serving and platform ops" },
      { label: "White-Label Ad Operations", href: "/solutions/white-label-ad-operations", description: "Your brand in front, our team behind" },
    ],
    feature: { label: "Request an operations assessment", href: "/contact", description: "Map where your team loses time today." },
  },
];

/** Company links, in footer order. */
export const secondaryNav: NavLink[] = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "About", href: "/about" },
];

/**
 * The header bar carries a shorter list than the footer: How We Work is a
 * page you read once while evaluating, not a destination worth a permanent
 * slot beside Services and Solutions. It keeps its footer link, its link from
 * the Services menu and its contextual links from the service and solution
 * pages, so nothing about how it is reached from search changes.
 */
export const headerNav: NavLink[] = secondaryNav.filter((l) => l.href !== "/how-we-work");

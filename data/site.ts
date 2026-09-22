import type { Stat } from "./types";

/**
 * Single source of truth for company facts.
 * Every number here is a verified proof point supplied by Trafficomm.
 * Do not add statistics that are not documented.
 */
export const company = {
  name: "Trafficomm",
  legalName: "Trafficomm Digital Media Services Pvt Ltd",
  founded: 2015,
  tagline: "Performance Operations. Built to Scale.",
  positioning: "The performance operations layer behind modern media teams.",
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
 * Canonical origin. Explicit NEXT_PUBLIC_SITE_URL wins; on Vercel it falls back
 * to the deployment's own URL (production alias or branch URL) so previews
 * never emit localhost canonicals; locally it is http://localhost:3000.
 */
const vercelHost =
  process.env.VERCEL_ENV === "production" ? process.env.VERCEL_PROJECT_PRODUCTION_URL : (process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL);
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")).replace(/\/$/, "");

export const scaleStats: Stat[] = [
  { value: 2015, display: "2015", label: "Founded", detail: "A decade of operating behind the campaign" },
  { value: 10, suffix: "K+", label: "Campaigns handled", detail: "Across social, search, programmatic and ad serving" },
  { value: 1, suffix: "M+", label: "Creatives & placements", detail: "Audited, trafficked, QA'd and monitored" },
  { value: 10, prefix: "$", suffix: "M", label: "Campaign scale", detail: "Approximate campaign scale, USD" },
  { value: 250, suffix: "+", label: "Campaigns / month", detail: "Largest monthly campaign volume" },
  { value: 70, suffix: "+", label: "Peak team scale", detail: "Operations specialists at peak" },
];

export const markets = [
  { code: "sa", name: "Saudi Arabia" },
  { code: "ae", name: "UAE" },
  { code: "qa", name: "Qatar" },
  { code: "kw", name: "Kuwait" },
  { code: "lb", name: "Lebanon" },
  { code: "au", name: "Australia" },
] as const;

export const confidentialityNote =
  "Client identity withheld in accordance with confidentiality obligations.";

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; intro: string; links: NavLink[]; feature?: NavLink };

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
  {
    label: "Platforms",
    href: "/platforms",
    intro: "Ten platforms. One operations team.",
    links: [
      { label: "Meta", href: "/platforms/meta" },
      { label: "Google Ads", href: "/platforms/google-ads" },
      { label: "TikTok", href: "/platforms/tiktok" },
      { label: "Snapchat", href: "/platforms/snapchat" },
      { label: "X", href: "/platforms/x" },
      { label: "LinkedIn", href: "/platforms/linkedin" },
      { label: "DV360", href: "/platforms/dv360" },
      { label: "CM360", href: "/platforms/cm360" },
      { label: "Search Ads 360", href: "/platforms/search-ads-360" },
      { label: "Amazon Ads", href: "/platforms/amazon-ads" },
    ],
  },
];

export const secondaryNav: NavLink[] = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "Performance Lab", href: "/insights" },
  { label: "About", href: "/about" },
];

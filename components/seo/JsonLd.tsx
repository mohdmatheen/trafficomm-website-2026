import { company, markets, siteUrl } from "@/data/site";
import { ecosystemPlatforms } from "@/data/platforms";
import type { Article, FAQ } from "@/data/types";

type Json = Record<string, unknown>;

/** Renders schema.org JSON-LD, escaping `<` to prevent script injection. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * The capabilities and platforms Trafficomm is described by.
 *
 * Platform names are read from the site's own ecosystem data rather than listed
 * here, so the schema can never claim a platform the pages do not show. The
 * capability terms are the ones the service pages already use as headings.
 *
 * There is no sameAs: Trafficomm has no verified public profile recorded in the
 * codebase, and an unverified social URL in an entity graph is worse than none.
 * There is no aggregateRating, review or award, because none exists.
 */
const knowsAbout = [
  "Digital advertising operations",
  "Ad operations",
  "Ad operations outsourcing",
  "White-label ad operations",
  "Performance marketing operations",
  "Programmatic advertising operations",
  "Campaign setup and QA",
  "Campaign optimization",
  "Campaign management",
  "Media operations",
  "Marketing analytics",
  "Campaign reporting",
  "Conversion tracking",
  "GA4",
  "Google Tag Manager",
  "Meta Conversions API",
  ...ecosystemPlatforms.map((p) => p.name),
];

export const organizationSchema = (): Json => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: company.name,
  legalName: company.legalName,
  alternateName: company.legalName,
  url: siteUrl,
  logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg`, width: 64, height: 64 },
  image: `${siteUrl}/opengraph-image`,
  foundingDate: String(company.founded),
  description: company.description,
  slogan: company.tagline,
  // The markets the site documents experience in — no office or address is claimed.
  areaServed: markets.map((m) => ({ "@type": "Country", name: m.name })),
  knowsAbout,
  ...(company.email ? { email: company.email } : {}),
  ...(company.linkedin ? { sameAs: [company.linkedin] } : {}),
});

export const websiteSchema = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: company.name,
  description: company.description,
  inLanguage: "en",
  publisher: { "@id": `${siteUrl}/#organization` },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${siteUrl}${item.path}`,
  })),
});

export const serviceSchema = (s: { name: string; description: string; path: string; serviceType?: string }): Json => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.name,
  serviceType: s.serviceType ?? s.name,
  description: s.description,
  url: `${siteUrl}${s.path}`,
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: markets.map((m) => ({ "@type": "Country", name: m.name })),
});

export const faqSchema = (faqs: FAQ[]): Json => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const articleSchema = (a: Article): Json => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.dek,
  datePublished: a.publishedAt,
  dateModified: a.updatedAt ?? a.publishedAt,
  author: { "@type": "Organization", name: a.author.name },
  publisher: { "@id": `${siteUrl}/#organization` },
  mainEntityOfPage: `${siteUrl}/insights/${a.slug}`,
  keywords: a.tags.join(", "),
});

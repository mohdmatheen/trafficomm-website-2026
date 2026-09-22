import { company, siteUrl } from "@/data/site";
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

export const organizationSchema = (): Json => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: company.name,
  legalName: company.legalName,
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  foundingDate: String(company.founded),
  description: company.description,
  slogan: company.tagline,
  knowsAbout: [
    "Ad operations",
    "Programmatic advertising",
    "Performance marketing",
    "DV360",
    "CM360",
    "GA4",
    "Google Tag Manager",
    "Meta Conversions API",
    "Publisher monetization",
  ],
  ...(company.email ? { email: company.email } : {}),
});

export const websiteSchema = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: company.name,
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
  areaServed: ["Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Lebanon", "Australia"],
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

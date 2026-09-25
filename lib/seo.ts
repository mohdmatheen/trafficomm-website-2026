import type { Metadata } from "next";
import { company, siteUrl } from "@/data/site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  /** Use for article pages. */
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

/** Consistent metadata for every route: canonical, Open Graph and Twitter. */
export function buildMetadata({ title, description, path, type = "website", publishedTime, noIndex }: MetaInput): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${company.name}`,
      description,
      url,
      siteName: company.name,
      type,
      locale: "en_US",
      ...(publishedTime ? { publishedTime } : {}),
    },
    // summary_large_image: there is an Open Graph image now, and the small card
    // crops a 1200x630 banner into an unreadable square.
    twitter: { card: "summary_large_image", title: `${title} | ${company.name}`, description },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const absoluteUrl = (path: string) => `${siteUrl}${path}`;

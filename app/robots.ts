import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { isIndexable } from "@/lib/deployment";

/** Disallow all crawling unless the deployment explicitly opts in (SITE_INDEXABLE=true). */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

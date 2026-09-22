import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

/**
 * Preview and staging deployments are never indexable: on Vercel, anything
 * other than the production environment disallows all crawling.
 */
const isProduction = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";
import { platforms } from "@/data/platforms";
import { services } from "@/data/services";
import { siteUrl } from "@/data/site";
import { solutions } from "@/data/solutions";
import { getArticles } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // "/ad-operations-outsourcing" is a cornerstone commercial page, ranked alongside
  // the section indexes rather than below them.
  const staticRoutes = ["", "/services", "/solutions", "/platforms", "/case-studies", "/how-we-work", "/insights", "/about", "/contact", "/ad-operations-outsourcing"];
  // Labs is listed separately: the calculator is a search destination in its own
  // right, the index is a hub. Both were reachable only through in-body links.
  const labsRoutes: [string, number][] = [
    ["/labs/adops-capacity", 0.8],
    ["/labs", 0.5],
  ];
  // lastmod is emitted only where a real content date exists (articles). Stamping
  // every other page with the build time made every deploy claim a site-wide change,
  // which teaches crawlers to ignore the field.
  const entry = (path: string, priority: number, lastModified?: Date): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency: "monthly",
    priority,
  });
  const articles = await getArticles();
  return [
    ...staticRoutes.map((p) => entry(p, p === "" ? 1 : 0.8)),
    ...labsRoutes.map(([p, priority]) => entry(p, priority)),
    ...services.map((s) => entry(`/services/${s.slug}`, 0.9)),
    ...solutions.map((s) => entry(`/solutions/${s.slug}`, 0.8)),
    ...platforms.map((p) => entry(`/platforms/${p.slug}`, 0.7)),
    ...caseStudies.map((c) => entry(`/case-studies/${c.slug}`, 0.8)),
    ...articles.map((a) => entry(`/insights/${a.slug}`, 0.6, new Date(a.updatedAt ?? a.publishedAt))),
  ];
}

import { caseStudies } from "@/data/case-studies";
import { platforms } from "@/data/platforms";
import { services } from "@/data/services";
import { company, markets, siteUrl } from "@/data/site";
import { solutions } from "@/data/solutions";
import { getArticles } from "@/lib/content";

/**
 * /llms.txt — a plain-text map of the site for AI assistants and answer engines
 * (format: https://llmstxt.org).
 *
 * No search engine ranks on this file, and none promises to read it. It is here
 * because some AI agents do fetch it, and when they do they should find the same
 * facts the pages state, in one place, without parsing a React page.
 *
 * Every line is built from the data the pages render, so it cannot drift from
 * them or claim anything they do not. In particular: no headcount, no client
 * names, and markets are the documented campaign markets only.
 */
export const dynamic = "force-static";

export async function GET() {
  const a = company.address;
  const address = a ? [a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode, "India"].join(", ") : null;
  const link = (path: string, label: string, note?: string) => `- [${label}](${siteUrl}${path})${note ? `: ${note}` : ""}`;
  const articles = await getArticles();

  const lines = [
    `# ${company.name}`,
    "",
    `> ${company.description}`,
    "",
    "Key facts:",
    `- Legal name: ${company.legalName} (incorporated in India in ${company.incorporated}; operating since ${company.founded}).`,
    ...(address ? [`- Office and operations hub: ${address}.`] : []),
    `- Works behind media and advertising agencies, performance agencies, ad networks and ad-tech companies, publishers and brands, including as a white-label ad operations partner.`,
    `- Documented campaign experience: ${markets.map((m) => m.name).join(", ")}, plus campaigns targeted at Türkiye (as stated on the ad operations outsourcing page).`,
    "- Works to the client agency's own working hours and holiday calendar, whichever country it is in.",
    ...(company.linkedin ? [`- LinkedIn: ${company.linkedin}`] : []),
    "",
    "## Core pages",
    link("/ad-operations-outsourcing", "Ad operations outsourcing for agencies", "what is outsourced, how it works, engagement models and FAQs"),
    link("/about", "About Trafficomm"),
    link("/how-we-work", "How we work"),
    link("/contact", "Contact / request an operations assessment"),
    "",
    "## Services",
    ...services.map((s) => link(`/services/${s.slug}`, s.name, s.short)),
    "",
    "## Solutions",
    ...solutions.map((s) => link(`/solutions/${s.slug}`, s.name, s.seo.description)),
    "",
    "## Case studies (clients anonymised)",
    ...caseStudies.map((c) => link(`/case-studies/${c.slug}`, c.seo.title, c.subtitle)),
    "",
    "## Insights",
    ...articles.map((x) => link(`/insights/${x.slug}`, x.title, x.dek)),
    "",
    "## Optional",
    link("/labs/adops-capacity", "AdOps capacity calculator"),
    ...platforms.map((p) => link(`/platforms/${p.slug}`, p.name, p.short)),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

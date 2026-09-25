import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { isIndexable } from "@/lib/deployment";

/**
 * Crawlers that are named explicitly rather than left to the wildcard.
 *
 * `User-agent: *` already allows every one of these, so none of it changes what a
 * crawler may do. It is here because a future edit to the wildcard rule should not
 * silently withdraw access from search and AI-answer crawlers, and because being
 * explicit makes the intent auditable.
 *
 * Nothing here causes a site to appear in an AI-generated answer. Allowing access is
 * a precondition, not a mechanism.
 *
 * Two of these grant more than search indexing, and both are reversible by moving the
 * agent to a disallow rule:
 *   GPTBot          — OpenAI model training (OAI-SearchBot and ChatGPT-User are the
 *                     search and user-initiated fetches, and are separate).
 *   Google-Extended — Gemini grounding and training, separate from Google Search.
 */
const namedCrawlers = [
  // Search indexing
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  // AI answer engines
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
];

/** Disallow all crawling unless the deployment explicitly opts in (SITE_INDEXABLE=true). */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: [{ userAgent: "*", disallow: "/" }] };
  // /api/ is the assessment endpoint: a POST target with nothing to index.
  const allow = { allow: "/", disallow: ["/api/"] };
  return {
    rules: [{ userAgent: "*", ...allow }, ...namedCrawlers.map((userAgent) => ({ userAgent, ...allow }))],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

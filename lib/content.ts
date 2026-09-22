import { articles } from "@/data/articles";
import type { Article, ArticleBlock } from "@/data/types";

/**
 * Content access layer for the Performance Lab.
 * Pages call these functions only — never the data module directly — so a
 * headless CMS (Sanity, Contentful, Payload…) can replace the local source by
 * reimplementing this file with the same signatures.
 */

const WORDS_PER_MINUTE = 230;

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case "ul":
      return block.items.join(" ");
    case "table":
      return [block.caption, ...block.head, ...block.rows.flat()].join(" ");
    case "chart":
      return `${block.title} ${block.caption}`;
    case "callout":
      return `${block.title} ${block.text}`;
    default:
      return block.text;
  }
}

export function readingMinutes(article: Article): number {
  const words = article.body.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export async function getArticles(): Promise<Article[]> {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return articles.find((a) => a.slug === slug);
}

export async function getRelatedArticles(article: Article): Promise<Article[]> {
  return article.related
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

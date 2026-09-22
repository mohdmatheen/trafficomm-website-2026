import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { getArticle, getArticles, getRelatedArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return buildMetadata({ title: a.title, description: a.dek, path: `/insights/${a.slug}`, type: "article", publishedTime: a.publishedAt });
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const related = await getRelatedArticles(article);
  return <ArticleTemplate article={article} related={related} />;
}

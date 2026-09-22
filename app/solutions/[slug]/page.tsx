import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionTemplate } from "@/components/templates/SolutionTemplate";
import { getSolution, solutions } from "@/data/solutions";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return buildMetadata({ title: s.seo.title, description: s.seo.description, path: `/solutions/${s.slug}` });
}

export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const item = getSolution(slug);
  if (!item) notFound();
  return <SolutionTemplate solution={item} />;
}

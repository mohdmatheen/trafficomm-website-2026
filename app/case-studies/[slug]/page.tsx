import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/templates/CaseStudyTemplate";
import { getCaseStudy, caseStudies } from "@/data/case-studies";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getCaseStudy(slug);
  if (!s) return {};
  return buildMetadata({ title: s.seo.title, description: s.seo.description, path: `/case-studies/${s.slug}` });
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const item = getCaseStudy(slug);
  if (!item) notFound();
  return <CaseStudyTemplate cs={item} />;
}

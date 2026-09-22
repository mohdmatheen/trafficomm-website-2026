import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformTemplate } from "@/components/templates/PlatformTemplate";
import { getPlatform, platforms } from "@/data/platforms";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return platforms.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/platforms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getPlatform(slug);
  if (!s) return {};
  return buildMetadata({ title: s.seo.title, description: s.seo.description, path: `/platforms/${s.slug}` });
}

export default async function PlatformPage({ params }: PageProps<"/platforms/[slug]">) {
  const { slug } = await params;
  const item = getPlatform(slug);
  if (!item) notFound();
  return <PlatformTemplate platform={item} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/templates/ServiceDetailPage";
import { ServiceTemplate } from "@/components/templates/ServiceTemplate";
import { servicePages } from "@/data/service-pages";
import { getService, services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const seo = servicePages[slug]?.seo ?? s.seo;
  return buildMetadata({ title: seo.title, description: seo.description, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const detail = servicePages[slug];
  if (detail) return <ServiceDetailPage content={detail} name={service.name} />;
  return <ServiceTemplate service={service} />;
}

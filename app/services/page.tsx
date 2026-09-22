import type { Metadata } from "next";
import { ServiceModuleCard } from "@/components/cards/ServiceModuleCard";
import { CTABand } from "@/components/sections/shared/CTABand";
import { PageHero } from "@/components/sections/shared/PageHero";
import { EngineSection } from "@/components/sections/home/EngineSection";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services — Digital Advertising Operations",
  description:
    "Six specialized capabilities from one operations team: ad operations, performance marketing, programmatic (DV360, CM360), measurement (GA4, GTM, CAPI), reporting and creative & ad tech.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Capabilities"
        title={
          <>
            One partner. <span className="block text-steel/70">Six specialized capabilities.</span>
          </>
        }
        lead="Each capability plugs into your operation — with shared standards for naming, QA, SLAs and reporting across all of them. Use one, or combine them into a complete performance operations layer."
        actions={
          <ButtonLink href="/contact" size="lg">
            Request an Operations Assessment
          </ButtonLink>
        }
      />
      <Section tone="paper" className="!pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceModuleCard key={s.slug} service={s} />
          ))}
        </div>
      </Section>
      <EngineSection index={null} />
      <CTABand />
    </>
  );
}

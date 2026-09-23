import { ArrowLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceExplorer } from "@/components/visual/ServiceExplorer";
import { services } from "@/data/services";

export function ServicesGrid() {
  const items = services.map(({ slug, name, short }) => ({ slug, name, short }));
  return (
    <Section tone="paper" labelledBy="services-title">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="services-title"
          index="04"
          eyebrow="Capabilities"
          title={
            <>
              One Partner. <span className="block text-steel/70">Six Specialized Capabilities.</span>
            </>
          }
          lead="The operating engine is the same for every campaign. Select a capability to see the operating model behind it."
        />
        <ArrowLink href="/services" className="shrink-0 md:pb-3">
          All capabilities
        </ArrowLink>
      </div>
      <div className="mt-14">
        <ServiceExplorer items={items} />
      </div>
    </Section>
  );
}

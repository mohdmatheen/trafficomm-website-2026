import { ArrowLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CapabilityExplorer } from "@/components/visualizations/CapabilityExplorer";
import { services } from "@/data/services";

export function ServicesGrid() {
  const items = services.map(({ slug, name, code, short, explorer }) => ({ slug, name, code, short, explorer }));
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
          lead="Select a capability to see how the work actually moves — from input to output."
        />
        <ArrowLink href="/services" className="shrink-0 md:pb-3">
          All capabilities
        </ArrowLink>
      </div>
      <div className="mt-14">
        <CapabilityExplorer items={items} />
      </div>
    </Section>
  );
}

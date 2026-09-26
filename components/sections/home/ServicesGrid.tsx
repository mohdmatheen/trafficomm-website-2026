import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceExplorer } from "@/components/visual/ServiceExplorer";
import { services } from "@/data/services";

export function ServicesGrid() {
  const items = services.map(({ slug, name, short }) => ({ slug, name, short }));
  return (
    <Section tone="paper" labelledBy="services-title">
      <div>
        <SectionHeading
          id="services-title"
          index="03"
          eyebrow="Capabilities"
          title={
            <>
              One Partner. <span className="block text-steel/70">Six Specialized Capabilities.</span>
            </>
          }
          lead="The operating engine is the same for every campaign. Select a capability to see the operating model behind it."
        />
      </div>
      <div className="mt-14">
        <ServiceExplorer items={items} />
      </div>
    </Section>
  );
}

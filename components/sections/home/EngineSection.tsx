import { Section, SectionHeading } from "@/components/ui/Section";
import { OperatingEngine } from "@/components/visualizations/OperatingEngine";

export function EngineSection({ index = "03" }: { index?: string | null }) {
  return (
    <Section tone="dark" labelledBy="engine-title" className="lg:!py-24">
      <div className="grid-bg-dark mask-fade-y pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="engine-title"
            tone="dark"
            index={index ?? undefined}
            eyebrow="The operating engine"
            title={
              <>
                Everything Between Strategy <span className="block text-mute">and Performance.</span>
              </>
            }
          />
          <p className="max-w-sm text-[1rem] leading-relaxed text-fog lg:pb-2" data-reveal>
            Seven stages, one accountable team. Your strategists hand over a plan; Trafficomm runs everything required to turn it into measured performance.
          </p>
        </div>
        <OperatingEngine />
      </div>
    </Section>
  );
}

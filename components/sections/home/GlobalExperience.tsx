import { Section, SectionHeading } from "@/components/ui/Section";
import { WorldMap } from "@/components/visualizations/WorldMap";

export function GlobalExperience({ index = "10" }: { index?: string | null }) {
  return (
    <Section tone="paper" labelledBy="global-title" className="overflow-hidden">
      <SectionHeading
        id="global-title"
        index={index ?? undefined}
        eyebrow="Markets supported"
        title={
          <>
            Global Campaigns. <span className="block text-steel/70">Centralized Operations.</span>
          </>
        }
        lead="Campaign experience across the Gulf, the Levant and Australia — delivered by one centralized operations team working inside your tools and processes."
      />
      <div className="mt-14">
        <WorldMap />
      </div>
    </Section>
  );
}

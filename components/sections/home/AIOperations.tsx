import { Section, SectionHeading } from "@/components/ui/Section";
import { AIPipeline } from "@/components/visualizations/AIPipeline";

export function AIOperations({ index = "09" }: { index?: string | null }) {
  return (
    <Section tone="white" labelledBy="ai-title">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <SectionHeading
          id="ai-title"
          index={index ?? undefined}
          eyebrow="AI-assisted operations"
          title={
            <>
              AI Accelerates Analysis. <span className="block text-steel/70">Experienced People Drive Action.</span>
            </>
          }
        />
        <p className="text-[1rem] leading-relaxed text-steel lg:pb-2" data-reveal>
          Automation handles the repetitive checks and surfaces what needs attention. Decisions about your campaigns are made by
          experienced Trafficomm operators — not handed to an autonomous system.
        </p>
      </div>
      <div className="mt-14">
        <AIPipeline />
      </div>
    </Section>
  );
}

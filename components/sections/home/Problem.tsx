import { Section, SectionHeading } from "@/components/ui/Section";
import { PressureCascade } from "@/components/sections/shared/PressureCascade";

const tiers = [
  { title: "More", items: ["Campaigns", "Markets", "Platforms", "Creatives", "Clients"], tone: "base" },
  { title: "More operational pressure", items: ["QA", "Trafficking", "Reporting", "Monitoring", "Coordination"], tone: "mid" },
  { title: "Risks", items: ["Operational overhead", "Execution bottlenecks", "Quality risks", "Slower optimization", "Talent dependency"], tone: "risk" },
] as const;

export function Problem() {
  return (
    <Section tone="paper" labelledBy="problem-title">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="problem-title"
            index="02"
            eyebrow="The operational problem"
            title={
              <>
                More Media Shouldn&apos;t Mean <span className="block text-steel/70">More Operational Complexity.</span>
              </>
            }
            lead="Every new client, market and platform multiplies the setup, QA, monitoring and reporting behind it. Without a scalable operating layer, growth turns into overhead."
          />
        </div>

        <PressureCascade
          tiers={tiers}
          label="How media growth becomes operational risk"
          resolution={{ label: "Trafficomm", statement: "A scalable performance operations layer behind your media team." }}
        />
      </div>
    </Section>
  );
}

import { Section, SectionHeading } from "@/components/ui/Section";
import { CalculatorPreview } from "@/components/visualizations/CalculatorPreview";

export function CalculatorTeaser() {
  return (
    <Section tone="white" labelledBy="calc-title">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          id="calc-title"
          index="13"
          eyebrow="Operations economics"
          title={
            <>
              What Is Your Ad Operations Team <span className="block text-steel/70">Actually Costing You?</span>
            </>
          }
          lead="Compare campaign volume, platform complexity and internal team capacity to understand the operational cost of scaling media execution."
        />
        <div data-reveal>
          <CalculatorPreview />
        </div>
      </div>
    </Section>
  );
}

import { Metric } from "@/components/ui/Metric";
import { Section, SectionHeading } from "@/components/ui/Section";
import { campaignScaleNote, scaleStats } from "@/data/metrics";

export function ScaleStats() {
  return (
    <Section tone="white" labelledBy="scale-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeading
          id="scale-title"
          index="01"
          eyebrow="Operating scale"
          title={
            <>
              Built Through Execution.
              <br />
              <span className="block text-steel/70">Proven at Scale.</span>
            </>
          }
          lead="A decade of campaigns run behind agencies, ad networks, publishers and brands — measured in volume, not claims."
        />
        <div>
        <dl className="grid grid-cols-2 border-t border-l border-line md:grid-cols-3">
          {scaleStats.map((s, i) => (
            <div
              key={s.label}
              className="group relative flex flex-col border-r border-b border-line p-5 sm:p-7"
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            >
              <span className="absolute left-0 top-0 h-px w-0 bg-signal transition-[width] duration-700 group-hover:w-full" aria-hidden="true" />
              <dt className="eyebrow order-2 mt-4 !text-[0.72rem] text-steel">{s.label}</dt>
              <dd className="order-1 whitespace-nowrap text-[clamp(2.4rem,1.4rem+2.6vw,4.25rem)] leading-none tracking-[-0.045em] text-ink">
                <Metric stat={s} />
              </dd>
              {s.detail && <dd className="order-3 mt-3 text-[0.9rem] leading-snug text-steel">{s.detail}</dd>}
            </div>
          ))}
        </dl>
          <p className="mt-5 max-w-xl text-[0.84rem] leading-relaxed text-steel">{campaignScaleNote}</p>
        </div>
      </div>
    </Section>
  );
}

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { EcosystemHero } from "@/components/visualizations/EcosystemHero";
import { formatStat } from "@/components/ui/Metric";
import { companyMetrics as m } from "@/data/metrics";

const capabilities = ["Ad Operations", "Performance", "Programmatic", "Measurement", "Reporting"];

const heroStats = [m.campaigns, m.campaignScale, m.peakTeam].map((s) => ({ v: formatStat(s), l: s.label }));

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-paper pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      <div className="grid-bg mask-radial pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <Eyebrow className="mb-8">Digital advertising operations • Since 2015</Eyebrow>
          <h1 id="hero-title" className="text-display text-ink">
            Performance Operations.
            <span className="block text-steel/70">
              Built to Scale<span className="text-signal">.</span>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lead text-steel">
            Trafficomm helps agencies and brands execute, optimize and scale digital advertising across platforms and markets
            — without scaling operational complexity.
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.79rem] uppercase tracking-[0.1em] text-graphite" aria-label="Capabilities">
            {capabilities.map((c, i) => (
              <li key={c} className="flex items-center gap-3">
                {i > 0 && <span className="text-signal" aria-hidden="true">·</span>}
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/services" size="lg">
              Explore Our Capabilities
            </ButtonLink>
            <ButtonLink href="/contact#call" size="lg" variant="ghost" arrow={false}>
              Talk to Trafficomm
            </ButtonLink>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 border-t border-line pt-6">
            {heroStats.map((s) => (
              <div key={s.l} className="flex flex-col">
                <dt className="eyebrow order-2 mt-2 !text-[0.68rem] text-steel">{s.l}</dt>
                <dd className="order-1 text-[1.75rem] leading-none tracking-[-0.035em] text-ink tabular">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[620px]">
          <EcosystemHero />
        </div>
      </div>
    </section>
  );
}

import { ButtonLink } from "@/components/ui/Button";
import { EcosystemHero } from "@/components/visualizations/EcosystemHero";
import { formatStat } from "@/components/ui/Metric";
import { companyMetrics as m } from "@/data/metrics";

/**
 * The figures carry their label only. Their historical qualifiers ("peak
 * historical team size", "UAE tourism campaign") are stated on /about, in the
 * FAQ copy and in `companyScaleSentence` — see data/metrics.ts.
 */
const heroStats = [m.campaigns, m.campaignScale, m.peakTeam].map((s) => ({ v: formatStat(s), l: s.label }));

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-paper pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      <div className="grid-bg mask-radial pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      {/* The visual column carries a little more of the grid than the copy does:
          the platform marks have to be recognisable, not merely present. */}
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1fr_1.12fr] lg:gap-10">
        <div>
          <h1 id="hero-title" className="text-display text-ink">
            Performance Operations.
            <span className="block text-steel/70">
              Built for Execution<span className="text-signal">.</span>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lead text-steel">
            Trafficomm helps agencies and brands execute, optimize and manage digital advertising across platforms and markets
            — backed by specialized campaign operations, performance and reporting teams.
          </p>
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
              <div key={s.l} className="flex flex-col pr-3">
                <dt className="eyebrow order-2 mt-2 !text-[0.68rem] text-steel">{s.l}</dt>
                <dd className="order-1 text-[1.75rem] leading-none tracking-[-0.035em] text-ink tabular">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[740px]">
          <EcosystemHero />
          {/* The hero is now the only place on the homepage that shows platform
              marks — the ecosystem section that used to carry this notice moved
              to /platforms. The marks must not travel without it. */}
          <p className="mt-6 text-[0.76rem] leading-relaxed text-steel">
            Platform names and marks are trademarks of their respective owners. They indicate the platforms Trafficomm has
            operational experience with and do not imply partnership, certification or endorsement.
          </p>
        </div>
      </div>
    </section>
  );
}

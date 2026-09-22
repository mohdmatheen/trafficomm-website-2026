import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import type { ServicePageContent } from "@/data/service-pages/types";
import { LifecycleRail } from "./LifecycleRail";

export function ServiceHero({ content, name }: { content: ServicePageContent; name: string }) {
  const { hero } = content;
  return (
    <section aria-labelledby="svc-hero-title" className="relative overflow-hidden bg-paper pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      <div className="grid-bg mask-radial pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-site relative">
        <Breadcrumbs
          items={[
            { name: "Services", path: "/services" },
            { name, path: `/services/${content.slug}` },
          ]}
        />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <Eyebrow className="mb-7">{hero.eyebrow}</Eyebrow>
            <h1 id="svc-hero-title" className="text-[clamp(2.5rem,1.5rem+3.1vw,4.25rem)] leading-[0.98] tracking-[-0.04em] text-ink">
              {hero.title[0]} <span className="block text-steel/70">{hero.title[1]}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lead text-steel">{hero.lead}</p>
            <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.79rem] uppercase tracking-[0.1em] text-graphite" aria-label="Capabilities">
              {hero.capabilityLine.map((c, i) => (
                <li key={c} className="flex items-center gap-3">
                  {i > 0 && (
                    <span className="text-signal" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#assessment" size="lg">
                Request an Operations Assessment
              </ButtonLink>
              <ButtonLink href="/how-we-work" size="lg" variant="ghost" arrow={false}>
                See How We Work
              </ButtonLink>
            </div>
          </div>
          <LifecycleRail stages={hero.lifecycle} />
        </div>
      </div>
    </section>
  );
}

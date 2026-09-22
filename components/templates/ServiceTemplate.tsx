import Link from "next/link";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { JsonLd, serviceSchema } from "@/components/seo/JsonLd";
import { CTABand } from "@/components/sections/shared/CTABand";
import { FAQList } from "@/components/sections/shared/FAQList";
import { LinkList } from "@/components/sections/shared/LinkList";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Steps } from "@/components/sections/shared/Steps";
import { ButtonLink } from "@/components/ui/Button";
import { ConfidentialNote } from "@/components/ui/ConfidentialNote";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ModuleViz } from "@/components/visualizations/ModuleViz";
import { caseStudies } from "@/data/case-studies";
import { platforms } from "@/data/platforms";
import { services } from "@/data/services";
import type { Service } from "@/data/types";

export function ServiceTemplate({ service }: { service: Service }) {
  const index = services.findIndex((s) => s.slug === service.slug);
  const related = caseStudies.filter((c) => service.relatedCases.includes(c.slug));
  const pls = platforms.filter((p) => service.platforms.includes(p.slug));
  const others = services.filter((s) => s.slug !== service.slug);
  const total = service.groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        eyebrow={`${service.name} · Module ${String(index + 1).padStart(2, "0")}`}
        title={service.headline}
        lead={service.intro}
        actions={
          <>
            <ButtonLink href="/contact" size="lg">
              Request an Operations Assessment
            </ButtonLink>
            <ButtonLink href="#capabilities" size="lg" variant="ghost" arrow={false}>
              What&apos;s included
            </ButtonLink>
          </>
        }
        aside={
          <div className="overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-steel">
                MOD {String(index + 1).padStart(2, "0")} · {service.code}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-steel">
                <span className="size-1.5 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" /> Active
              </span>
            </div>
            <div className="h-40 px-6 pt-6 text-ink">
              <ModuleViz kind={service.viz} />
            </div>
            <dl className="grid grid-cols-2 border-t border-line">
              <div className="border-r border-line p-5">
                <dt className="eyebrow !text-[0.62rem] text-steel">Functions</dt>
                <dd className="mt-2 text-[2rem] leading-none tracking-[-0.04em] text-ink">{total}</dd>
              </div>
              <div className="p-5">
                <dt className="eyebrow !text-[0.62rem] text-steel">Platforms</dt>
                <dd className="mt-2 text-[2rem] leading-none tracking-[-0.04em] text-ink">{pls.length}</dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section tone="white" id="capabilities" labelledBy="cap-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <SectionHeading id="cap-title" eyebrow="What's included" title="Capabilities" lead={service.summary} />
          <div className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line ring-1 ring-line sm:grid-cols-2">
            {service.groups.map((g, i) => (
              <div key={g.title} className="bg-white p-6 sm:p-8" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                <p className="font-mono text-[0.7rem] text-signal">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 text-[1.3rem] tracking-[-0.02em] text-ink">{g.title}</h3>
                <ul className="mt-5 space-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-[0.96rem] text-graphite">
                      <span className="h-px w-3 bg-signal" aria-hidden="true" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark" labelledBy="flow-title">
        <SectionHeading id="flow-title" tone="dark" eyebrow="How it runs" title={<>From brief to report, <span className="block text-mute">step by step.</span></>} />
        <div className="mt-14">
          <Steps steps={service.workflow} tone="dark" />
        </div>
      </Section>

      <Section tone="paper" labelledBy="outcome-title">
        <SectionHeading id="outcome-title" eyebrow="Why teams use Trafficomm" title="What changes for your team" />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {service.outcomes.map((o, i) => (
            <div key={o.title} className="rounded-[var(--radius-card)] bg-white p-7 ring-1 ring-line sm:p-9" data-reveal style={{ "--reveal-delay": `${(i % 2) * 80}ms` } as React.CSSProperties}>
              <span className="block h-0.5 w-8 bg-signal" aria-hidden="true" />
              <h3 className="mt-6 text-h3 text-ink">{o.title}</h3>
              <p className="mt-3 text-[1rem] leading-relaxed text-steel">{o.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white" labelledBy="pl-title">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading id="pl-title" eyebrow="Platforms" title="Where we run it" />
            <ul className="mt-10 flex flex-wrap gap-2">
              {pls.map((p) => (
                <li key={p.slug}>
                  <Link href={`/platforms/${p.slug}`} className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-[0.92rem] text-ink ring-1 ring-line transition-colors hover:ring-ink">
                    <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Other capabilities" title="Pairs well with" />
            <div className="mt-10">
              <LinkList items={others.map((s) => ({ href: `/services/${s.slug}`, label: s.name, meta: s.code }))} />
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="paper" labelledBy="rel-title">
          <SectionHeading id="rel-title" eyebrow="Documented results" title="Related case studies" />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((cs) => (
              <CaseStudyCard key={cs.slug} cs={cs} />
            ))}
          </div>
          <ConfidentialNote className="mt-8" />
        </Section>
      )}

      {service.faqs.length > 0 && (
        <Section tone="white" labelledBy="faq-title">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions we hear" />
            <FAQList faqs={service.faqs} />
          </div>
        </Section>
      )}

      <CTABand />
      <JsonLd data={serviceSchema({ name: service.name, description: service.seo.description, path: `/services/${service.slug}` })} />
    </>
  );
}

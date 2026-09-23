import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { ServiceModuleCard } from "@/components/cards/ServiceModuleCard";
import { JsonLd, serviceSchema } from "@/components/seo/JsonLd";
import { CTABand } from "@/components/sections/shared/CTABand";
import { FAQList } from "@/components/sections/shared/FAQList";
import { LinkList } from "@/components/sections/shared/LinkList";
import { PageHero } from "@/components/sections/shared/PageHero";
import { StageChain } from "@/components/service-page/StageChain";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { ConfidentialNote } from "@/components/ui/ConfidentialNote";
import { LogoMark } from "@/components/ui/Logo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SolutionGlyph, solutionCaption } from "@/components/visual/SolutionGlyph";
import { caseStudies } from "@/data/case-studies";
import { services } from "@/data/services";
import type { Solution } from "@/data/types";

export function SolutionTemplate({ solution }: { solution: Solution }) {
  const svc = services.filter((s) => solution.services.includes(s.slug));
  const related = caseStudies.filter((c) => solution.relatedCases.includes(c.slug));

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Solutions", path: "/solutions" },
          { name: solution.name, path: `/solutions/${solution.slug}` },
        ]}
        eyebrow={solution.name}
        title={solution.headline}
        lead={solution.intro}
        actions={
          <>
            <ButtonLink href="/contact" size="lg">
              Request an Operations Assessment
            </ButtonLink>
            <ButtonLink href="/how-we-work" size="lg" variant="ghost" arrow={false}>
              See How We Work
            </ButtonLink>
          </>
        }
        aside={
          <div className="rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-line sm:p-8">
            <p className="eyebrow text-steel">The problem</p>
            <ul className="mt-5 space-y-3">
              {solution.pressures.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[0.98rem] leading-snug text-graphite">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <Section tone="white" labelledBy="model-title">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16">
          <SectionHeading
            id="model-title"
            eyebrow="The operating model"
            title={
              <>
                Clear ownership. <span className="block text-steel/70">No overlap.</span>
              </>
            }
            lead={`How responsibilities divide between ${solution.audience.toLowerCase()} and Trafficomm.`}
          />
          {/* Where Trafficomm sits in the organisation — the one thing a solution page has to answer. */}
          <div className="rounded-[var(--radius-panel)] bg-paper p-6 ring-1 ring-line sm:p-8" data-reveal>
            <p className="eyebrow !text-[0.62rem] text-steel">Where Trafficomm sits</p>
            <div className="mt-5">
              <SolutionGlyph slug={solution.slug} full />
            </div>
            <p className="mt-5 font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.1em] text-steel">{solutionCaption(solution.slug)}</p>
          </div>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-2" data-reveal>
          <div className="rounded-[var(--radius-panel)] bg-paper p-7 ring-1 ring-line sm:p-9">
            <p className="eyebrow text-steel">Keep in-house</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {solution.model.theyOwn.map((t) => (
                <li key={t} className="py-3.5 text-[1.08rem] tracking-[-0.01em] text-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-ink p-7 text-white sm:p-9">
            <div className="grid-bg-dark absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-signal">Trafficomm can handle</p>
                <LogoMark className="w-7" inverted />
              </div>
              <ul className="mt-6 divide-y divide-line-dark border-y border-line-dark">
                {solution.model.weOwn.map((t) => (
                  <li key={t} className="flex items-center justify-between py-3.5 text-[1.08rem] tracking-[-0.01em]">
                    {t}
                    <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="dark" labelledBy="wf-title" className="overflow-hidden">
        <div className="grid-bg-dark mask-fade-y pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative">
          <SectionHeading
            id="wf-title"
            tone="dark"
            eyebrow="How the workflow changes"
            title={
              <>
                {solution.workflow.title[0]} <span className="block text-mute">{solution.workflow.title[1]}</span>
              </>
            }
            lead={solution.workflow.lead}
          />
          <div className="mt-14">
            <StageChain stages={solution.workflow.steps} label={`${solution.name}: how the workflow changes`} inputLabel="Your team" outputLabel="Delivered" />
          </div>
          <ArrowLink href="/how-we-work" tone="dark" className="mt-10">
            See the full operating model
          </ArrowLink>
        </div>
      </Section>

      <Section tone="paper" labelledBy="eng-title">
        <SectionHeading id="eng-title" eyebrow="Ways to engage" title="Engagement models" />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {solution.engagements.map((e, i) => (
            <div key={e.title} className="rounded-[var(--radius-card)] bg-white p-7 ring-1 ring-line" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
              <span className="font-mono text-[0.7rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-[1.35rem] leading-tight tracking-[-0.02em] text-ink">{e.title}</h3>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-steel">{e.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white" labelledBy="svc-title">
        <SectionHeading id="svc-title" eyebrow="Relevant services" title="The services behind this model" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {svc.map((s) => (
            <ServiceModuleCard key={s.slug} service={s} />
          ))}
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="paper" labelledBy="rel-title">
          <SectionHeading id="rel-title" eyebrow="Documented results" title="Relevant evidence" />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((cs) => (
              <CaseStudyCard key={cs.slug} cs={cs} />
            ))}
          </div>
          <ConfidentialNote className="mt-8" />
        </Section>
      )}

      {solution.faqs.length > 0 && (
        <Section tone="white" labelledBy="faq-title">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions we hear" />
            <FAQList faqs={solution.faqs} />
          </div>
        </Section>
      )}

      <Section tone="paper" labelledBy="links-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeading id="links-title" eyebrow="Related" title="Explore further" />
          <LinkList items={solution.links} />
        </div>
      </Section>

      <CTABand title={solution.cta.title} body={solution.cta.body} />
      <JsonLd data={serviceSchema({ name: solution.name, description: solution.seo.description, path: `/solutions/${solution.slug}` })} />
    </>
  );
}

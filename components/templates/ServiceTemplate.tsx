import Link from "next/link";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { JsonLd, serviceSchema } from "@/components/seo/JsonLd";
import { CTABand } from "@/components/sections/shared/CTABand";
import { FAQList } from "@/components/sections/shared/FAQList";
import { LinkList } from "@/components/sections/shared/LinkList";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Steps } from "@/components/sections/shared/Steps";
import { AgencyIntegration } from "@/components/service-page/AgencyIntegration";
import { OperatingModel } from "@/components/service-page/OperatingModel";
import { ReportingCadence } from "@/components/service-page/ReportingCadence";
import { ScopeTable } from "@/components/service-page/ScopeTable";
import { StageChain } from "@/components/service-page/StageChain";
import { ConnectedSystems } from "@/components/visual/ConnectedSystems";
import { CreativeFormatExplorer } from "@/components/visual/CreativeFormatExplorer";
import { CreativeFormatBoard, PerformanceSignalBoard } from "@/components/visual/HeroBoards";
import { DeliveryArchitecture } from "@/components/visual/DeliveryArchitecture";
import { OptimizationEngine } from "@/components/visual/OptimizationEngine";
import { ReportingDashboard } from "@/components/visual/ReportingDashboard";
import { SignalJourney } from "@/components/visual/SignalJourney";
import { SignalPipeline } from "@/components/visual/SignalPipeline";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { ConfidentialNote } from "@/components/ui/ConfidentialNote";
import { ArrowRight } from "@/components/ui/Icons";
import { Metric } from "@/components/ui/Metric";
import { PlatformMark } from "@/components/ui/PlatformMark";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceIllustrationFluid } from "@/components/visual/ServiceIllustration";
import { caseStudies } from "@/data/case-studies";
import { platforms } from "@/data/platforms";
import { serviceDepth } from "@/data/service-depth";
import { reportingPipeline } from "@/data/visual/reporting-dashboard";
import type { Service } from "@/data/types";

const Title = ({ t, dark = false }: { t: [string, string]; dark?: boolean }) => (
  <>
    {t[0]} <span className={`block ${dark ? "text-mute" : "text-steel/70"}`}>{t[1]}</span>
  </>
);

/**
 * Standard service page. Each section answers one buyer question: what
 * problem this solves, what Trafficomm handles, how the work is structured,
 * who owns what, which platforms are involved and what evidence exists.
 * Service-specific depth comes from data/service-depth.ts.
 */
export function ServiceTemplate({ service }: { service: Service }) {
  const depth = serviceDepth[service.slug];
  const related = caseStudies.filter((c) => service.relatedCases.includes(c.slug));
  const pls = platforms.filter((p) => service.platforms.includes(p.slug));
  const sys = depth?.system;
  // Light sections alternate white / paper in render order, whichever optional sections a service has.
  let n = 0;
  const tone = (): "white" | "paper" => (n++ % 2 === 0 ? "white" : "paper");

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        eyebrow={service.name}
        title={service.headline}
        lead={service.intro}
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
          <div className="overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line">
            <div className="border-b border-line px-5 py-3">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink">{service.name}</p>
              <p className="mt-1 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-steel">{service.scopeLine.join(" · ")}</p>
            </div>
            {/* The old module diagram was drawn into a fixed 160px box; the
                illustration sets its own height from its 9:5 ratio instead. */}
            <div className={depth?.heroVisual ? "text-ink" : "px-6 py-7 text-ink"}>
              {/* Performance and Creative have their own approved hero boards. The rest
                  showed a generic module diagram; they now open with the service's
                  illustration, and the operating systems further down the page are
                  untouched. */}
              {depth?.heroVisual === "signal-board" ? (
                <PerformanceSignalBoard />
              ) : depth?.heroVisual === "format-board" ? (
                <CreativeFormatBoard />
              ) : (
                <ServiceIllustrationFluid slug={service.slug} className="mx-auto max-w-[24rem]" />
              )}
            </div>
            <div className="border-t border-line p-5">
              <p className="eyebrow !text-[0.62rem] text-steel">Platforms involved</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {pls.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/platforms/${p.slug}`} title={p.name} className="block rounded-[10px] ring-1 ring-line transition-shadow hover:ring-ink">
                      <PlatformMark slug={p.slug} size={36} className="rounded-[10px] ring-0" />
                      <span className="sr-only">{p.name} operations</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      {depth && (
        <Section tone={tone()} labelledBy="problem-title">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <SectionHeading id="problem-title" eyebrow="The problem it solves" title={<Title t={depth.problem.title} />} lead={depth.problem.lead} />
            <ul className="divide-y divide-line self-end border-y border-line" data-reveal>
              {depth.problem.points.map((p) => (
                <li key={p} className="flex items-start gap-4 py-4 text-[1.06rem] leading-snug text-ink">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full border border-signal-ink" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {depth?.capabilities !== "absorbed" && (
      <Section tone={tone()} id="capabilities" labelledBy="cap-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <SectionHeading id="cap-title" eyebrow="What Trafficomm handles" title="Capabilities" lead={service.summary} />
          <div className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line ring-1 ring-line sm:grid-cols-2">
            {service.groups.map((g, i) => (
              <div
                key={g.title}
                className={`bg-white p-6 sm:p-8 ${i === service.groups.length - 1 && service.groups.length % 2 === 1 ? "sm:col-span-2" : ""}`}
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <p className="font-mono text-[0.7rem] text-signal-ink">{String(i + 1).padStart(2, "0")}</p>
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
      )}

      {sys && (
        <Section tone="dark" labelledBy="system-title" className="overflow-hidden">
          <div className="grid-bg-dark mask-fade-y pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <SectionHeading id="system-title" tone="dark" eyebrow={sys.eyebrow} title={<Title t={sys.title} dark />} lead={sys.lead} />
            <div className="mt-14">
              {sys.kind === "optimization" && <OptimizationEngine levers={sys.levers} kpis={sys.kpis} loop={sys.loop} note={sys.note} />}
              {sys.kind === "split" && <ConnectedSystems sides={sys.sides} />}
              {sys.kind === "chain" &&
                (sys.visual === "signal-journey" ? (
                  <SignalJourney />
                ) : sys.visual === "delivery-architecture" ? (
                  <DeliveryArchitecture />
                ) : sys.visual === "reporting-pipeline" ? (
                  <SignalPipeline stages={reportingPipeline} label="Reporting pipeline" ownerLabels={{ client: "Platforms", trafficomm: "Trafficomm", output: "Delivered" }} />
                ) : (
                  <StageChain stages={sys.stages} label={`${service.name}: ${sys.title.join(" ")}`} />
                ))}
            </div>
            {depth?.capabilities === "absorbed" && <ScopeTable groups={service.groups} />}
            {sys.kind === "chain" && sys.limits && (
              <div className="mt-10 grid gap-4 rounded-[var(--radius-panel)] bg-ink-2 p-6 ring-1 ring-line-dark sm:p-8 lg:grid-cols-[0.8fr_2fr] lg:gap-10" data-reveal>
                <p className="text-h3 text-white">{sys.limits.title}</p>
                <p className="text-[1rem] leading-relaxed text-fog">{sys.limits.body}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {sys?.kind === "chain" && sys.disciplines && (
        <Section tone={tone()} labelledBy="disc-title">
          <SectionHeading id="disc-title" eyebrow="Measurement discipline" title={<Title t={sys.disciplines.title} />} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
            {sys.disciplines.items.map((d, i) => (
              <div key={d.label} className="bg-white p-7" data-reveal style={{ "--reveal-delay": `${(i % 3) * 60}ms` } as React.CSSProperties}>
                <span className="font-mono text-[0.7rem] text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-[1.25rem] tracking-[-0.02em] text-ink">{d.label}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-steel">{d.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {sys?.kind === "chain" && sys.distinction && (
        <Section tone={tone()} labelledBy="dist-title">
          <SectionHeading id="dist-title" eyebrow="Reporting · Analysis · Insight" title={<Title t={sys.distinction.title} />} />
          <div className="mt-14" data-reveal>
            <ReportingDashboard definitions={sys.distinction.items} />
          </div>
          {depth?.cadences && (
            <div className="mt-16">
              <SectionHeading eyebrow="Cadence" title="Daily to end of campaign." />
              <div className="mt-8">
                <ReportingCadence cadences={depth.cadences} />
              </div>
            </div>
          )}
        </Section>
      )}

      {depth?.workflowTitle && (
        <Section tone={tone()} labelledBy="flow-title">
          <SectionHeading id="flow-title" eyebrow="How it runs" title={<Title t={depth.workflowTitle} />} />
          <div className="mt-14">
            {depth.workflowStyle === "strip" ? (
              <ol className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line ring-1 ring-line sm:grid-cols-5" data-reveal>
                {service.workflow.map((st, i) => (
                  <li key={st.step} className="bg-white p-5">
                    <span className="font-mono text-[0.68rem] text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-3 text-[1.05rem] tracking-[-0.02em] text-ink">{st.step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <Steps steps={service.workflow} />
            )}
          </div>
        </Section>
      )}

      {depth?.formatExplorer && (
        <Section tone={tone()} labelledBy="fmt-title">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <SectionHeading
              id="fmt-title"
              eyebrow="What we produce"
              title={<Title t={["Every Format", "a Plan Asks For."]} />}
              lead="Display, social, video, HTML5 and rich media — drawn to the proportions they actually ship in."
            />
            <div data-reveal>
              <CreativeFormatExplorer />
            </div>
          </div>
        </Section>
      )}

      {depth && (
        <Section tone={tone()} labelledBy="own-title">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeading id="own-title" eyebrow="How it fits your team" title={<Title t={["Clear Ownership.", "No Overlap."]} />} lead={depth.ownership.note} />
              <ArrowLink href="/how-we-work" className="mt-8">
                See how we work
              </ArrowLink>
            </div>
            {depth.lowerPage !== "compact" && (
              <AgencyIntegration
                frame={depth.ownership.frame}
                ownerLabel={depth.ownership.clientLabel}
                agencyOwns={depth.ownership.clientOwns}
                trafficommSupports={depth.ownership.trafficommSupports}
                note="Every engagement runs on the same operating model: an accountable account manager, platform specialists and a dedicated QA step."
              />
            )}
          </div>
          {depth.lowerPage === "compact" && (
            <div className="mt-12">
              <OperatingModel
                frame={depth.ownership.frame}
                ownerLabel={depth.ownership.clientLabel}
                clientOwns={depth.ownership.clientOwns}
                trafficommSupports={depth.ownership.trafficommSupports}
                note="Every engagement runs on the same operating model: an accountable account manager, platform specialists and a dedicated QA step."
                outcomes={service.outcomes}
              />
            </div>
          )}
        </Section>
      )}

      {depth?.lowerPage !== "compact" && (
      <Section tone={tone()} labelledBy="outcome-title">
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
      )}

      <Section tone={tone()} labelledBy="pl-title">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading id="pl-title" eyebrow="Platform experience" title="Where we run it" />
            <ul className="mt-10 flex flex-wrap gap-2">
              {pls.map((p) => (
                <li key={p.slug}>
                  <Link href={`/platforms/${p.slug}`} className="inline-flex h-11 items-center gap-2.5 rounded-full bg-paper pl-1.5 pr-4 text-[0.92rem] text-ink ring-1 ring-line transition-colors hover:ring-ink">
                    <PlatformMark slug={p.slug} size={32} className="rounded-full ring-0" />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-md text-[0.8rem] leading-relaxed text-steel">
              Platform names and marks are trademarks of their respective owners and indicate operational experience only — not partnership, certification or endorsement.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Related" title="Explore further" />
            <div className="mt-10">
              <LinkList items={depth?.links ?? []} />
            </div>
          </div>
        </div>
      </Section>

      {(depth?.proof?.length || related.length > 0) && (
        <Section tone={tone()} labelledBy="rel-title">
          <SectionHeading id="rel-title" eyebrow="Documented results" title="Evidence from anonymized engagements" />
          {depth?.proof && depth.proof.length > 0 && (
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {depth.proof.map((p) => (
                <li key={p.slug + p.value}>
                  <Link href={`/case-studies/${p.slug}`} className="group flex h-full items-end justify-between gap-6 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line transition-shadow hover:ring-line-strong sm:p-8">
                    <span className="flex flex-col">
                      <span className="order-2 eyebrow mt-3 text-graphite">{p.label}</span>
                      <span className="order-1 text-[clamp(2.6rem,1.8rem+2.4vw,4rem)] leading-none tracking-[-0.05em] text-signal">
                        <Metric value={p.value} />
                      </span>
                      <span className="order-3 mt-2 text-[0.92rem] text-steel">{p.context}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-[0.94rem] font-medium text-ink">
                      View case study <ArrowRight className="text-signal transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {related.length > 0 && (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((cs) => (
                <CaseStudyCard key={cs.slug} cs={cs} />
              ))}
            </div>
          )}
          <ConfidentialNote className="mt-8" />
        </Section>
      )}

      {service.faqs.length > 0 && (
        <Section tone={tone()} labelledBy="faq-title">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <SectionHeading id="faq-title" eyebrow="FAQ" title={`${service.name} questions`} />
            <FAQList faqs={service.faqs} />
          </div>
        </Section>
      )}

      <CTABand title={depth?.cta.title} body={depth?.cta.body} />
      <JsonLd data={serviceSchema({ name: service.name, description: service.seo.description, path: `/services/${service.slug}` })} />
    </>
  );
}

import Link from "next/link";
import { ViewEvent } from "@/components/analytics/ViewEvent";
import { CTABand } from "@/components/sections/shared/CTABand";
import { LinkList } from "@/components/sections/shared/LinkList";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Metric } from "@/components/ui/Metric";
import { ConfidentialNote } from "@/components/ui/ConfidentialNote";
import { ArrowRight, Lock } from "@/components/ui/Icons";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { CaseMotif } from "@/components/visualizations/CaseMotif";
import { TeamScaleGrid } from "@/components/visualizations/TeamScaleGrid";
import { caseStudies } from "@/data/case-studies";
import { services } from "@/data/services";
import type { CaseStudy } from "@/data/types";

export function CaseStudyTemplate({ cs }: { cs: CaseStudy }) {
  const i = caseStudies.findIndex((c) => c.slug === cs.slug);
  const next = caseStudies[(i + 1) % caseStudies.length];
  const svc = services.filter((s) => cs.services.includes(s.slug));

  return (
    <>
      <ViewEvent event="case_study_view" params={{ case_study_name: cs.slug }} />
      <section data-hero="dark" className="relative overflow-hidden bg-ink pt-28 pb-16 text-white sm:pt-36 sm:pb-24">
        <div className="grid-bg-dark mask-radial pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 top-24 h-[380px] w-[600px] opacity-30 [mask-image:linear-gradient(to_left,#000_30%,transparent)] max-md:hidden" aria-hidden="true">
          <CaseMotif slug={cs.slug} tone="dark" />
        </div>
        <div className="container-site relative">
          <Breadcrumbs
            tone="dark"
            items={[
              { name: "Case Studies", path: "/case-studies" },
              { name: `Case ${cs.number}`, path: `/case-studies/${cs.slug}` },
            ]}
          />
          <div className="mt-10 flex flex-wrap gap-2">
            <Badge tone="dark">Case {cs.number}</Badge>
            <Badge tone="dark">{cs.category}</Badge>
            <Badge tone="dark">{cs.market}</Badge>
          </div>
          <h1 className="mt-8 max-w-4xl text-h1">{cs.title}</h1>
          <p className="mt-7 max-w-2xl text-lead text-fog">{cs.subtitle}</p>
          <p className="mt-8 flex items-center gap-2.5 text-[0.88rem] text-fog">
            <Lock className="text-signal" /> Client: {cs.client}
          </p>

          <dl className={`mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line-dark ring-1 ring-line-dark sm:grid-cols-2 ${cs.metrics.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {cs.metrics.map((m, k) => (
              <div key={m.label} className="flex flex-col bg-ink-2 p-6 sm:p-8">
                <dt className="eyebrow order-2 mt-4 !text-[0.64rem] text-mute">{m.label}</dt>
                <dd className={`order-1 whitespace-nowrap text-[clamp(2.4rem,1.6rem+2.2vw,3.75rem)] leading-none tracking-[-0.045em] ${k === 0 ? "text-signal" : "text-white"}`}><Metric value={m.value} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section tone="white" labelledBy="ctx-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeading id="ctx-title" eyebrow="Context" title="The client" />
          <div data-reveal>
            <p className="text-[1.25rem] leading-relaxed tracking-[-0.01em] text-graphite">{cs.context}</p>
            <ConfidentialNote className="mt-8" />
          </div>
        </div>
      </Section>

      <Section tone="paper" labelledBy="ch-title">
        <SectionHeading id="ch-title" eyebrow="The challenge" title="What was in the way" />
        <div className={`mt-14 grid gap-4 sm:grid-cols-2 ${cs.challenges.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {cs.challenges.map((c, k) => (
            <div key={c.title} className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line" data-reveal style={{ "--reveal-delay": `${k * 60}ms` } as React.CSSProperties}>
              <span className="font-mono text-[0.7rem] text-signal-ink">CHALLENGE {String(k + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-[1.25rem] tracking-[-0.02em] text-ink">{c.title}</h3>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-steel">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark" labelledBy="sol-title">
        <SectionHeading id="sol-title" tone="dark" eyebrow="What Trafficomm built" title="The solution" />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line-dark ring-1 ring-line-dark md:grid-cols-2 lg:grid-cols-3">
          {cs.solution.map((s, k) => (
            <li key={s.title} className="bg-ink-2 p-7" data-reveal style={{ "--reveal-delay": `${(k % 3) * 60}ms` } as React.CSSProperties}>
              <span className="font-mono text-[0.7rem] text-signal">{String(k + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-[1.25rem] tracking-[-0.02em] text-white">{s.title}</h3>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-fog">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="white" labelledBy="res-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeading id="res-title" eyebrow="Documented results" title="The outcome" />
            {cs.slug === "mena-agency-ad-operations" && (
              <div className="mt-12 max-w-md" data-reveal>
                <TeamScaleGrid />
              </div>
            )}
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {cs.results.map((r) => (
              <li key={r.title} className="grid gap-2 py-6 sm:grid-cols-[1fr_1.2fr] sm:gap-8" data-reveal>
                <p className="text-[1.3rem] leading-tight tracking-[-0.02em] text-ink">{r.title}</p>
                <p className="text-[0.98rem] leading-relaxed text-steel">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper" labelledBy="con-title">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div data-reveal>
            <Eyebrow>Conclusion</Eyebrow>
            <p id="con-title" className="mt-6 text-h3 text-ink">
              {cs.conclusion}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4 text-steel">Capabilities used</p>
            <LinkList items={svc.map((s) => ({ href: `/services/${s.slug}`, label: s.name, meta: s.scopeLine.join(" · ") }))} />
          </div>
        </div>
      </Section>

      <section className="border-t border-line bg-white">
        <Link href={`/case-studies/${next.slug}`} className="group container-site flex items-center justify-between gap-6 py-12 sm:py-16">
          <span>
            <span className="eyebrow block text-steel">Next case study · {next.category}</span>
            <span className="mt-3 block text-h3 text-ink transition-colors group-hover:text-signal-ink">{next.cardTitle}</span>
          </span>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:translate-x-1">
            <ArrowRight className="size-5" />
          </span>
        </Link>
      </section>

      <CTABand title="Need results like these behind your team?" />
    </>
  );
}

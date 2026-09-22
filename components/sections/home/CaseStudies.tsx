import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { ArrowLink } from "@/components/ui/Button";
import { ConfidentialNote } from "@/components/ui/ConfidentialNote";
import { Lock } from "@/components/ui/Icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { caseStudies } from "@/data/case-studies";

export function CaseStudies({ index = "09" }: { index?: string | null }) {
  const featured = caseStudies.filter((c) => c.slug !== "mena-agency-ad-operations");
  return (
    <Section tone="white" labelledBy="cases-title">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
        <div>
        <p className="mb-6 flex items-center gap-3 font-mono text-[0.95rem] uppercase tracking-[0.14em] text-ink" data-reveal>
          <span className="h-px w-8 bg-signal" aria-hidden="true" />
          Trusted behind the scenes.
        </p>
        <SectionHeading
          id="cases-title"
          index={index ?? undefined}
          eyebrow="Confidential by design"
          title={
            <>
              Documented Results. <span className="block text-steel/70">Confidential Clients.</span>
            </>
          }
        />
        </div>
        <div className="lg:pb-2" data-reveal>
          <p className="text-[1rem] leading-relaxed text-steel">
            Trafficomm often operates behind agencies, ad-tech companies and media organizations, where confidentiality is part of the engagement. We publish what we built and what it achieved — not who we built it for.
          </p>
          <ArrowLink href="/case-studies" className="mt-6">
            All case studies
          </ArrowLink>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-y border-line py-5 md:flex-row md:items-center md:justify-between" data-reveal>
        <p className="eyebrow shrink-0 text-steel">Client register</p>
        <ul className="flex flex-wrap gap-2">
          {caseStudies.map((c) => (
            <li key={c.slug} className="flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-[0.92rem] text-graphite ring-1 ring-line">
              <Lock className="size-3.5 text-steel" />
              {c.client}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {featured.map((cs, i) => (
          <div key={cs.slug} className="flex" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
            <CaseStudyCard cs={cs} className="w-full" />
          </div>
        ))}
      </div>
      <ConfidentialNote className="mt-8" />
    </Section>
  );
}

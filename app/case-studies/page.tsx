import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { CTABand } from "@/components/sections/shared/CTABand";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Lock } from "@/components/ui/Icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { caseStudies } from "@/data/case-studies";
import { confidentialityNote } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies — Documented Operational Results",
  description:
    "Anonymized case studies: scaling ad operations for a MENA agency, data-led performance marketing, 300+ rich media creatives for an ad network, and website monetization for a UAE broadcaster.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  const [flagship, ...rest] = caseStudies;
  return (
    <>
      <PageHero
        crumbs={[{ name: "Case Studies", path: "/case-studies" }]}
        eyebrow="Trusted behind the scenes"
        title={
          <>
            Documented results. <span className="block text-steel/70">Confidential clients.</span>
          </>
        }
        lead="Much of our work happens behind agency and network brands, so we don't publish client names or logos. What we do publish is what we built and what it achieved."
      />
      <Section tone="paper" className="!pt-0">
        <div className="grid gap-4 lg:grid-cols-3">
          <CaseStudyCard cs={flagship} tone="dark" className="lg:col-span-1" />
          {rest.map((cs) => (
            <CaseStudyCard key={cs.slug} cs={cs} />
          ))}
        </div>
      </Section>
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading eyebrow="Our confidentiality standard" title="Discretion is part of the service." />
          <div className="space-y-6 text-[1.05rem] leading-relaxed text-steel" data-reveal>
            <p>
              Agencies and networks trust Trafficomm to operate behind their brand. Protecting those relationships is non-negotiable — which is why every case study on this site is anonymized.
            </p>
            <p>
              Detailed references and deeper walkthroughs can be discussed directly, where client agreements allow.
            </p>
            <p className="flex items-start gap-3 rounded-[var(--radius-card)] bg-paper p-5 text-[0.92rem] text-graphite ring-1 ring-line">
              <Lock className="mt-0.5 shrink-0 text-signal-ink" /> {confidentialityNote}
            </p>
          </div>
        </div>
      </Section>
      <CTABand />
    </>
  );
}

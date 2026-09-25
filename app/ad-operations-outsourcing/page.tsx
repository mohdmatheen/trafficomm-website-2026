import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, serviceSchema } from "@/components/seo/JsonLd";
import { CTABand } from "@/components/sections/shared/CTABand";
import { FAQList } from "@/components/sections/shared/FAQList";
import { LinkList } from "@/components/sections/shared/LinkList";
import { PageHero } from "@/components/sections/shared/PageHero";
import { PressureCascade } from "@/components/sections/shared/PressureCascade";
import { Steps } from "@/components/sections/shared/Steps";
import { AgencyIntegration } from "@/components/service-page/AgencyIntegration";
import { ProofStrip } from "@/components/service-page/ProofStrip";
import { ScopeTable } from "@/components/service-page/ScopeTable";
import { StageChain } from "@/components/service-page/StageChain";
import { ButtonLink } from "@/components/ui/Button";
import { PlatformMark } from "@/components/ui/PlatformMark";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { WorldMap } from "@/components/visualizations/WorldMap";
import {
  agencyOwns,
  comparison,
  definition,
  engagementSteps,
  faqs,
  intro,
  lifecycle,
  pressureResolution,
  pressureTiers,
  relatedLinks,
  scopeGroups,
  trafficommSupports,
} from "@/data/ad-operations-outsourcing";
import { platforms } from "@/data/platforms";
import { buildMetadata } from "@/lib/seo";

const PATH = "/ad-operations-outsourcing";
const TITLE = "Ad Operations Outsourcing for Agencies";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description:
    "Outsourced ad operations for media, performance and digital agencies: campaign setup, trafficking, QA, pacing, optimization support and reporting across Meta, Google Ads, DV360, CM360 and more — as an extension of your team, or white-label.",
  path: PATH,
});

export default function AdOperationsOutsourcingPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Ad Operations Outsourcing", path: PATH }]}
        eyebrow="Ad operations outsourcing"
        title={
          <>
            Ad Operations Outsourcing <span className="block text-steel/70">Built for Agencies That Need to Scale</span>
          </>
        }
        lead="Campaign volume moves in weeks. Headcount moves in quarters. Trafficomm is the execution layer that closes the gap — building, QA'ing, trafficking and reporting on campaigns inside your platforms and your process."
        actions={
          <>
            <ButtonLink href="/contact" size="lg">
              Request an Assessment
            </ButtonLink>
            <ButtonLink href="/contact#call" size="lg" variant="ghost" arrow={false}>
              Talk to Trafficomm
            </ButtonLink>
          </>
        }
        aside={
          // The definition sits in the hero so the answer to "what is this company"
          // is in the first screen, for a reader and for anything extracting from it.
          <div className="rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-line sm:p-8">
            <p className="eyebrow text-steel">In one sentence</p>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-graphite">{definition}</p>
            <p className="mt-6 border-t border-line pt-5 font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.1em] text-steel">
              Operating since 2015 · Agencies, publishers and brands
            </p>
          </div>
        }
      />

      <Section tone="white" labelledBy="what-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <SectionHeading id="what-title" eyebrow="What it is" title={<>What ad operations <span className="block text-steel/70">outsourcing means.</span></>} />
          <div className="space-y-6">
            {intro.map((p) => (
              <p key={p.slice(0, 32)} className="text-[1.08rem] leading-relaxed text-graphite">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="paper" labelledBy="bottleneck-title">
        <SectionHeading
          id="bottleneck-title"
          eyebrow="The operational reality"
          title={
            <>
              When ad operations <span className="block text-steel/70">becomes the bottleneck.</span>
            </>
          }
          lead="Growth rarely breaks strategy. It breaks the hours between a signed plan and a live, correctly tracked campaign."
        />
        <div className="mt-14 max-w-3xl">
          <PressureCascade tiers={pressureTiers} resolution={pressureResolution} label="How campaign growth turns into operational risk" />
        </div>
      </Section>

      <Section tone="dark" labelledBy="lifecycle-title" className="overflow-hidden">
        <div className="grid-bg-dark mask-fade-y pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative">
          <SectionHeading
            id="lifecycle-title"
            tone="dark"
            eyebrow="Scope"
            title={
              <>
                What Trafficomm can take <span className="block text-mute">off your team&apos;s plate.</span>
              </>
            }
            lead="The lifecycle every campaign goes through, and who owns each stage. Campaigns go live on your approval, not automatically."
          />
          <div className="mt-14">
            <StageChain stages={lifecycle} label="Campaign operations lifecycle" tone="dark" inputLabel="Your brief" outputLabel="Back to your team" />
          </div>
          <ScopeTable groups={scopeGroups} />
        </div>
      </Section>

      <Section tone="white" labelledBy="platforms-title">
        <SectionHeading
          id="platforms-title"
          eyebrow="Platforms"
          title={
            <>
              Platforms your team <span className="block text-steel/70">already uses.</span>
            </>
          }
          lead="Campaign experience across the platforms that appear in most media plans. Marks indicate operational experience only — not partnership, certification or endorsement."
        />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/platforms/${p.slug}`}
                className="group flex h-full items-center gap-4 rounded-[var(--radius-card)] bg-paper p-5 ring-1 ring-line transition-shadow hover:shadow-[0_24px_50px_-28px_rgb(0_0_0/0.3)]"
              >
                <PlatformMark slug={p.slug} size={36} className="shrink-0 rounded-[9px]" />
                <span className="min-w-0">
                  <span className="block text-[1.12rem] tracking-[-0.02em] text-ink">{p.name}</span>
                  <span className="mt-0.5 block truncate text-[0.84rem] text-steel">{p.short}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" labelledBy="compare-title">
        <SectionHeading
          id="compare-title"
          eyebrow="The trade-off"
          title={
            <>
              In-house vs <span className="block text-steel/70">outsourced ad operations.</span>
            </>
          }
          lead="Neither model is better in the abstract. They differ in how capacity behaves when volume changes."
        />
        <div className="mt-12 overflow-hidden rounded-[var(--radius-panel)] ring-1 ring-line" data-reveal>
          <div className="hidden bg-white md:grid md:grid-cols-[11rem_1fr_1fr]">
            <span className="eyebrow border-b border-line px-6 py-4 text-steel" />
            <span className="eyebrow border-b border-l border-line px-6 py-4 text-steel">In-house only</span>
            <span className="eyebrow border-b border-l border-line px-6 py-4 text-signal-ink">With an operations partner</span>
          </div>
          <dl className="divide-y divide-line bg-white">
            {comparison.map((row) => (
              <div key={row.dimension} className="grid gap-2 p-6 md:grid-cols-[11rem_1fr_1fr] md:gap-0 md:p-0">
                <dt className="eyebrow text-ink md:border-line md:px-6 md:py-5">{row.dimension}</dt>
                <dd className="text-[0.98rem] leading-relaxed text-steel md:border-l md:border-line md:px-6 md:py-5">
                  <span className="eyebrow mb-1 block text-steel md:hidden">In-house only</span>
                  {row.inHouse}
                </dd>
                <dd className="text-[0.98rem] leading-relaxed text-graphite md:border-l md:border-line md:px-6 md:py-5">
                  <span className="eyebrow mb-1 block text-signal-ink md:hidden">With an operations partner</span>
                  {row.outsourced}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="white" labelledBy="workflow-title">
        <SectionHeading
          id="workflow-title"
          eyebrow="Working model"
          title={
            <>
              Built for <span className="block text-steel/70">agency workflows.</span>
            </>
          }
          lead="Trafficomm operates inside your platform access, naming conventions, approval steps and reporting templates — and, where an agency needs it, entirely behind your brand."
        />
        <div className="mt-12">
          <AgencyIntegration agencyOwns={agencyOwns} trafficommSupports={trafficommSupports} />
        </div>
        <p className="mt-8 max-w-3xl text-[1.02rem] leading-relaxed text-steel">
          In a white-label model, output reaches the end client as your team&apos;s own work. Process, naming and QA steps are documented so the standard survives staff
          changes on either side, and communication runs through the channels your team already uses rather than a separate system.
        </p>
      </Section>

      <ProofStrip note="Company-wide operating scale since 2015. These are historical totals and peaks, not current monthly volumes, current team size or current client numbers." />

      <Section tone="paper" labelledBy="markets-title" className="overflow-hidden">
        <SectionHeading
          id="markets-title"
          eyebrow="Markets supported"
          title={
            <>
              GCC and global <span className="block text-steel/70">campaign experience.</span>
            </>
          }
          lead="Documented campaign experience across Saudi Arabia, the UAE, Qatar, Kuwait, Lebanon and Australia — delivered by one centralized operations team, not offices in each market."
        />
        <div className="mt-14">
          <WorldMap />
        </div>
      </Section>

      <Section tone="white" labelledBy="engagement-title">
        <SectionHeading
          id="engagement-title"
          eyebrow="Engagement"
          title={
            <>
              How engagement <span className="block text-steel/70">works.</span>
            </>
          }
          lead="Scope is agreed stage by stage. Most agencies start with one platform or one workload rather than the whole operation."
        />
        <div className="mt-12">
          <Steps steps={[...engagementSteps]} />
        </div>
      </Section>

      <Section tone="paper" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading id="faq-title" eyebrow="Questions" title={<>Ad operations <span className="block text-steel/70">outsourcing, answered.</span></>} />
          <div>
            <FAQList faqs={faqs} />
            <div className="mt-14">
              <Eyebrow className="mb-5">Related</Eyebrow>
              <LinkList items={[...relatedLinks]} />
            </div>
          </div>
        </div>
      </Section>

      <CTABand
        eyebrow="Start with an assessment"
        title="Where are your operational hours going?"
        body="Request an assessment and we'll map where campaign setup, QA, optimization and reporting time is spent today — and which of it is worth moving."
      />

      <JsonLd
        data={serviceSchema({
          name: "Ad Operations Outsourcing",
          serviceType: "Ad operations outsourcing",
          description:
            "Outsourced ad operations for agencies and advertising teams: campaign setup, trafficking, QA, pacing, optimization support, measurement and reporting, delivered as an extension of an internal team or in a white-label model.",
          path: PATH,
        })}
      />
    </>
  );
}

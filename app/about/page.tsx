import type { Metadata } from "next";
import { CTABand } from "@/components/sections/shared/CTABand";
import { PageHero } from "@/components/sections/shared/PageHero";
import { GlobalExperience } from "@/components/sections/home/GlobalExperience";
import { ButtonLink } from "@/components/ui/Button";
import { Metric } from "@/components/ui/Metric";
import { Section, SectionHeading } from "@/components/ui/Section";
import { company, scaleStats } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Founded in 2015, Trafficomm is a digital advertising operations and performance operations company working behind agencies, ad-tech companies, publishers and brands.",
  path: "/about",
});

const serve = [
  { who: "Media & advertising agencies", what: "Execution, QA, programmatic and reporting capacity behind planning and client teams." },
  { who: "Performance agencies", what: "Campaign architects and optimizers working inside client accounts." },
  { who: "Ad networks & ad-tech companies", what: "Trafficking, creative services and platform support." },
  { who: "Publishers", what: "Inventory frameworks, ad-server integration, campaign management and billing reporting." },
  { who: "Brands", what: "Operational depth behind in-house marketing teams." },
];

const beliefs = [
  { title: "Behind the campaign, not in front of it", body: "We make our partners' offers stronger. Client relationships stay with them." },
  { title: "Operations is a discipline", body: "Setup, QA, monitoring and reporting deserve the same rigor as strategy. Done well, they create the room for better performance." },
  { title: "Scale needs structure", body: "Growth that relies on individual heroics breaks. Growth built on defined roles, SLAs and QA compounds." },
  { title: "People make the decisions", body: "Automation accelerates analysis. Experienced operators decide what to change." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow={`About · Since ${company.founded}`}
        title={
          <>
            We understand what happens <span className="block text-steel/70">behind the campaigns.</span>
          </>
        }
        lead={`${company.legalName} was founded in ${company.founded} to do one thing exceptionally well: run the operational work behind digital advertising. Today we are the performance operations layer behind agencies, ad-tech companies, publishers and brands.`}
      />

      <Section tone="white" labelledBy="story-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading id="story-title" eyebrow="Our story" title="From outsourced ad operations to performance operations." />
          <div className="space-y-6 text-[1.08rem] leading-relaxed text-graphite" data-reveal>
            <p>
              Trafficomm was built as a specialist ad operations partner: trafficking campaigns, auditing creatives, troubleshooting tags and producing the reports that agencies and publishers depend on.
            </p>
            <p>
              As media plans spread across more platforms, markets and formats, the work behind them grew more complex. Our scope grew with it — into performance marketing, programmatic operations, measurement, rich media production and publisher monetization.
            </p>
            <p>
              What has not changed is how we work: behind our partners, inside their tools, with structured teams, agreed SLAs and quality assurance as a dedicated function.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="paper" labelledBy="about-scale">
        <SectionHeading id="about-scale" eyebrow="By the numbers" title="Built through execution." />
        <dl className="mt-14 grid grid-cols-2 border-l border-t border-line md:grid-cols-3 lg:grid-cols-6">
          {scaleStats.map((s) => (
            <div key={s.label} className="flex flex-col border-b border-r border-line bg-white p-5 sm:p-6">
              <dt className="eyebrow order-2 mt-3 !text-[0.62rem] text-steel">{s.label}</dt>
              <dd className="order-1 whitespace-nowrap text-[clamp(2rem,1.4rem+1.6vw,3rem)] leading-none tracking-[-0.045em] text-ink">
                <Metric stat={s} />
              </dd>
              {s.detail && <dd className="order-3 mt-2 text-[0.8rem] leading-snug text-steel">{s.detail}</dd>}
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="white" labelledBy="serve-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading id="serve-title" eyebrow="Who we serve" title="Partners who need operations to scale." />
          <ul className="divide-y divide-line border-y border-line">
            {serve.map((s) => (
              <li key={s.who} className="grid gap-2 py-5 sm:grid-cols-[1fr_1.3fr] sm:gap-8" data-reveal>
                <p className="text-[1.2rem] tracking-[-0.015em] text-ink">{s.who}</p>
                <p className="text-[0.96rem] leading-relaxed text-steel">{s.what}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="dark" labelledBy="belief-title">
        <SectionHeading id="belief-title" tone="dark" eyebrow="What we believe" title="Principles that shape the work." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line-dark ring-1 ring-line-dark md:grid-cols-2">
          {beliefs.map((b, i) => (
            <div key={b.title} className="bg-ink-2 p-7 sm:p-9" data-reveal>
              <span className="font-mono text-[0.7rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-h3 text-white">{b.title}</h3>
              <p className="mt-3 text-[1rem] leading-relaxed text-fog">{b.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <ButtonLink href="/how-we-work" variant="outline-dark">
            See how we work
          </ButtonLink>
        </div>
      </Section>

      <GlobalExperience index={null} />
      <CTABand title="Talk to the team behind the campaigns." />
    </>
  );
}

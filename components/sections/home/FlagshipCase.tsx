import { Badge } from "@/components/ui/Badge";
import { Metric } from "@/components/ui/Metric";
import { ButtonLink } from "@/components/ui/Button";
import { ConfidentialNote } from "@/components/ui/ConfidentialNote";
import { Section, SectionHeading } from "@/components/ui/Section";
import { TeamScaleGrid } from "@/components/visualizations/TeamScaleGrid";
import { getCaseStudy } from "@/data/case-studies";
import { caseMetrics as cm } from "@/data/metrics";

const challenges = ["Distributed teams", "Resource dependency", "Execution bottlenecks", "QA consistency", "Talent acquisition & retention"];
const model = ["Centralized operations", "Dedicated account management", "Structured task allocation", "Dedicated QA", "SLA-driven delivery", "Centralized workflow"];

function StageLabel({ n, label }: { n: string; label: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[0.77rem] uppercase tracking-[0.12em]">
      <span className="flex size-6 items-center justify-center rounded-full bg-ink text-[0.66rem] text-white">{n}</span>
      <span className="text-graphite">{label}</span>
    </p>
  );
}

export function FlagshipCase({
  index = "05",
  eyebrow,
  context,
  compact = false,
}: {
  index?: string | null;
  eyebrow?: string;
  context?: string;
  /** Service pages show the documented figures only; the homepage tells the full story. */
  compact?: boolean;
}) {
  const cs = getCaseStudy("mena-agency-ad-operations")!;
  return (
    <Section tone="white" labelledBy="flagship-title">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <div className="mb-8 flex flex-wrap gap-2">
            <Badge tone="signal">Flagship case study</Badge>
            <Badge>
              {cs.category} · {cs.market}
            </Badge>
          </div>
          <SectionHeading
            id="flagship-title"
            index={index ?? undefined}
            eyebrow={eyebrow ?? cs.client}
            title={
              <>
                From 4 Specialists <span className="block text-steel/70">to ~30.</span>
              </>
            }
            lead={context ?? cs.subtitle}
          />
        </div>
        <div className="lg:pb-2" data-reveal>
          <ConfidentialNote />
          <ButtonLink href={`/case-studies/${cs.slug}`} variant="secondary" className="mt-6">
            View Case Study
          </ButtonLink>
        </div>
      </div>

      {!compact && (
        <>
      {/* Story: challenge → model → scale */}
      <ol className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line ring-1 ring-line lg:grid-cols-3" aria-label="How the engagement unfolded">
        <li className="relative bg-paper p-6 sm:p-8" data-reveal>
          <StageLabel n="1" label="Client challenge" />
          <p className="mt-5 text-[1.03rem] leading-relaxed text-steel">An agency operating from approximately 12 offices across MENA.</p>
          <ul className="mt-5 space-y-2">
            {challenges.map((c) => (
              <li key={c} className="flex items-center gap-3 text-[1.03rem] text-ink">
                <span className="size-1.5 rounded-full border border-signal-ink" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
          <span className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-signal ring-1 ring-line lg:flex" aria-hidden="true">
            →
          </span>
        </li>
        <li className="relative bg-ink p-6 text-white sm:p-8" data-reveal style={{ "--reveal-delay": "90ms" } as React.CSSProperties}>
          <p className="flex items-center gap-3 font-mono text-[0.77rem] uppercase tracking-[0.12em]">
            <span className="flex size-6 items-center justify-center rounded-full bg-signal-cta text-[0.66rem] text-white">2</span>
            <span className="text-fog">Trafficomm operating model</span>
          </p>
          <ul className="mt-5 grid gap-2">
            {model.map((m) => (
              <li key={m} className="flex items-center justify-between rounded-md bg-white/[0.05] px-3 py-2 text-[1.0rem] ring-1 ring-inset ring-line-dark">
                {m}
                <span className="size-1 rounded-full bg-signal" aria-hidden="true" />
              </li>
            ))}
          </ul>
          <span className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-signal ring-1 ring-line lg:flex" aria-hidden="true">
            →
          </span>
        </li>
        <li className="bg-paper p-6 sm:p-8" data-reveal style={{ "--reveal-delay": "180ms" } as React.CSSProperties}>
          <StageLabel n="3" label="Scale" />
          <p className="mt-5 text-[1.03rem] leading-relaxed text-steel">The dedicated team scaled as the agency&apos;s operational requirements grew.</p>
          <div className="mt-6">
            <TeamScaleGrid />
          </div>
        </li>
      </ol>
        </>
      )}

      {/* Documented results */}
      <div className="mt-16">
        <StageLabel n="4" label="Documented results" />
        <dl className="mt-8 grid border-t border-line md:grid-cols-2">
          {[
            { v: cm.menaCost.value, l: cm.menaCost.label },
            { v: cm.menaQuality.value, l: cm.menaQuality.label },
          ].map((m, i) => (
            <div key={m.l} className={`flex flex-col py-8 md:py-10 ${i === 0 ? "md:border-r md:border-line md:pr-10" : "border-t border-line md:border-t-0 md:pl-10"}`} data-reveal>
              <dt className="eyebrow order-2 mt-5 text-graphite">{m.l}</dt>
              <dd className="order-1 whitespace-nowrap text-[clamp(4.5rem,2rem+9vw,10.5rem)] leading-[0.85] tracking-[-0.06em] text-signal"><Metric value={m.v} /></dd>
            </div>
          ))}
        </dl>
        <dl className="grid border-y border-line sm:grid-cols-2">
          {[
            { v: cm.menaTeam.value, l: cm.menaTeam.label },
            { v: cm.menaPartnership.value, l: cm.menaPartnership.label },
          ].map((m, i) => (
            <div key={m.l} className={`flex flex-col py-7 ${i === 0 ? "sm:border-r sm:border-line sm:pr-10" : "border-t border-line sm:border-t-0 sm:pl-10"}`} data-reveal>
              <dt className="eyebrow order-2 mt-3 text-steel">{m.l}</dt>
              <dd className="order-1 whitespace-nowrap text-[clamp(2.6rem,1.6rem+3vw,4.5rem)] leading-none tracking-[-0.05em] text-ink"><Metric value={m.v} /></dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[0.88rem] text-steel">{cm.menaTeam.copy}</p>
      </div>
    </Section>
  );
}

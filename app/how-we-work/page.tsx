import type { Metadata } from "next";
import { CTABand } from "@/components/sections/shared/CTABand";
import { PageHero } from "@/components/sections/shared/PageHero";
import { AIOperations } from "@/components/sections/home/AIOperations";
import { EngineSection } from "@/components/sections/home/EngineSection";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProcessFlow } from "@/components/visualizations/ProcessFlow";
import { indicativeTransition, transitionPhases } from "@/data/operations";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How We Work — Transition, Team Structure & Quality",
  description:
    "How Trafficomm takes over and runs ad operations: phased transition, dedicated account management, structured task allocation, SLA management and a dedicated QA layer.",
  path: "/how-we-work",
});

const structure = [
  { role: "Account manager", body: "Your primary point of contact. Owns deliverables, SLAs, prioritization and escalation." },
  { role: "Operations specialists", body: "Platform-trained specialists who set up, traffic, monitor, optimize and report — with work allocated by the account manager." },
  { role: "Dedicated QA", body: "An independent quality layer that checks builds, creatives and tags before they go live." },
];

const principles = [
  { title: "Structure over heroics", body: "Work is allocated across a structured team, so delivery never depends on one person." },
  { title: "Quality is a function", body: "QA is a separate step with separate people — not the builder checking their own work." },
  { title: "Your tools, your standards", body: "We operate inside your ad servers, platforms and ticketing, using your naming conventions and templates." },
  { title: "Transparent reporting", body: "You see what was delivered, when and to what standard — the operation itself is reported, not just the campaigns." },
  { title: "Confidential by default", body: "We work behind your brand and do not publicize client relationships." },
  { title: "SLAs, agreed up front", body: "Turnaround expectations by task type are defined at the start of every engagement and managed by the account manager." },
];

export default function HowWeWorkPage() {
  const totalDays = indicativeTransition.reduce((n, p) => n + p.days, 0);
  return (
    <>
      <PageHero
        crumbs={[{ name: "How We Work", path: "/how-we-work" }]}
        eyebrow="How we work"
        title={
          <>
            A structured operation. <span className="block text-steel/70">Not a pool of freelancers.</span>
          </>
        }
        lead="Trafficomm engagements run on a defined team structure, a phased transition model and a dedicated quality layer — so you can hand over operational work with confidence and scale it over time."
        actions={
          <ButtonLink href="/contact" size="lg">
            Request an Operations Assessment
          </ButtonLink>
        }
      />

      <Section tone="white" labelledBy="team-title">
        <SectionHeading
          id="team-title"
          eyebrow="Team structure"
          title={
            <>
              Accountability built <span className="block text-steel/70">into the org chart.</span>
            </>
          }
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-3" data-reveal>
          {structure.map((s, i) => (
            <div key={s.role} className={`relative rounded-[var(--radius-panel)] p-7 sm:p-9 ${i === 0 ? "bg-ink text-white" : "bg-paper ring-1 ring-line"}`}>
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[0.7rem] ${i === 0 ? "text-signal" : "text-signal-ink"}`}>L{i + 1}</span>
                {i === 0 && <LogoMark className="w-6" inverted />}
              </div>
              <h3 className={`mt-8 text-h3 ${i === 0 ? "text-white" : "text-ink"}`}>{s.role}</h3>
              <p className={`mt-3 text-[0.98rem] leading-relaxed ${i === 0 ? "text-fog" : "text-steel"}`}>{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="paper" labelledBy="transition-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeading
              id="transition-title"
              eyebrow="Transition model"
              title={
                <>
                  Handover in waves. <span className="block text-steel/70">Never a cliff edge.</span>
                </>
              }
              lead="Business areas are sequenced by complexity, business criticality and ease of transition, then moved in two waves."
            />
            <div className="mt-10 grid grid-cols-2 gap-3" data-reveal>
              <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line">
                <p className="eyebrow text-signal-ink">Wave 1</p>
                <ul className="mt-4 space-y-2 text-[0.94rem] text-graphite">
                  <li>Account structure</li>
                  <li>Ad ops process &amp; guidelines</li>
                </ul>
              </div>
              <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line">
                <p className="eyebrow text-steel">Wave 2</p>
                <ul className="mt-4 space-y-2 text-[0.94rem] text-graphite">
                  <li>Reporting templates &amp; guidelines</li>
                  <li>Support management</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <ol className="divide-y divide-line border-y border-line">
              {transitionPhases.map((p, i) => (
                <li key={p.code} className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-8" data-reveal>
                  <span className="font-mono text-[0.72rem] text-signal-ink">
                    {String(i + 1).padStart(2, "0")} · {p.code}
                  </span>
                  <div>
                    <p className="text-[1.3rem] tracking-[-0.02em] text-ink">{p.label}</p>
                    <p className="mt-2 text-[0.96rem] leading-relaxed text-steel">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <figure className="mt-10 rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-line" data-reveal>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="eyebrow text-steel">Indicative plan · Wave 1 · Account structure</span>
                <span className="font-mono text-[0.72rem] text-ink">{totalDays} days total</span>
              </figcaption>
              <div className="mt-5 flex h-10 overflow-hidden rounded-lg" role="img" aria-label={indicativeTransition.map((p) => `${p.code}: ${p.days} day${p.days > 1 ? "s" : ""}`).join(", ")}>
                {indicativeTransition.map((p, i) => (
                  <div
                    key={p.code}
                    className="flex items-center justify-center border-r border-white font-mono text-[0.66rem] uppercase tracking-[0.06em] text-white last:border-0"
                    style={{ width: `${(p.days / totalDays) * 100}%`, background: i === indicativeTransition.length - 1 ? "#d93632" : `rgb(12 12 13 / ${0.55 + i * 0.15})` }}
                  >
                    <span className="truncate px-1">{p.days}d</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex text-[0.72rem] text-steel">
                {indicativeTransition.map((p) => (
                  <span key={p.code} style={{ width: `${(p.days / totalDays) * 100}%` }} className="truncate pr-1">
                    {p.code}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-[0.8rem] leading-relaxed text-steel">Indicative only. Actual transition plans are set per business area and depend on scope and complexity.</p>
            </figure>
          </div>
        </div>
      </Section>

      <Section tone="white" labelledBy="flow-title">
        <SectionHeading id="flow-title" eyebrow="Process flows" title="What happens to a campaign request" />
        <div className="mt-12">
          <ProcessFlow />
        </div>
      </Section>

      <EngineSection index={null} />

      <Section tone="paper" labelledBy="principles-title">
        <SectionHeading id="principles-title" eyebrow="Operating principles" title="How we hold ourselves accountable" />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p.title} className="bg-white p-7" data-reveal style={{ "--reveal-delay": `${(i % 3) * 60}ms` } as React.CSSProperties}>
              <span className="font-mono text-[0.7rem] text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-[1.25rem] tracking-[-0.02em] text-ink">{p.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-steel">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <AIOperations index={null} />
      <CTABand />
    </>
  );
}

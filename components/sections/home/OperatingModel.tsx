import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { Section, SectionHeading } from "@/components/ui/Section";

const agency = ["Strategy", "Media planning", "Client relationships"];
const trafficomm = ["Campaign execution", "QA", "Programmatic", "Optimization", "Measurement", "Reporting"];
// Concrete operating commitments rather than abstract pillars; the full model lives on How We Work.
const commitments = ["Your tools and naming conventions", "Accountable account manager", "QA separate from the build", "Reporting in your templates"];

function Arrow({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <svg viewBox="0 0 24 44" className="mx-auto h-11 w-6" aria-hidden="true">
      <path d="M12 0v36" stroke="#ea3e3a" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" />
      <path d="m6 32 6 8 6-8" fill="none" stroke="#ea3e3a" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 64 24" className="h-6 w-16" aria-hidden="true">
      <path d="M0 12h56" stroke="#ea3e3a" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" />
      <path d="m52 6 8 6-8 6" fill="none" stroke="#ea3e3a" strokeWidth="1.5" />
    </svg>
  );
}

export function OperatingModel({ index = "06" }: { index?: string | null }) {
  return (
    <Section tone="paper" labelledBy="model-title">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
        <SectionHeading
          id="model-title"
          index={index ?? undefined}
          eyebrow="Agency operating model"
          title={
            <>
              Scale the Business. <span className="block text-steel/70">Not the Operational Overhead.</span>
            </>
          }
        />
        <p className="text-[1rem] leading-relaxed text-steel lg:pb-2" data-reveal>
          Trafficomm works as an extension of your media team — behind it, not in front of your clients. You keep strategy and relationships; a specialized operations team carries the execution load.
        </p>
      </div>

      <div className="mt-16 grid items-stretch gap-0 lg:grid-cols-[1.4fr_auto_minmax(0,0.85fr)]" data-reveal>
        {/* Extended media team boundary */}
        <div className="relative rounded-[var(--radius-panel)] border border-dashed border-line-strong p-3 pt-10 sm:p-4 sm:pt-11">
          <span className="eyebrow absolute left-5 top-4 !text-[0.68rem] text-steel">Your extended media team</span>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1.25fr] md:items-stretch">
            <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
              <p className="eyebrow text-steel">Agency</p>
              <p className="mt-3 text-h3 text-ink">Owns the client.</p>
              <ul className="mt-6 space-y-2">
                {agency.map((a) => (
                  <li key={a} className="flex items-center gap-3 border-t border-line pt-2 text-[1.04rem] text-graphite">
                    <span className="size-1.5 rounded-full bg-ink" aria-hidden="true" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <span className="hidden md:block">
                <Arrow />
              </span>
              <span className="md:hidden">
                <Arrow vertical />
              </span>
            </div>
            <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-6 text-white">
              <div className="grid-bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-signal">Trafficomm</p>
                  <LogoMark className="w-7" inverted />
                </div>
                <p className="mt-3 text-h3">Runs the operation.</p>
                <ul className="mt-6 grid grid-cols-2 gap-2">
                  {trafficomm.map((t) => (
                    <li key={t} className="rounded-md bg-white/[0.06] px-3 py-2.5 text-[0.96rem] text-fog ring-1 ring-inset ring-line-dark">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-2 lg:px-4 lg:py-0">
          <span className="hidden lg:block">
            <Arrow />
          </span>
          <span className="lg:hidden">
            <Arrow vertical />
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-line sm:p-8">
          <div>
            <p className="eyebrow text-signal-ink">Outcome</p>
            <p className="mt-3 text-h3 text-ink">Scalable operational capacity.</p>
            <p className="mt-4 text-[1.03rem] leading-relaxed text-steel">
              Take on more clients, markets and campaigns with a specialized team that scales with your workload.
            </p>
          </div>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {commitments.map((c) => (
              <li key={c} className="flex items-center gap-3 py-2.5 text-[0.96rem] text-ink">
                <span className="h-px w-3 bg-signal" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/how-we-work" variant="ghost">
          See How We Work
        </ButtonLink>
        <ButtonLink href="/solutions/white-label-ad-operations" variant="ghost">
          See the White-Label Model
        </ButtonLink>
      </div>
    </Section>
  );
}

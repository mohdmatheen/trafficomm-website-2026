import { LogoMark } from "@/components/ui/Logo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

type Stage = { n: string; title: string; items: readonly string[]; tone: "base" | "mid" | "risk" };

/**
 * Three stages of the same story, so the reader gets cause → pressure →
 * consequence before Trafficomm is named. Deliberately nouns, not sentences:
 * the diagram has to be legible in a few seconds, and prose in four columns
 * is not.
 */
const stages: readonly Stage[] = [
  { n: "01", title: "Growth", tone: "base", items: ["More campaigns", "More markets", "More platforms", "More creatives"] },
  {
    n: "02",
    title: "Operational pressure",
    tone: "mid",
    items: ["Campaign setup", "Trafficking", "QA", "Pacing", "Optimization", "Reporting", "Coordination"],
  },
  {
    n: "03",
    title: "What starts to break",
    tone: "risk",
    items: ["Execution bottlenecks", "Slower campaign changes", "Inconsistent QA", "Reporting pressure", "Internal team dependency"],
  },
];

/**
 * Dashed red connector, matching the arrows already used in the operating-model
 * section. `vertical` is the mobile / stage-04 direction; the horizontal form
 * only appears once the stages sit side by side.
 */
function Connector({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <svg viewBox="0 0 24 40" className="h-10 w-6" aria-hidden="true" focusable="false">
      <path d="M12 0v30" stroke="#ea3e3a" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" />
      <path d="m6 27 6 8 6-8" fill="none" stroke="#ea3e3a" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 40 24" className="h-6 w-10" aria-hidden="true" focusable="false">
      <path d="M0 12h30" stroke="#ea3e3a" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" />
      <path d="m27 6 8 6-8 6" fill="none" stroke="#ea3e3a" strokeWidth="1.5" />
    </svg>
  );
}

export function OperatingPressure() {
  return (
    <Section tone="paper" labelledBy="pressure-title">
      <SectionHeading
        id="pressure-title"
        index="02"
        eyebrow="The operational problem"
        title={
          <>
            When Agencies Grow, <span className="block text-steel/70">Operations Become the Bottleneck.</span>
          </>
        }
        lead="Every new client, market and platform adds setup, QA, monitoring and reporting behind it. The work grows faster than the team absorbing it."
      />

      <ol className="mt-14 grid gap-y-10 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-0" aria-label="How agency growth turns into operational pressure">
        {stages.map((stage, i) => (
          <li
            key={stage.title}
            className="relative flex flex-col"
            data-reveal
            style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
          >
            {/* Sits in the grid gap: above the card when stacked, to its left once the stages are in a row. */}
            {i > 0 && (
              <span
                className="pointer-events-none absolute -top-10 left-1/2 flex h-10 -translate-x-1/2 items-center justify-center lg:-left-14 lg:top-0 lg:h-full lg:w-14 lg:translate-x-0"
                aria-hidden="true"
              >
                <span className="lg:hidden">
                  <Connector vertical />
                </span>
                <span className="hidden lg:block">
                  <Connector />
                </span>
              </span>
            )}

            <div
              className={cn(
                "flex h-full flex-col rounded-[var(--radius-card)] p-6 sm:p-7",
                stage.tone === "base" && "bg-white ring-1 ring-line",
                stage.tone === "mid" && "bg-ink/[0.055] ring-1 ring-line",
                stage.tone === "risk" && "bg-signal-soft ring-1 ring-signal/30",
              )}
            >
              <p className="flex items-baseline gap-2.5 font-mono text-[0.77rem] uppercase tracking-[0.12em]">
                <span className={stage.tone === "risk" ? "text-signal-ink" : "text-signal"}>{stage.n}</span>
                <span className={cn("h-px w-4 translate-y-[-0.2em]", stage.tone === "risk" ? "bg-signal/40" : "bg-line-strong")} aria-hidden="true" />
                <span className={stage.tone === "risk" ? "text-signal-ink" : "text-graphite"}>{stage.title}</span>
              </p>
              <ul className="mt-5 space-y-2.5">
                {stage.items.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-start gap-3 text-[1.02rem] leading-snug tracking-[-0.01em]",
                      stage.tone === "risk" ? "text-signal-ink" : "text-ink",
                    )}
                  >
                    <span
                      className={cn("mt-[0.62em] h-px w-2.5 shrink-0", stage.tone === "risk" ? "bg-signal" : "bg-signal/70")}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex justify-center lg:mt-10 lg:justify-start" aria-hidden="true">
        <Connector vertical />
      </div>

      {/* Stage 04 is the resolution, so it is the only element here that inverts. */}
      <div className="relative mt-2 overflow-hidden rounded-[var(--radius-card)] bg-ink p-7 text-white sm:p-10" data-reveal>
        <div className="grid-bg-dark absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          <div>
            <p className="flex items-baseline gap-2.5 font-mono text-[0.77rem] uppercase tracking-[0.12em]">
              <span className="text-signal">04</span>
              <span className="h-px w-4 translate-y-[-0.2em] bg-line-dark-strong" aria-hidden="true" />
              <span className="flex items-center gap-2 text-white">
                <LogoMark className="w-3.5" inverted />
                Trafficomm
              </span>
            </p>
            <p className="mt-4 text-h3 text-white">Performance operations behind your media team.</p>
          </div>
          <p className="text-[1.03rem] leading-relaxed text-fog">
            Trafficomm adds the execution capacity, platform expertise and operating structure agencies need without rebuilding
            their internal delivery teams for every increase in workload.
          </p>
        </div>
      </div>
    </Section>
  );
}

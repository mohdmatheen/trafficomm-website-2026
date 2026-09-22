import { LogoMark } from "@/components/ui/Logo";
import type { ServiceSystem } from "@/data/service-depth";

type Props = Extract<ServiceSystem, { kind: "optimization" }>;

/**
 * Performance optimization system: the levers examined, the KPI they are
 * judged against, and the evidence loop that decides what changes.
 */
export function OptimizationSystem({ levers, kpis, loop, note }: Pick<Props, "levers" | "kpis" | "loop" | "note">) {
  return (
    <div className="space-y-4">
      {/* Levers → KPI */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_auto_1fr] lg:items-stretch" data-reveal>
        <div className="rounded-[var(--radius-panel)] bg-ink-2 p-6 ring-1 ring-line-dark sm:p-8">
          <p className="eyebrow text-mute">What Trafficomm examines</p>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-lg bg-line-dark sm:grid-cols-2 xl:grid-cols-3">
            {levers.map((l) => (
              <li key={l.label} className="bg-ink-2 p-4">
                <p className="text-[1.05rem] tracking-[-0.01em] text-white">{l.label}</p>
                <p className="mt-1 text-[0.88rem] leading-snug text-fog">{l.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center" aria-hidden="true">
          <span className="flex size-10 items-center justify-center rounded-full bg-ink-3 font-mono text-signal ring-1 ring-line-dark lg:rotate-0">
            <span className="lg:hidden">↓</span>
            <span className="hidden lg:inline">→</span>
          </span>
        </div>
        <div className="flex flex-col justify-between rounded-[var(--radius-panel)] bg-white p-6 text-ink sm:p-8">
          <div>
            <p className="eyebrow text-steel">Judged against</p>
            <p className="mt-3 text-h3">The KPI your client is measured on.</p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Typical KPIs">
            {kpis.map((k) => (
              <li key={k} className="rounded-md bg-paper px-3 py-2 font-mono text-[0.82rem] uppercase tracking-[0.1em] text-ink ring-1 ring-line">
                {k}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evidence loop */}
      <div className="rounded-[var(--radius-panel)] bg-ink-2 p-6 ring-1 ring-line-dark sm:p-8" data-reveal>
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow text-mute">The optimization loop</p>
          <LogoMark className="w-6" inverted />
        </div>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-lg bg-line-dark sm:grid-cols-2 lg:grid-cols-7" aria-label="Optimization loop">
          {loop.map((s, i) => (
            <li key={s.label} className="relative bg-ink-2 p-4">
              <span className="font-mono text-[0.7rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-[1.02rem] tracking-[-0.01em] text-white">{s.label}</p>
              <p className="mt-1.5 text-[0.86rem] leading-snug text-fog">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 hidden items-center gap-3 lg:flex" aria-hidden="true">
          <span className="h-4 w-px bg-line-dark-strong" />
          <span className="h-px flex-1 border-t border-dashed border-line-dark-strong" />
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-mute">Learnings feed the next hypothesis</span>
          <span className="h-px flex-1 border-t border-dashed border-line-dark-strong" />
          <span className="h-4 w-px bg-line-dark-strong" />
        </div>
        <p className="mt-6 text-[0.86rem] leading-relaxed text-mute">{note}</p>
      </div>
    </div>
  );
}

import type { ServicePageContent } from "@/data/service-pages/types";

type Gate = NonNullable<ServicePageContent["qaGates"]>["gates"][number];

/**
 * Five QA gates on one track. A signal passes through each gate in turn
 * (CSS-only; static under reduced motion) and each gate lists its checks.
 */
export function QAGates({ gates }: { gates: readonly Gate[] }) {
  const n = gates.length;
  const cycle = n * 1.4;
  return (
    <div>
      {/* Desktop track */}
      <div className="relative hidden h-16 lg:block" aria-hidden="true">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-line-strong" />
        <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_0_5px_rgb(234_62_58/0.18)] [animation:gate-travel_var(--cycle)_linear_infinite]" style={{ "--cycle": `${cycle}s` } as React.CSSProperties} />
        {gates.map((g, i) => (
          <span key={g.code} className="absolute top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-ink" style={{ left: `${((i + 0.5) / n) * 100}%` }}>
            <span className="absolute inset-0 rounded-full bg-signal opacity-0 [animation:gate-flash_var(--cycle)_linear_infinite]" style={{ "--cycle": `${cycle}s`, animationDelay: `${((i + 0.5) / n) * cycle - cycle}s` } as React.CSSProperties} />
          </span>
        ))}
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:mt-6 lg:grid-cols-5 lg:gap-4" aria-label="QA gates">
        {gates.map((g, i) => (
          <li key={g.code} className="relative rounded-[var(--radius-card)] bg-paper p-5 ring-1 ring-line" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-signal-ink">{g.code}</p>
            <h3 className="mt-3 text-[1.3rem] tracking-[-0.02em] text-ink">{g.title}</h3>
            <ul className="mt-4 space-y-2 border-t border-line pt-4">
              {g.checks.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-[0.98rem] text-graphite">
                  <span className="flex size-4 items-center justify-center rounded-sm border border-ink/30 text-[0.6rem] text-ink" aria-hidden="true">
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

import type { ServiceSystem } from "@/data/service-depth";

type Props = Extract<ServiceSystem, { kind: "split" }>;

function Side({ s }: { s: Props["sides"][number] }) {
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-panel)] bg-ink-2 p-6 ring-1 ring-line-dark sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-white font-mono text-[0.8rem] text-ink">{s.code}</span>
        <h3 className="text-h3 text-white">{s.label}</h3>
      </div>
      <p className="mt-4 text-[0.98rem] leading-relaxed text-fog">{s.summary}</p>
      <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-mute">
        {s.flow.map((f, i) => (
          <span key={f} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-signal" aria-hidden="true">
                →
              </span>
            )}
            {f}
          </span>
        ))}
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {s.items.map((it) => (
          <li key={it} className="rounded-md bg-white/[0.06] px-3 py-2 text-[0.94rem] text-fog ring-1 ring-inset ring-line-dark">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Two connected capabilities, visually separate, joined by the technical steps they share. */
export function CapabilitySplit({ sides, connectors }: Pick<Props, "sides" | "connectors">) {
  const [a, b] = sides;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(12rem,0.42fr)_1fr]" data-reveal>
      <Side s={a} />
      <div className="flex flex-col justify-center rounded-[var(--radius-panel)] border border-dashed border-line-dark-strong p-5">
        <p className="eyebrow text-center text-mute">Where they connect</p>
        <ul className="mt-4 space-y-2">
          {connectors.map((c) => (
            <li key={c} className="flex items-center gap-2.5 rounded-md bg-ink-3 px-3 py-2.5 text-[0.92rem] text-white">
              <span className="size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <Side s={b} />
    </div>
  );
}

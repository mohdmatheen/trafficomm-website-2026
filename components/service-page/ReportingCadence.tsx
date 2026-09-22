import type { ServicePageContent } from "@/data/service-pages/types";

type Cadence = NonNullable<ServicePageContent["reporting"]>["cadences"][number];

/** Dashboard-style cadence cards. Charts are illustrative UI only — no client data. */
function MiniViz({ i }: { i: number }) {
  if (i === 0)
    return (
      <svg viewBox="0 0 200 60" className="h-full w-full" aria-hidden="true">
        {[0, 1, 2].map((r) => (
          <g key={r} transform={`translate(0 ${8 + r * 18})`}>
            <rect width="200" height="6" rx="3" fill="#0c0c0d" opacity="0.07" />
            <rect width={[150, 118, 172][r]} height="6" rx="3" fill={r === 1 ? "#ea3e3a" : "#0c0c0d"} opacity={r === 1 ? 1 : 0.55} />
          </g>
        ))}
      </svg>
    );
  if (i === 1)
    return (
      <svg viewBox="0 0 200 60" className="h-full w-full" aria-hidden="true">
        <path d="M0 48 L28 40 L56 44 L84 30 L112 34 L140 20 L168 24 L200 10" fill="none" stroke="#0c0c0d" strokeOpacity="0.6" strokeWidth="1.5" />
        <circle cx="140" cy="20" r="3.5" fill="#ea3e3a" />
      </svg>
    );
  if (i === 2)
    return (
      <svg viewBox="0 0 200 60" className="h-full w-full" aria-hidden="true">
        {[26, 38, 30, 46, 40, 54].map((h, k) => (
          <rect key={k} x={6 + k * 33} y={60 - h} width="20" height={h} rx="2" fill={k === 5 ? "#ea3e3a" : "#0c0c0d"} opacity={k === 5 ? 1 : 0.18} />
        ))}
      </svg>
    );
  return (
    <svg viewBox="0 0 200 60" className="h-full w-full" aria-hidden="true">
      <circle cx="30" cy="30" r="22" fill="none" stroke="#0c0c0d" strokeOpacity="0.1" strokeWidth="8" />
      <circle cx="30" cy="30" r="22" fill="none" stroke="#ea3e3a" strokeWidth="8" strokeDasharray="100 140" transform="rotate(-90 30 30)" />
      {[0, 1, 2].map((r) => (
        <rect key={r} x="70" y={12 + r * 14} width={[120, 90, 104][r]} height="6" rx="3" fill="#0c0c0d" opacity="0.12" />
      ))}
    </svg>
  );
}

export function ReportingCadence({ cadences }: { cadences: readonly Cadence[] }) {
  return (
    <>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Reporting cadence">
        {cadences.map((c, i) => (
          <li key={c.label} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink">{c.label}</span>
              <span className="flex gap-1" aria-hidden="true">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 rounded-full bg-ink/15" />
                ))}
              </span>
            </div>
            <div className="h-20 bg-paper px-5 py-4">
              <MiniViz i={i} />
            </div>
            <ul className="flex-1 space-y-2 p-5">
              {c.items.map((it) => (
                <li key={it} className="flex items-center gap-2.5 text-[1rem] text-graphite">
                  <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[0.86rem] text-steel">Illustrative report layouts — no client data shown. Reports are delivered in your templates.</p>
    </>
  );
}

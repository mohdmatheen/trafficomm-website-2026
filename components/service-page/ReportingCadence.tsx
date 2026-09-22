/**
 * Reporting cadence as a compact table: what arrives, and how often.
 *
 * Previously four dashboard cards with illustrative charts. The reporting
 * interface above is now the page's visual, so the cadence only has to answer
 * "how often, and what is in it" — one row each.
 */
export function ReportingCadence({ cadences }: { cadences: readonly { label: string; items: readonly string[] }[] }) {
  return (
    <>
      <dl className="divide-y divide-line border-y border-line">
        {cadences.map((c) => (
          <div key={c.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-8" data-reveal>
            <dt className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink">{c.label}</dt>
            <dd className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.95rem] text-steel">
              {c.items.map((it, i) => (
                <span key={it} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-signal" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {it}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[0.86rem] text-steel">Delivered in your templates, under your brand — to your team or your clients.</p>
    </>
  );
}

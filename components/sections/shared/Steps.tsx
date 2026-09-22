/** Numbered process list — horizontal rail on desktop, vertical on mobile. */
export function Steps({ steps, tone = "light" }: { steps: { step: string; body: string }[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ol className={`grid gap-px overflow-hidden rounded-[var(--radius-panel)] sm:grid-cols-2 lg:grid-cols-3 ${dark ? "bg-line-dark ring-1 ring-line-dark" : "bg-line ring-1 ring-line"}`}>
      {steps.map((s, i) => (
        <li key={s.step} className={`relative p-6 sm:p-8 ${dark ? "bg-ink-2" : "bg-white"}`} data-reveal style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}>
          <span className="font-mono text-[0.7rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
          <p className={`mt-6 text-[1.25rem] tracking-[-0.02em] ${dark ? "text-white" : "text-ink"}`}>{s.step}</p>
          <p className={`mt-2 text-[0.94rem] leading-relaxed ${dark ? "text-fog" : "text-steel"}`}>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

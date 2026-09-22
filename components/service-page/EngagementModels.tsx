export function EngagementModels({ models }: { models: readonly { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line ring-1 ring-line md:grid-cols-3">
      {models.map((m, i) => (
        <li key={m.title} className="bg-white p-7 sm:p-9" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
          <span className="font-mono text-[0.77rem] text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-6 text-h3 text-ink">{m.title}</h3>
          <p className="mt-3 text-[1.03rem] leading-relaxed text-steel">{m.body}</p>
        </li>
      ))}
    </ol>
  );
}

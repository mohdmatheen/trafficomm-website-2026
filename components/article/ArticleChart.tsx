import type { ArticleBlock } from "@/data/types";

type Chart = Extract<ArticleBlock, { type: "chart" }>;

/**
 * Accessible SVG chart for articles: horizontal bars with direct labels and a
 * data table fallback for screen readers.
 */
export function ArticleChart({ chart }: { chart: Chart }) {
  const max = Math.max(...chart.series.map((s) => s.value));
  const rowH = 56;
  const labelW = 160;
  const W = 640;
  const H = chart.series.length * rowH + 12;

  return (
    <figure className="!my-10 overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line">
      <div className="border-b border-line px-6 py-4">
        <p className="eyebrow text-steel">{chart.kind === "compare" ? "Comparison" : "Chart"}</p>
        <p className="mt-2 text-[1.05rem] leading-snug tracking-[-0.01em] text-ink">{chart.title}</p>
      </div>
      <div className="px-6 py-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
          {chart.series.map((s, i) => {
            const w = ((W - labelW - 70) * s.value) / max;
            const y = i * rowH + 8;
            return (
              <g key={s.label} transform={`translate(0 ${y})`}>
                <text x="0" y="24" fontSize="14" className="fill-steel">
                  {s.label}
                </text>
                <rect x={labelW} y="6" width={W - labelW - 70} height="28" rx="4" fill="#0c0c0d" opacity="0.05" />
                <rect x={labelW} y="6" width={w} height="28" rx="4" fill={s.highlight ? "#ea3e3a" : "#0c0c0d"} opacity={s.highlight ? 1 : 0.8} />
                <text x={labelW + w + 10} y="26" fontSize="16" className="fill-ink" fontWeight="500">
                  {s.display ?? s.value}
                </text>
              </g>
            );
          })}
        </svg>
        <table className="sr-only">
          <caption>{chart.title}</caption>
          <thead>
            <tr>
              <th scope="col">Label</th>
              <th scope="col">Value{chart.unit ? ` (${chart.unit})` : ""}</th>
            </tr>
          </thead>
          <tbody>
            {chart.series.map((s) => (
              <tr key={s.label}>
                <th scope="row">{s.label}</th>
                <td>{s.display ?? s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="border-t border-line bg-paper px-6 py-3 text-[0.78rem] leading-relaxed text-steel">{chart.caption}</figcaption>
    </figure>
  );
}

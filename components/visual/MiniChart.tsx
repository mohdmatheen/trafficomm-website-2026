import { cn } from "@/lib/cn";

/**
 * Small SVG chart primitives for the reporting prototype. Hand-rolled on
 * purpose: no charting library is added for a handful of illustrative shapes.
 * Every chart is decorative (`aria-hidden`) and sits beside real text that
 * states the same thing, so nothing depends on reading the picture.
 */

/** Line trend. Values are plotted to a fixed 200×60 viewBox. */
export function TrendLine({ values, className }: { values: readonly number[]; className?: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 196 + 2, 54 - ((v - min) / span) * 46]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox="0 0 200 60" className={cn("h-full w-full", className)} preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d} L198 60 L2 60 Z`} fill="#ea3e3a" fillOpacity="0.08" />
      <path d={d} fill="none" stroke="#ea3e3a" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r="2.4" fill="#ea3e3a" />
    </svg>
  );
}

/** Horizontal bars, used for platform / market / campaign breakdowns. */
export function BarRows({ rows, tone = "dark" }: { rows: readonly { label: string; value: number }[]; tone?: "dark" | "light" }) {
  const max = Math.max(...rows.map((r) => r.value)) || 1;
  const dark = tone === "dark";
  return (
    <ul className="space-y-2.5">
      {rows.map((r, i) => (
        <li key={r.label} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-3 text-[0.82rem]">
          <span className={cn("truncate", dark ? "text-fog" : "text-graphite")}>{r.label}</span>
          <span className={cn("h-2 overflow-hidden rounded-full", dark ? "bg-white/[0.07]" : "bg-paper")} aria-hidden="true">
            <span
              className={cn("block h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", i === 0 ? "bg-signal" : dark ? "bg-white/30" : "bg-ink/30")}
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </span>
          <span className={cn("text-right font-mono text-[0.76rem] tabular", dark ? "text-mute" : "text-steel")}>{r.value.toLocaleString("en-US")}</span>
        </li>
      ))}
    </ul>
  );
}

/** Proportional segments on one bar, for a platform mix. */
export function MixBar({ rows }: { rows: readonly { label: string; value: number }[] }) {
  const total = rows.reduce((n, r) => n + r.value, 0) || 1;
  const shades = ["bg-signal", "bg-white/45", "bg-white/30", "bg-white/20", "bg-white/12"];
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
        {rows.map((r, i) => (
          <span key={r.label} className={cn("block h-full", shades[i % shades.length])} style={{ width: `${(r.value / total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {rows.map((r, i) => (
          <li key={r.label} className="flex items-center gap-2 text-[0.8rem] text-fog">
            <span className={cn("size-2 rounded-[2px]", shades[i % shades.length])} aria-hidden="true" />
            {r.label}
            <span className="font-mono text-[0.74rem] text-mute tabular">{Math.round((r.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

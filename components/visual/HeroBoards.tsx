import { creativeFormats } from "@/data/visual/creative-adtech-systems";
import { heroBoard } from "@/data/visual/optimization-engine";
import { cn } from "@/lib/cn";

/**
 * Hero-side visuals for the two service pages whose subject is not a process
 * but an object: performance signals, and creative formats.
 *
 * Both are server-rendered SVG and CSS — no charting library, no motion. They
 * replace the generic module illustration on those two pages only; every
 * other service hero is untouched.
 */

/** Line with a dashed target baseline. Decorative: the same reading is stated in text beside it. */
export function MiniTrend({ values, target, className }: { values: readonly number[]; target: number; className?: string }) {
  const min = Math.min(...values, target);
  const max = Math.max(...values, target);
  const span = max - min || 1;
  const y = (v: number) => 30 - ((v - min) / span) * 26;
  const d = values.map((v, i) => `${i === 0 ? "M" : "L"}${((i / (values.length - 1)) * 116 + 2).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 120 34" preserveAspectRatio="none" className={cn("h-full w-full", className)} aria-hidden="true">
      <line x1="2" y1={y(target)} x2="118" y2={y(target)} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke="#ea3e3a" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx="118" cy={y(values[values.length - 1])} r="2" fill="#ea3e3a" />
    </svg>
  );
}

/** Proportional budget split. Each segment is also labelled in text below. */
export function AllocationStrip({ rows, tone = "light" }: { rows: readonly { label: string; value: number }[]; tone?: "light" | "dark" }) {
  const total = rows.reduce((n, r) => n + r.value, 0) || 1;
  const dark = tone === "dark";
  const shades = dark ? ["bg-signal", "bg-white/45", "bg-white/30", "bg-white/18"] : ["bg-signal", "bg-ink/45", "bg-ink/25", "bg-ink/12"];
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full" aria-hidden="true">
        {rows.map((r, i) => (
          <span key={r.label} className={cn("block h-full", shades[i % shades.length])} style={{ width: `${(r.value / total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
        {rows.map((r, i) => (
          <li key={r.label} className={cn("flex items-center gap-1.5 font-mono text-[0.64rem] uppercase tracking-[0.06em]", dark ? "text-fog" : "text-steel")}>
            <span className={cn("size-1.5 rounded-[2px]", shades[i % shades.length])} aria-hidden="true" />
            {r.label}
            <span className={dark ? "text-white" : "text-ink"}>{Math.round((r.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Performance Marketing hero: the numbers an operator actually watches. */
export function PerformanceSignalBoard() {
  return (
    <div className="px-5 py-5">
      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-line ring-1 ring-line">
        {heroBoard.kpis.map((k) => (
          <div key={k.label} className="bg-white px-3 py-2.5">
            <dt className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-steel">{k.label}</dt>
            <dd className="mt-1 text-[1.15rem] leading-none tracking-[-0.03em] text-ink tabular">{k.value}</dd>
            {k.note && <dd className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.06em] text-steel">{k.note}</dd>}
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-steel">{heroBoard.trendNote}</p>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink">Above target</p>
      </div>
      <div className="mt-2 h-9 text-ink">
        <MiniTrend values={heroBoard.trend} target={heroBoard.target} />
      </div>
      <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-steel">{heroBoard.allocationNote}</p>
      <div className="mt-2">
        <AllocationStrip rows={heroBoard.allocation} />
      </div>
      <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-steel">{heroBoard.caption}</p>
    </div>
  );
}

/** One abstract advertising format. Blocks stand in for image, headline and call to action. */
export function FormatSpecimen({ spec, maxSide = 64, tone = "light" }: { spec: (typeof creativeFormats)[number]; maxSide?: number; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const scale = maxSide / Math.max(spec.w, spec.h);
  const w = Math.round(spec.w * scale);
  const h = Math.round(spec.h * scale);
  const wide = spec.w / spec.h > 2.2;
  const block = dark ? "bg-white/15" : "bg-ink/12";
  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <div
        className={cn("flex gap-[3px] p-[3px] ring-1", dark ? "bg-white/[0.04] ring-line-dark" : "bg-paper ring-line", wide ? "flex-row items-stretch" : "flex-col")}
        style={{ width: w, height: h }}
        aria-hidden="true"
      >
        <span className={cn(block, wide ? "h-full w-1/3" : "w-full flex-1")} />
        <span className={cn("flex flex-col justify-between gap-[3px]", wide ? "flex-1" : "w-full")}>
          <span className={cn("block h-[3px] w-full", block)} />
          <span className={cn("block h-[3px] w-2/3", block)} />
          <span className="block h-[5px] w-1/2 bg-signal" />
        </span>
      </div>
      <figcaption className={cn("font-mono text-[0.58rem] uppercase tracking-[0.06em]", dark ? "text-fog" : "text-steel")}>{spec.size}</figcaption>
    </figure>
  );
}

/** Creative & AdTech hero: the formats the studio actually ships. */
export function CreativeFormatBoard() {
  return (
    <div className="px-5 py-5">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-steel">Formats built to publisher spec</p>
      <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-3">
        {[0, 1, 2, 5].map((i) => (
          <FormatSpecimen key={creativeFormats[i].size} spec={creativeFormats[i]} maxSide={68} />
        ))}
      </div>
      <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-steel">Abstract format specimens — not client creative</p>
    </div>
  );
}

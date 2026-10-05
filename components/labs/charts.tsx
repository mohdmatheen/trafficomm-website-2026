"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Charts for the results screen.
 *
 * Built as plain SVG and CSS on the site's own tokens rather than pulled from a
 * charting library: every chart here is a bar, and a dependency would ship far
 * more than that buys. Each one carries a real table underneath for assistive
 * technology, so nothing is conveyed by shape or colour alone.
 */

export type Datum = { key: string; label: string; value: number; display: string; tone?: "signal" | "ink" | "muted" };

const TONES: Record<NonNullable<Datum["tone"]>, string> = {
  signal: "bg-signal",
  ink: "bg-ink",
  muted: "bg-line-strong",
};

/** Horizontal bars. Reads top-down on every width, so it needs no mobile variant. */
export function BarRows({ data, caption, unit }: { data: Datum[]; caption: string; unit: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const [active, setActive] = useState<string | null>(null);
  return (
    <figure className="m-0">
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className="grid gap-3">
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          const on = active === d.key;
          return (
            <li
              key={d.key}
              onMouseEnter={() => setActive(d.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(d.key)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              className="group rounded-[10px] outline-offset-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <span className="text-[0.95rem] text-graphite">{d.label}</span>
                <span className={cn("font-mono text-[0.84rem] tabular-nums transition-colors duration-200", on ? "text-ink" : "text-steel")}>{d.display}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-paper-2">
                <div
                  className={cn("h-full rounded-full transition-[width,opacity] duration-500 ease-out motion-reduce:transition-none", TONES[d.tone ?? "ink"], on ? "opacity-100" : "opacity-85")}
                  style={{ width: `${Math.max(pct, d.value > 0 ? 1.5 : 0)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {/* The table carries the same data for assistive technology. It is wrapped
          rather than given `sr-only` directly: a table does not honour
          `overflow: hidden` on itself and lays out at its natural width, which
          pushed the document ~145px wide on a phone. The wrapper clips properly. */}
      <div className="sr-only">
        <table>
          <caption>{caption}</caption>
          <thead><tr><th scope="col">Activity</th><th scope="col">{unit}</th></tr></thead>
          <tbody>{data.map((d) => <tr key={d.key}><th scope="row">{d.label}</th><td>{d.display}</td></tr>)}</tbody>
        </table>
      </div>
    </figure>
  );
}

/**
 * A single stacked bar. Used for capacity allocation, where the question is what
 * proportion of one whole each segment takes — not how segments compare.
 */
export function StackedBar({ data, caption, total }: { data: Datum[]; caption: string; total: number }) {
  const sum = total || data.reduce((s, d) => s + d.value, 0) || 1;
  const id = useId();
  return (
    <figure className="m-0">
      <figcaption className="sr-only">{caption}</figcaption>
      <div className="flex h-12 w-full overflow-hidden rounded-[10px] bg-paper-2" role="img" aria-labelledby={`${id}-desc`}>
        {data.map((d) => (
          <div
            key={d.key}
            className={cn("h-full transition-[flex-grow] duration-500 ease-out motion-reduce:transition-none", TONES[d.tone ?? "ink"])}
            style={{ flexGrow: Math.max(d.value, 0), flexBasis: 0 }}
          />
        ))}
      </div>
      <p id={`${id}-desc`} className="sr-only">
        {caption}. {data.map((d) => `${d.label}: ${d.display}`).join(". ")}.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {data.map((d) => (
          <li key={d.key} className="flex items-baseline gap-2.5">
            <span className={cn("mt-1.5 size-2 shrink-0 rounded-[3px]", TONES[d.tone ?? "ink"])} aria-hidden="true" />
            <span className="flex-1 text-[0.92rem] text-graphite">{d.label}</span>
            <span className="font-mono text-[0.82rem] tabular-nums text-steel">{d.display}</span>
            <span className="w-12 text-right font-mono text-[0.82rem] tabular-nums text-ink">{Math.round((d.value / sum) * 100)}%</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Score components against their maximums. */
export function ScoreBars({ data, caption }: { data: { key: string; label: string; score: number; max: number }[]; caption: string }) {
  return (
    <figure className="m-0">
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className="grid gap-3.5">
        {data.map((d) => (
          <li key={d.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span className="text-[0.95rem] text-graphite">{d.label}</span>
              <span className="font-mono text-[0.82rem] tabular-nums text-steel">
                {Math.round(d.score * 10) / 10} <span className="text-fog">/ {d.max}</span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full bg-signal transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{ width: `${Math.max(0, Math.min(100, (d.score / d.max) * 100))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** A gauge for the efficiency score. The number carries the meaning; the arc frames it. */
export function ScoreDial({ score, children }: { score: number; children?: ReactNode }) {
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const r = 52;
  const circumference = Math.PI * r; // semicircle
  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 128 70" className="w-full max-w-[13rem]" role="img" aria-label={`Operational efficiency score: ${Math.round(score)} out of 100`}>
        <path d={`M 12 64 A ${r} ${r} 0 0 1 116 64`} fill="none" stroke="var(--color-line-strong)" strokeWidth="7" strokeLinecap="round" />
        <path
          d={`M 12 64 A ${r} ${r} 0 0 1 116 64`}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${circumference * pct} ${circumference}`}
          className="transition-[stroke-dasharray] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="-mt-9 text-center">{children}</div>
    </div>
  );
}

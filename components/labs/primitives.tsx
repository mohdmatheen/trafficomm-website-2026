"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatMoney, formatUsd, type FxRate } from "@/lib/labs/currency";
import { cn } from "@/lib/cn";

/**
 * Shared Trafficomm Labs controls.
 *
 * These lean on the site's existing tokens — paper, ink, signal, line, the card
 * and panel radii — so Labs reads as the same company in a product register
 * rather than as a separate product. Nothing here introduces a new colour, a new
 * radius or a new shadow.
 */

/** A monetary figure with its USD equivalent underneath. Used for every amount. */
export function Money({
  amount,
  currency,
  fx,
  size = "md",
  decimals,
  className,
}: {
  amount: number;
  currency: string;
  fx: FxRate;
  size?: "sm" | "md" | "lg" | "xl";
  decimals?: number;
  className?: string;
}) {
  // `xl` is sized in container units: "SAR 1,353,600" is thirteen characters, and
  // a viewport-relative clamp overflows a four-up card at desktop widths. 11cqi
  // keeps the longest realistic string inside the card at every breakpoint while
  // still reading as a headline figure.
  const sizes = {
    sm: "text-[1rem] tracking-[-0.02em]",
    md: "text-[1.5rem] tracking-[-0.03em]",
    lg: "text-[2.1rem] tracking-[-0.035em]",
    xl: "text-[clamp(1.6rem,11cqi,3rem)] tracking-[-0.04em]",
  } as const;
  return (
    <span className={cn("block", className)}>
      <span className={cn("block whitespace-nowrap font-medium tabular-nums text-ink", sizes[size])}>{formatMoney(amount, currency, { decimals })}</span>
      <span className="mt-1 block font-mono text-[0.72rem] tabular-nums text-steel">{formatUsd(amount, fx.rate, { decimals })}</span>
    </span>
  );
}

/** Counts to a value on first paint. Honours reduced motion by rendering the end state. */
export function CountUp({ value, format, durationMs = 900 }: { value: number; format: (n: number) => string; durationMs?: number }) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = from.current;
    from.current = value;
    if (reduced || start === value) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      // easeOutCubic: fast arrival, no overshoot.
      setDisplay(start + (value - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);
  return <>{format(display)}</>;
}

export function Stat({
  label,
  children,
  note,
  tone = "light",
  className,
}: {
  label: string;
  children: ReactNode;
  note?: ReactNode;
  tone?: "light" | "dark" | "signal";
  className?: string;
}) {
  const tones = {
    light: "bg-white ring-line",
    dark: "bg-ink-2 ring-line-dark text-white",
    signal: "bg-signal-soft ring-signal/30",
  } as const;
  return (
    <div className={cn("@container flex h-full flex-col justify-between rounded-[var(--radius-card)] p-5 ring-1 ring-inset sm:p-6", tones[tone], className)}>
      <p className={cn("font-mono text-[0.66rem] uppercase tracking-[0.12em]", tone === "dark" ? "text-fog" : "text-steel")}>{label}</p>
      <div className="mt-4">{children}</div>
      {note && <p className={cn("mt-3 text-[0.84rem] leading-relaxed", tone === "dark" ? "text-mute" : "text-steel")}>{note}</p>}
    </div>
  );
}

/** A large selectable card. Used for market and workload-mode choices. */
export function Choice({
  selected,
  onSelect,
  title,
  meta,
  description,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  meta?: string;
  description?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex min-h-11 w-full flex-col items-start rounded-[var(--radius-card)] bg-white p-5 text-left outline-offset-4 ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none sm:p-6",
        selected ? "ring-2 ring-signal" : "ring-line hover:ring-line-strong",
        className,
      )}
    >
      <span className="flex w-full items-start justify-between gap-3">
        <span className="text-[1.18rem] tracking-[-0.02em] text-ink">{title}</span>
        <span
          aria-hidden="true"
          className={cn(
            "mt-1 grid size-5 shrink-0 place-items-center rounded-full ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none",
            selected ? "bg-signal ring-signal" : "ring-line-strong",
          )}
        >
          {selected && (
            <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6.4 4.7 9 10 3.4" />
            </svg>
          )}
        </span>
      </span>
      {meta && <span className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-steel">{meta}</span>}
      {description && <span className="mt-3 text-[0.94rem] leading-relaxed text-steel">{description}</span>}
    </button>
  );
}

/** A compact toggle used for platforms, where many are selected at once. */
export function Chip({ selected, onSelect, children }: { selected: boolean; onSelect: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "min-h-11 rounded-[var(--radius-card)] px-4 text-[0.95rem] outline-offset-4 ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none",
        selected ? "bg-ink text-white ring-ink" : "bg-white text-graphite ring-line hover:ring-line-strong",
      )}
    >
      {children}
    </button>
  );
}

/** −/+ stepper. The input stays a real number field so keyboards and AT behave. */
export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  id,
  describedBy,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  id: string;
  describedBy?: string;
}) {
  const btn =
    "grid size-11 shrink-0 place-items-center rounded-[10px] bg-paper text-ink outline-offset-4 ring-1 ring-inset ring-line transition-colors duration-200 hover:ring-line-strong disabled:opacity-35 motion-reduce:transition-none";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        aria-describedby={describedBy}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? Math.max(min, Math.min(max, Math.round(n))) : min);
        }}
        className="h-11 w-16 rounded-[10px] bg-white text-center text-[1.05rem] tabular-nums text-ink outline-offset-4 ring-1 ring-inset ring-line [appearance:textfield] focus-visible:ring-2 focus-visible:ring-signal [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label}`}>
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

/** Range control. Native input[type=range] so keyboard and AT support come free. */
export function Slider({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  valueLabel,
  minLabel,
  maxLabel,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  valueLabel: string;
  minLabel?: string;
  maxLabel?: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <label htmlFor={id} className="text-[0.98rem] text-ink">{label}</label>
        <span className="font-mono text-[0.86rem] tabular-nums text-signal-ink">{valueLabel}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-11 w-full cursor-pointer appearance-none bg-transparent outline-offset-4 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-signal [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-line-strong [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-line-strong [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-signal"
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between font-mono text-[0.68rem] uppercase tracking-[0.1em] text-steel">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

/** Two-option switch, used for market-estimate vs actual costs and workload mode. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-[12px] bg-paper p-1 ring-1 ring-inset ring-line">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "min-h-11 rounded-[9px] px-4 text-[0.92rem] outline-offset-4 transition-colors duration-200 motion-reduce:transition-none",
            value === o.value ? "bg-white text-ink ring-1 ring-inset ring-line" : "text-steel hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Marks a figure the calculator derived rather than one the visitor supplied. */
export function EstimatedTag({ children = "Estimated" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-signal-ink ring-1 ring-inset ring-signal/30">
      <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
      {children}
    </span>
  );
}

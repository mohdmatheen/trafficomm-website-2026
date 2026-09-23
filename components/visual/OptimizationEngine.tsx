"use client";

import { useId } from "react";
import { autonomyNote, convergedReadout, decisionChain, engineCore, engineInlet, engineSignals, statusLine } from "@/data/visual/optimization-engine";
import { cn } from "@/lib/cn";
import { Chip, Frame, IllustrativeTag } from "./parts";
import { useSignalSequence } from "./useSignalSequence";

const N = engineSignals.length;
/** Signals plus one converged state: the engine rests with everything examined together. */
const COUNT = N + 1;
/** Column centres of a three-up row, in the connector band's viewBox units. */
const X = [16.667, 50, 83.333];
/** Reading order per composition, so arrow keys follow what is on screen. */
const ORDER = { t: [0, 1, 2, N, 3, 4, 5], m: [N, 0, 1, 2, 3, 4, 5] } as const;

/**
 * Performance Marketing: signals converging on one performance objective.
 *
 * Deliberately not a pipeline. Six signals — audience, creative, channel,
 * budget, structure, conversion — sit around the KPI they are all read
 * against, and the connectors draw inward as each one enters the engine. The
 * point of the picture is that Trafficomm examines them together rather than
 * optimizing one metric in isolation.
 *
 * The readout is an illustrative operations console: what was observed, what
 * is proposed, and the state it sits in. Every proposal ends at a person —
 * nothing here implies an autonomous system moving budgets on its own.
 *
 * Complete state first: under reduced motion (and on the server) the engine is
 * already converged with every connector drawn, so no information depends on
 * the sequence running.
 */
export function OptimizationEngine({ levers, kpis, loop, note }: { levers: readonly { label: string; body: string }[]; kpis: readonly string[]; loop: readonly { label: string }[]; note: string }) {
  const id = useId();
  const { ref, active, playing, select } = useSignalSequence(COUNT);
  const converged = active >= N;
  const sig = converged ? null : engineSignals[active];
  /** A connector is drawn once its signal has entered the engine. */
  const drawn = (i: number) => converged || i <= active;

  const focusTab = (i: number, p: "t" | "m") => {
    select(i);
    document.getElementById(`${id}-${p}${i}`)?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number, p: "t" | "m") => {
    const ord = ORDER[p];
    const at = ord.indexOf(i);
    const next = e.key === "ArrowRight" || e.key === "ArrowDown";
    const prev = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!next && !prev && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const to = e.key === "Home" ? ord[0] : e.key === "End" ? ord[ord.length - 1] : ord[(at + (next ? 1 : ord.length - 1)) % ord.length];
    focusTab(to, p);
  };

  /**
   * The manifold between a row of signals and the core: a stub per signal
   * into a shared bus, then one line into the objective. Right angles survive
   * the non-uniform viewBox, and a signal brightens as it enters.
   */
  const band = (from: "signals" | "core") => {
    const busY = from === "signals" ? 24 : 16;
    return (
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true">
        <line x1={X[0]} y1={busY} x2={X[2]} y2={busY} strokeWidth={1} vectorEffect="non-scaling-stroke" className="stroke-signal/25" />
        <line
          x1={50}
          y1={from === "signals" ? busY : 0}
          x2={50}
          y2={from === "signals" ? 40 : busY}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          className={cn("transition-opacity duration-300 motion-reduce:transition-none", converged ? "stroke-signal opacity-100" : "stroke-signal opacity-50")}
        />
        {X.map((x, k) => {
          const i = from === "signals" ? k : k + 3;
          const on = i === active;
          return (
            <line
              key={x}
              x1={x}
              y1={from === "signals" ? 0 : busY}
              x2={x}
              y2={from === "signals" ? busY : 40}
              strokeWidth={on ? 2 : 1}
              vectorEffect="non-scaling-stroke"
              className={cn("transition-opacity duration-500 ease-out motion-reduce:transition-none", on ? "stroke-signal opacity-100" : drawn(i) ? "stroke-signal opacity-45" : "stroke-signal opacity-10")}
            />
          );
        })}
      </svg>
    );
  };

  const tile = (i: number, p: "t" | "m") => {
    const st = engineSignals[i];
    const on = i === active;
    return (
      <div role="presentation" key={st.id}>
        <button
          type="button"
          role="tab"
          id={`${id}-${p}${i}`}
          aria-selected={on}
          aria-controls={`${id}-p`}
          tabIndex={on ? 0 : -1}
          onClick={() => select(i)}
          onKeyDown={(e) => onKey(e, i, p)}
          className={cn(
            "flex h-full min-h-11 w-full flex-col justify-center rounded-[var(--radius-card)] p-4 text-left outline-offset-4 ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none",
            on ? "bg-signal-soft/10 ring-signal/60" : "bg-ink-2 ring-line-dark hover:ring-line-dark-strong",
          )}
        >
          <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase leading-tight tracking-[0.1em] text-white">
            <span className={cn("size-1.5 shrink-0 rounded-full", on ? "bg-signal" : "bg-white/30")} aria-hidden="true" />
            {st.label}
          </span>
          <span className={cn("mt-2 text-[0.86rem] leading-snug", p === "t" ? "text-fog" : "sr-only")}>{levers[i]?.body}</span>
        </button>
      </div>
    );
  };

  const core = (p: "t" | "m") => (
    <div role="presentation">
      <button
        type="button"
        role="tab"
        id={`${id}-${p}${N}`}
        aria-selected={converged}
        aria-controls={`${id}-p`}
        tabIndex={converged ? 0 : -1}
        onClick={() => select(N)}
        onKeyDown={(e) => onKey(e, N, p)}
        className={cn(
          "w-full rounded-[var(--radius-panel)] bg-white p-5 text-left text-ink outline-offset-4 ring-2 transition-[box-shadow] duration-300 motion-reduce:transition-none sm:p-6",
          converged ? "ring-signal" : "ring-transparent",
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <span>
            <span className="eyebrow !text-[0.62rem] text-steel">{engineCore.label}</span>
            <span className="mt-2 block text-[1.35rem] leading-tight tracking-[-0.03em] text-ink">{engineCore.body}</span>
            <span className="mt-1 block text-[0.86rem] text-steel">{converged ? engineCore.allBody : `Read against ${engineCore.example} in this example.`}</span>
          </span>
          <span className="flex flex-wrap gap-1.5" aria-label="Typical KPI targets">
            {kpis.map((k) => (
              <span
                key={k}
                className={cn(
                  "rounded-md px-2.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] ring-1 ring-inset",
                  // signal-ink, not signal: white on #ea3e3a is 4.0:1 at this size.
                  k === engineCore.example ? "bg-signal-ink text-white ring-signal-ink" : "bg-paper text-ink ring-line",
                )}
              >
                {k}
              </span>
            ))}
          </span>
        </div>
      </button>
    </div>
  );

  const row = (label: string, children: React.ReactNode) => (
    <div key={label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
      <dt className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">{label}</dt>
      <dd className="text-[0.98rem] leading-snug text-white">{children}</dd>
    </div>
  );

  return (
    <div ref={ref}>
      {/* Inlet: what the engine is fed before anything is proposed. */}
      <p className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">
        {engineInlet.map((it, i) => (
          <span key={it} className="flex items-center gap-2.5">
            {i > 0 && (
              <span className="text-signal" aria-hidden="true">
                →
              </span>
            )}
            {it}
          </span>
        ))}
        <span className="text-signal" aria-hidden="true">
          →
        </span>
        <span className="text-white">Into the engine</span>
      </p>

      {/* Desktop: signals ring the objective they are all read against. */}
      <div role="tablist" aria-label="Optimization signals" aria-orientation="horizontal" className="hidden lg:block">
        <div className="grid grid-cols-3 gap-3" role="presentation">
          {[0, 1, 2].map((i) => tile(i, "t"))}
        </div>
        {band("signals")}
        {core("t")}
        {band("core")}
        <div className="grid grid-cols-3 gap-3" role="presentation">
          {[3, 4, 5].map((i) => tile(i, "t"))}
        </div>
      </div>

      {/* Mobile / tablet: objective first, then the signal being examined. */}
      <div role="tablist" aria-label="Optimization signals" aria-orientation="vertical" className="lg:hidden">
        {core("m")}
        <div className="flex items-center gap-3 py-4" aria-hidden="true">
          <span className="ml-[15px] h-8 w-px bg-signal/40" />
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-fog">Signals examined</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2" role="presentation">
          {[0, 1, 2, 3, 4, 5].map((i) => tile(i, "m"))}
        </div>
      </div>

      {/* One readout serves both compositions. */}
      <div id={`${id}-p`} role="tabpanel" aria-label={`Optimization readout: ${converged ? engineCore.allLabel : sig!.label}`} className="mt-6 overflow-hidden rounded-[var(--radius-panel)] bg-ink-2 ring-1 ring-line-dark">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark px-5 py-3">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-white">Optimization readout</span>
          <span className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">
              <span className={cn("size-1.5 rounded-full bg-signal", playing && "animate-pulse-dot")} aria-hidden="true" />
              {playing ? "Signals entering" : "Select a signal"}
            </span>
            <IllustrativeTag>Illustrative data</IllustrativeTag>
          </span>
        </div>
        <dl className="min-h-[15rem] divide-y divide-line-dark sm:min-h-[13.5rem]">
          {row("Target KPI", <span className="font-mono tabular">{engineCore.example}</span>)}
          {row(
            "Examining",
            converged ? (
              convergedReadout.examining
            ) : (
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{sig!.label}</span>
                <span className="text-[0.86rem] text-fog">{sig!.examines.join(" · ")}</span>
              </span>
            ),
          )}
          {row("Observation", converged ? convergedReadout.observation : sig!.observation)}
          {row("Option", converged ? convergedReadout.option : sig!.option)}
          {row(
            "Status",
            <span className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
              {statusLine}
            </span>,
          )}
        </dl>
        <div className="border-t border-line-dark px-5 py-4">
          <ol className="flex flex-wrap items-center gap-2">
            {decisionChain.map((d, i) => (
              <li key={d} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-signal" aria-hidden="true">
                    →
                  </span>
                )}
                <Chip tone={i === 2 ? "plain" : "muted"}>{d}</Chip>
              </li>
            ))}
          </ol>
          <p className="mt-3 max-w-2xl text-[0.84rem] leading-relaxed text-mute">{autonomyNote}</p>
        </div>
      </div>

      {/* The approved evidence loop, as labels only: the engine keeps running. */}
      <Frame label="The optimization loop" className="mt-4">
        <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-7">
          {loop.map((s, i) => (
            <li key={s.label} className="rounded-md bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-line-dark">
              <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">
                <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1.5 block text-[0.9rem] leading-snug text-white">{s.label}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex items-center gap-3">
          <span className="h-px flex-1 border-t border-dashed border-line-dark-strong" aria-hidden="true" />
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-fog">Learnings feed the next hypothesis</span>
          <span className="h-px flex-1 border-t border-dashed border-line-dark-strong" aria-hidden="true" />
        </div>
      </Frame>

      <p className="mt-4 max-w-2xl text-[0.86rem] leading-relaxed text-mute">{note}</p>
    </div>
  );
}

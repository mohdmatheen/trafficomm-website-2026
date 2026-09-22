"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useSignalSequence } from "./useSignalSequence";

export type PipelineStage = {
  /** Short rail label, e.g. "QA". */
  label: string;
  /** One line explaining the stage. */
  summary: string;
  /** What the stage actually covers. Shown in the active panel. */
  items?: string[];
  /** Owner of the step, for the small tag on the node. */
  owner?: "client" | "trafficomm" | "output";
};

/**
 * The Trafficomm signal moving through a system: BRIEF → BUILD → … → MONITOR.
 *
 * One component serves every prototype pipeline (ad operations, measurement,
 * reporting). It renders a horizontal rail on desktop and a vertical rail on
 * mobile — never a shrunken copy of the desktop diagram — with one panel of
 * detail for the selected stage.
 *
 * Story first, interaction second: the sequence plays once on scroll so the
 * process explains itself, and stays selectable afterwards. Under reduced
 * motion the final stage is active from the start, so the whole chain reads
 * as a finished system with nothing hidden.
 *
 * Structure is an ARIA tab list over an ordered list, matching the lifecycle
 * explorer already used on the site: rail lines and the signal dot are
 * decorative, the stage names and detail are real text.
 */
export function SignalPipeline({
  stages,
  label,
  tone = "dark",
  detail,
  ownerLabels = { client: "Input", trafficomm: "Trafficomm", output: "Output" },
}: {
  stages: readonly PipelineStage[];
  label: string;
  tone?: "dark" | "light";
  /** Optional per-stage visual rendered inside the active panel. */
  detail?: (index: number, isActive: boolean) => ReactNode;
  ownerLabels?: Record<"client" | "trafficomm" | "output", string>;
}) {
  const id = useId();
  const n = stages.length;
  const { ref, active, playing, select, reduced } = useSignalSequence(n);
  const dark = tone === "dark";
  const s = stages[active];
  // Rail geometry: markers sit at the centre of each equal column.
  const start = 0.5 / n;
  const span = 1 - 1 / n;
  const progress = n > 1 ? active / (n - 1) : 1;

  // `prefix` keeps focus inside the rail the user is actually using (t = desktop, m = mobile).
  const focusTab = (i: number, prefix: "t" | "m") => {
    select(i);
    document.getElementById(`${id}-${prefix}${i}`)?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number, vertical = false) => {
    const prefix = vertical ? "m" : "t";
    const next = vertical ? "ArrowDown" : "ArrowRight";
    const prev = vertical ? "ArrowUp" : "ArrowLeft";
    if (e.key === next) {
      e.preventDefault();
      focusTab((i + 1) % n, prefix);
    } else if (e.key === prev) {
      e.preventDefault();
      focusTab((i - 1 + n) % n, prefix);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0, prefix);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(n - 1, prefix);
    }
  };

  const Tag = ({ owner }: { owner?: PipelineStage["owner"] }) =>
    owner ? (
      <span className={cn("rounded-full px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em]", dark ? "bg-white/[0.06] text-fog" : "bg-paper text-steel")}>{ownerLabels[owner]}</span>
    ) : null;

  const panel = (
    <div
      id={`${id}-p`}
      role="tabpanel"
      aria-label={`${label}: ${s.label}`}
      className={cn("overflow-hidden rounded-[var(--radius-panel)] ring-1", dark ? "bg-ink-2 ring-line-dark" : "bg-white ring-line")}
    >
      <div className={cn("flex items-center justify-between gap-3 border-b px-5 py-3", dark ? "border-line-dark" : "border-line")}>
        <span className={cn("font-mono text-[0.72rem] uppercase tracking-[0.12em]", dark ? "text-white" : "text-ink")}>
          {String(active + 1).padStart(2, "0")} · {s.label}
        </span>
        <span className={cn("flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em]", dark ? "text-fog" : "text-steel")}>
          <span className={cn("size-1.5 rounded-full bg-signal", playing && "animate-pulse-dot")} aria-hidden="true" />
          {playing ? "Signal in motion" : "Select a stage"}
        </span>
      </div>
      <div key={s.label} className="min-h-[24rem] p-5 sm:min-h-[19rem] sm:p-7 animate-enter">
        <p className={cn("max-w-2xl text-[1.04rem] leading-relaxed", dark ? "text-fog" : "text-steel")}>{s.summary}</p>
        {s.items && s.items.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {s.items.map((it) => (
              <li
                key={it}
                className={cn("rounded-md px-2.5 py-1.5 text-[0.9rem] ring-1 ring-inset", dark ? "bg-white/[0.06] text-fog ring-line-dark" : "bg-paper text-ink ring-line")}
              >
                {it}
              </li>
            ))}
          </ul>
        )}
        {detail?.(active, true)}
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      {/* Desktop: horizontal rail */}
      <div className="hidden lg:block">
        <div className="relative pb-2">
          <div className={cn("absolute top-[21px] h-px", dark ? "bg-line-dark-strong" : "bg-line-strong")} style={{ left: `${start * 100}%`, right: `${start * 100}%` }} aria-hidden="true" />
          <div
            className="absolute top-[21px] h-[2px] bg-signal transition-[width] duration-[var(--dur-base)] ease-linear motion-reduce:transition-none"
            style={{ left: `${start * 100}%`, width: `${progress * span * 100}%` }}
            aria-hidden="true"
          />
          {!reduced && (
            <span
              className="absolute top-[21px] z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-signal shadow-[0_0_0_5px_rgb(234_62_58/0.16)] transition-[left] duration-[var(--dur-base)] ease-linear"
              style={{ left: `${(start + progress * span) * 100}%` }}
              aria-hidden="true"
            />
          )}
          <ol role="tablist" aria-label={label} className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {stages.map((st, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <li key={st.label} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    id={`${id}-t${i}`}
                    aria-selected={on}
                    aria-controls={`${id}-p`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    onFocus={() => select(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className="group flex w-full flex-col items-center gap-3 px-1 pt-[9px] text-center outline-offset-4"
                  >
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full font-mono text-[0.6rem] transition-all duration-300",
                        on
                          ? "bg-signal text-white shadow-[0_0_0_5px_rgb(234_62_58/0.18)]"
                          : done
                            ? dark
                              ? "bg-white text-ink"
                              : "bg-ink text-white"
                            : dark
                              ? "bg-ink-3 text-mute ring-1 ring-line-dark-strong"
                              : "bg-white text-steel ring-1 ring-line-strong",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[0.72rem] uppercase leading-tight tracking-[0.1em] transition-colors",
                        on ? (dark ? "text-white" : "text-ink") : dark ? "text-mute group-hover:text-fog" : "text-steel group-hover:text-ink",
                      )}
                    >
                      {st.label}
                    </span>
                    <Tag owner={st.owner} />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mt-8">{panel}</div>
      </div>

      {/* Mobile / tablet: vertical rail, one tap target per stage */}
      <div className="lg:hidden">
        <ol role="tablist" aria-orientation="vertical" aria-label={label} className="relative">
          <span className={cn("absolute left-[15px] top-4 bottom-4 w-px", dark ? "bg-line-dark-strong" : "bg-line-strong")} aria-hidden="true" />
          <span
            className="absolute left-[15px] top-4 w-[2px] -translate-x-px bg-signal transition-[height] duration-[var(--dur-base)] ease-linear motion-reduce:transition-none"
            style={{ height: `calc((100% - 2rem) * ${progress})` }}
            aria-hidden="true"
          />
          {stages.map((st, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <li key={st.label} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`${id}-m${i}`}
                  aria-selected={on}
                  aria-controls={`${id}-p`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKey(e, i, true)}
                  className="relative flex min-h-11 w-full items-center gap-4 py-2.5 text-left outline-offset-4"
                >
                  <span
                    className={cn(
                      "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-[0.68rem] transition-all duration-300",
                      on
                        ? "bg-signal text-white shadow-[0_0_0_4px_rgb(234_62_58/0.18)]"
                        : done
                          ? dark
                            ? "bg-white text-ink"
                            : "bg-ink text-white"
                          : dark
                            ? "bg-ink-3 text-mute ring-1 ring-line-dark-strong"
                            : "bg-white text-steel ring-1 ring-line-strong",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn("font-mono text-[0.76rem] uppercase tracking-[0.1em]", on ? (dark ? "text-white" : "text-ink") : dark ? "text-mute" : "text-steel")}>{st.label}</span>
                  <Tag owner={st.owner} />
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-6">{panel}</div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Results } from "@/components/labs/Results";
import { BusinessStep, MarketStep, OperationsStep, PlatformsStep, TeamStep, WorkloadStep } from "@/components/labs/steps";
import { STEPS, useLabsCalculator, type StepId } from "@/lib/labs/state";
import { cn } from "@/lib/cn";

const STEP_COMPONENTS = {
  market: MarketStep,
  business: BusinessStep,
  team: TeamStep,
  workload: WorkloadStep,
  platforms: PlatformsStep,
  operations: OperationsStep,
} as const;

const COMPLETION_EVENT = {
  market: "market_selected",
  business: "business_completed",
  team: "team_completed",
  workload: "workload_completed",
  platforms: "operations_completed",
  operations: "operations_completed",
} as const;

export function Calculator() {
  const ctx = useLabsCalculator();
  const { state, dispatch, context, trackEvent } = ctx;
  const [analysing, setAnalysing] = useState(false);
  const started = useRef(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("labs_tool_viewed", { tool_name: "adops-capacity" });
  }, [trackEvent]);

  const index = STEPS.findIndex((s) => s.id === state.step);
  const onResults = state.step === "results";
  const Step = onResults ? null : STEP_COMPONENTS[state.step as keyof typeof STEP_COMPONENTS];

  const goto = (step: StepId) => {
    dispatch({ type: "goto", step });
    // Move focus to the new step so keyboard and screen-reader users are not
    // left at the bottom of the previous one.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const next = () => {
    if (!started.current) {
      started.current = true;
      trackEvent("adops_tool_started", { tool_name: "adops-capacity", market: state.input.market });
    }
    trackEvent(COMPLETION_EVENT[state.step as keyof typeof COMPLETION_EVENT], { ...context(), step: state.step });
    if (index < STEPS.length - 1) goto(STEPS[index + 1].id);
    else runAnalysis();
  };

  const runAnalysis = () => {
    trackEvent("analysis_started", context());
    setAnalysing(true);
  };

  const onAnalysisDone = () => {
    setAnalysing(false);
    dispatch({ type: "analysed" });
    trackEvent("results_viewed", context());
    trackEvent("tool_completed", context());
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  return (
    <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
      {!onResults && <Rail index={index} visited={state.visited} onPick={goto} />}

      <div ref={headingRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {analysing ? (
          <AnalysisTransition onDone={onAnalysisDone} />
        ) : onResults ? (
          <Results {...ctx} />
        ) : (
          Step && <Step {...ctx} />
        )}
      </div>

      {!onResults && !analysing && (
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => index > 0 && goto(STEPS[index - 1].id)}
            disabled={index === 0}
            className="min-h-11 rounded-full px-5 text-[0.95rem] text-steel outline-offset-4 ring-1 ring-inset ring-line transition-colors duration-200 hover:text-ink hover:ring-line-strong disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-signal-cta px-7 text-[0.98rem] font-medium text-white outline-offset-4 transition-colors duration-200 hover:bg-signal-ink motion-reduce:transition-none"
          >
            {index === STEPS.length - 1 ? "Analyse my ad operations" : "Continue"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Rail({ index, visited, onPick }: { index: number; visited: StepId[]; onPick: (s: StepId) => void }) {
  return (
    <nav aria-label="Calculator progress" className="mb-10 sm:mb-14">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {STEPS.map((s, i) => {
          const done = i < index;
          const current = i === index;
          const reachable = visited.includes(s.id);
          return (
            <li key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => reachable && onPick(s.id)}
                disabled={!reachable}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "min-h-11 rounded-full px-3.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] outline-offset-4 transition-colors duration-200 motion-reduce:transition-none",
                  current ? "bg-ink text-white" : done ? "text-signal-ink hover:bg-signal-soft" : "text-steel",
                  !reachable && "cursor-default opacity-50",
                )}
              >
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-2">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <span aria-hidden="true" className={cn("h-px w-3", done ? "bg-signal" : "bg-line-strong")} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const PHASES = [
  "Analysing team capacity",
  "Calculating operational cost",
  "Evaluating workflow",
  "Identifying externalizable workload",
];

/**
 * A transition, not a progress bar. The calculation is deterministic and already
 * finished; this exists so the shift from questionnaire to results is legible
 * rather than instantaneous. Reduced motion skips it entirely.
 */
function AnalysisTransition({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      return;
    }
    const timers = PHASES.map((_, i) => window.setTimeout(() => setDone(i + 1), 380 * (i + 1)));
    const finish = window.setTimeout(onDone, 380 * PHASES.length + 420);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <div className="grid min-h-[22rem] place-items-center py-16">
      <ul className="grid gap-4" aria-label="Analysis progress">
        {PHASES.map((p, i) => {
          const complete = i < done;
          return (
            <li key={p} className={cn("flex items-center gap-3 text-[1.02rem] transition-colors duration-300 motion-reduce:transition-none", complete ? "text-ink" : "text-fog")}>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full ring-1 ring-inset transition-colors duration-300 motion-reduce:transition-none",
                  complete ? "bg-signal ring-signal" : "ring-line-strong",
                )}
              >
                {complete && (
                  <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.4 4.7 9 10 3.4" />
                  </svg>
                )}
              </span>
              {p}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

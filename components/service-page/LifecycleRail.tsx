"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/useInView";
import { Check } from "@/components/ui/Icons";
import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { duration } from "@/lib/motion/tokens";
import { observeVisibility } from "@/lib/motion/visibility";

const STEP_MS = duration.signalStep;

/**
 * Service hero visual: a campaign moving down its lifecycle, with Trafficomm
 * shown as one continuous layer spanning every stage. A red signal carries
 * the campaign; completed stages tick, the active stage is highlighted.
 */
export function LifecycleRail({ stages }: { stages: readonly string[] }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  const n = stages.length;
  // One extra beat holds the completed lifecycle before looping.
  const step = reduced ? n : tick % (n + 1);

  useEffect(() => {
    if (reduced || !ref.current) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const off = observeVisibility(ref.current, (visible) => {
      clearInterval(timer);
      if (visible) timer = setInterval(() => setTick((t) => t + 1), STEP_MS);
    });
    return () => {
      off();
      clearInterval(timer);
    };
  }, [reduced]);

  const rowH = 100 / n;
  const signalTop = `${(Math.min(step, n - 1) + 0.5) * rowH}%`;

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line"
      role="img"
      aria-label={`Campaign lifecycle handled by Trafficomm: ${stages.join(", ")}`}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-steel">Campaign lifecycle</span>
        <span className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-steel">
          <span className="size-1.5 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" /> Live campaign
        </span>
      </div>
      <div className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[4rem_1fr]">
        {/* Trafficomm layer spanning the whole lifecycle */}
        <div className="relative flex flex-col items-center justify-between border-r border-line bg-ink py-5 text-white">
          <LogoMark className="w-6" inverted />
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-fog [writing-mode:vertical-rl] rotate-180">Trafficomm operations layer</span>
          <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
        </div>
        <div className="relative">
          <span className="absolute bottom-0 left-7 top-0 w-px bg-line" aria-hidden="true" />
          <span
            className="absolute left-7 top-0 w-[2px] -translate-x-[0.5px] bg-signal"
            style={{ height: signalTop, transition: step === 0 ? "none" : `height ${STEP_MS * 0.8}ms var(--ease-out-expo)` }}
            aria-hidden="true"
          />
          {!reduced && (
            <span
              className="absolute left-7 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_0_5px_rgb(234_62_58/0.18)]"
              style={{ top: signalTop, transition: step === 0 ? "none" : `top ${STEP_MS * 0.8}ms var(--ease-out-expo)` }}
              aria-hidden="true"
            />
          )}
          <ol>
            {stages.map((s, i) => {
              const done = i < step;
              const on = i === step;
              return (
                <li key={s} className={cn("relative flex h-14 items-center gap-4 border-b border-line pl-12 pr-5 last:border-0 transition-colors duration-500 sm:h-[3.75rem]", on && "bg-paper")}>
                  <span
                    className={cn(
                      "absolute left-7 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-colors duration-500",
                      done ? "border-ink bg-ink text-white" : on ? "border-signal bg-white" : "border-line-strong bg-white",
                    )}
                    aria-hidden="true"
                  >
                    {done && <Check className="size-3" />}
                  </span>
                  <span className="font-mono text-[0.72rem] text-steel">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("flex-1 text-[1.02rem] tracking-[-0.01em] transition-colors", done || on ? "text-ink" : "text-steel")}>{s}</span>
                  <span className={cn("font-mono text-[0.7rem] uppercase tracking-[0.1em]", on ? "text-signal-ink" : done ? "text-graphite" : "text-steel")}>
                    {done ? "Complete" : on ? "In progress" : "Queued"}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

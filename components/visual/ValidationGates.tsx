"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/useInView";
import { cn } from "@/lib/cn";

/**
 * Checks moving from pending to validated as the signal passes through them.
 *
 * Deliberately not a green success dashboard: a validated check is marked in
 * Trafficomm red, pending is a neutral outline. Under reduced motion every
 * check is validated immediately, so the gate still reads as a complete set.
 */
export function ValidationGates({ checks, running = true, tone = "dark", stepMs = 170 }: { checks: readonly string[]; running?: boolean; tone?: "dark" | "light"; stepMs?: number }) {
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);
  const dark = tone === "dark";
  // Reduced motion / not running: every check is already validated.
  const done = reduced || !running ? checks.length : Math.min(tick, checks.length);

  // One check validates per step; the chain stops by itself at the last one.
  useEffect(() => {
    if (reduced || !running || tick >= checks.length) return;
    const id = setTimeout(() => setTick((t) => t + 1), stepMs);
    return () => clearTimeout(id);
  }, [tick, checks.length, running, reduced, stepMs]);

  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {checks.map((c, i) => {
        const ok = i < done;
        return (
          <li
            key={c}
            className={cn(
              "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-[0.9rem] ring-1 ring-inset transition-colors duration-300 motion-reduce:transition-none",
              dark ? "bg-white/[0.04] ring-line-dark" : "bg-paper ring-line",
              ok && (dark ? "text-white" : "text-ink"),
              !ok && (dark ? "text-mute" : "text-steel"),
            )}
          >
            <span className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-[3px] transition-colors duration-300 motion-reduce:transition-none",
                  ok ? "bg-signal" : dark ? "ring-1 ring-line-dark-strong" : "ring-1 ring-line-strong",
                )}
                aria-hidden="true"
              >
                {ok && (
                  <svg viewBox="0 0 12 12" className="size-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.4 4.7 9 10 3.4" />
                  </svg>
                )}
              </span>
              {c}
            </span>
            <span className={cn("font-mono text-[0.62rem] uppercase tracking-[0.1em]", ok ? "text-signal" : dark ? "text-fog" : "text-steel")}>{ok ? "Validated" : "Pending"}</span>
          </li>
        );
      })}
    </ul>
  );
}

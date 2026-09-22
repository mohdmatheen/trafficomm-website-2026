"use client";

import { useInView, usePrefersReducedMotion } from "@/components/motion/useInView";
import { cn } from "@/lib/cn";

/** 30 cells: the original 4 specialists, then the historical growth to ~30 filling in sequence. */
export function TeamScaleGrid({ start = 4, end = 30 }: { start?: number; end?: number }) {
  const { ref, inView: seen } = useInView<HTMLDivElement>({ threshold: 0.4 });
  // Reduced motion: final state immediately, independent of scroll position.
  const reduced = usePrefersReducedMotion();
  const inView = seen || reduced;
  return (
    <div ref={ref} role="img" aria-label={`The dedicated team scaled from ${start} to approximately ${end} specialists`}>
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {Array.from({ length: end }, (_, i) => {
          const original = i < start;
          return (
            <span
              key={i}
              className={cn(
                "aspect-square rounded-[3px] transition-[background-color,transform] duration-500",
                original ? "bg-ink" : inView ? "bg-signal" : "bg-ink/[0.07]",
                !original && inView && "scale-100",
              )}
              style={{ transitionDelay: original ? "0ms" : `${200 + (i - start) * 45}ms` }}
            />
          );
        })}
      </div>
      <div className="mt-4 flex justify-between font-mono text-[0.75rem] uppercase tracking-[0.1em] text-steel">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-[2px] bg-ink" aria-hidden="true" /> Start · {start}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-[2px] bg-signal" aria-hidden="true" /> Scaled to · ~{end}
        </span>
      </div>
    </div>
  );
}

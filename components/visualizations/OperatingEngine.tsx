"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/components/motion/useInView";
import { engineStages } from "@/data/operations";
import { cn } from "@/lib/cn";
import { Check } from "@/components/ui/Icons";

type ST = { start: number; end: number; kill: () => void };

/**
 * Desktop: the pipeline pins and advances stage-by-stage as the visitor
 * scrolls (GSAP ScrollTrigger, loaded on demand). Stages are also buttons,
 * so keyboard and pointer users can jump directly.
 * Mobile / reduced motion: a vertical, fully expanded workflow.
 */
export function OperatingEngine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<ST | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);
  const n = engineStages.length;
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !rootRef.current || !pinRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top+=72",
          // ~0.75 viewport of pinned scroll for seven stages: each stage gets ~100px of travel, so progress is continuous.
          end: () => `+=${Math.round(window.innerHeight * 0.75)}`,
          pin: true,
          anticipatePin: 1,
          scrub: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            setActive(Math.min(n - 1, Math.floor(self.progress * n)));
          },
        });
        trigger.current = st;
        setPinned(true);
        return () => {
          st.kill();
          trigger.current = null;
          setPinned(false);
        };
      });
      cleanup = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [n, isDesktop]);

  const go = (i: number) => {
    const st = trigger.current;
    if (st) {
      const y = st.start + ((i + 0.5) / n) * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      setActive(i);
      setProgress((i + 0.5) / n);
    }
  };

  const stage = engineStages[active];
  const fill = pinned ? progress : (active + 1) / n;

  return (
    <div ref={rootRef}>
      {/* Desktop pinned engine */}
{isDesktop !== false && (
      <div ref={pinRef} className="hidden pt-10 lg:block">
        <div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-[27px] h-px bg-line-dark-strong" aria-hidden="true" />
            <div
              className="absolute left-0 top-[27px] h-px bg-signal transition-[width] duration-[var(--dur-fast)] ease-linear"
              style={{ width: `${Math.max(0.02, fill) * 100}%` }}
              aria-hidden="true"
            />
            {/* Signal at the head of the progress line: the work currently in motion. */}
            <span
              className="absolute top-[27px] z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_0_4px_rgb(234_62_58/0.2)] transition-[left] duration-[var(--dur-fast)] ease-linear"
              style={{ left: `${Math.max(0.02, fill) * 100}%` }}
              aria-hidden="true"
            />
            <ol className="relative grid grid-cols-7" role="tablist" aria-label="Operating workflow stages">
              {engineStages.map((s, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <li key={s.key} role="presentation">
                    <button
                      type="button"
                      role="tab"
                      id={`eng-tab-${s.key}`}
                      aria-selected={on}
                      aria-controls="eng-panel"
                      onClick={() => go(i)}
                      className="group flex w-full flex-col items-start gap-4 text-left"
                    >
                      <span
                        className={cn(
                          "flex size-14 items-center justify-center rounded-full font-mono text-[0.79rem] transition-all duration-500",
                          on && "bg-signal text-white shadow-[0_0_0_6px_rgb(234_62_58/0.15)]",
                          done && "bg-white text-ink",
                          !on && !done && "bg-ink-3 text-mute ring-1 ring-line-dark-strong group-hover:text-white",
                        )}
                      >
                        {done ? <Check /> : `0${i + 1}`}
                      </span>
                      <span className={cn("text-[1.2rem] tracking-[-0.02em] transition-colors", on ? "text-white" : "text-mute group-hover:text-fog")}>
                        {s.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div
            id="eng-panel"
            role="tabpanel"
            aria-labelledby={`eng-tab-${stage.key}`}
            className="mt-8 grid min-h-[356px] grid-cols-[1fr_1.1fr] overflow-hidden rounded-[var(--radius-panel)] bg-ink-2 ring-1 ring-line-dark"
          >
            <div key={stage.key} className="p-10 animate-enter">
              <p className="eyebrow text-signal">
                Stage 0{active + 1} / 0{n}
              </p>
              <p className="mt-5 text-[3.25rem] leading-none tracking-[-0.045em] text-white">{stage.label}</p>
              <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-fog">{stage.summary}</p>
            </div>
            <div className="border-l border-line-dark bg-ink-3/60 p-10">
              <div className="mb-5 flex items-center justify-between">
                <p className="eyebrow text-mute">Functions</p>
                <p className="eyebrow flex items-center gap-2 text-mute">
                  <span className="size-1.5 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" /> Live stage
                </p>
              </div>
              <ul key={stage.key} className="divide-y divide-line-dark border-y border-line-dark">
                {stage.functions.map((f, i) => (
                  <li
                    key={f}
                    className="flex items-center justify-between py-3.5 text-[1rem] text-white animate-enter"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[0.77rem] text-mute">{String(i + 1).padStart(2, "0")}</span>
                      {f}
                    </span>
                    <Check className="text-signal" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

)}

      {/* Mobile / tablet vertical workflow */}
{isDesktop !== true && (
      <div className="lg:hidden">
        <div className="relative mt-12">
        <span className="absolute bottom-6 left-[19px] top-6 w-px bg-line-dark-strong" aria-hidden="true" />
        <span className="scroll-draw-y absolute bottom-6 left-[19px] top-6 w-px bg-signal" aria-hidden="true" />
        <ol className="relative space-y-4" aria-label="Operating workflow stages">
          {engineStages.map((s, i) => (
            <li key={s.key} className="relative pl-14" data-reveal>
              <span className="absolute left-0 top-5 flex size-10 items-center justify-center rounded-full bg-ink-3 font-mono text-[0.75rem] text-white ring-1 ring-line-dark-strong">
                0{i + 1}
              </span>
              <div className="rounded-[var(--radius-card)] bg-ink-2 p-5 ring-1 ring-line-dark">
                <p className="text-[1.35rem] tracking-[-0.02em] text-white">{s.label}</p>
                <p className="mt-2 text-[1.0rem] leading-relaxed text-fog">{s.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.functions.map((f) => (
                    <li key={f} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.88rem] text-fog">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        </div>
      </div>
)}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/components/motion/useInView";
import { ArrowRight, Plus } from "@/components/ui/Icons";
import type { Service } from "@/data/types";
import { cn } from "@/lib/cn";
import { duration } from "@/lib/motion/tokens";
import { observeVisibility } from "@/lib/motion/visibility";

type Item = Pick<Service, "slug" | "name" | "code" | "short" | "explorer">;
type Stage = Service["explorer"]["flow"][number];

/**
 * Desktop: capability list (35%) + an operating workflow (65%) where a red
 * signal carries work stage to stage and each stage reveals what happens there.
 * Hover, focus, click and arrow keys select a capability.
 * Mobile: accordion; each panel is a vertical workflow with stage details.
 */
export function CapabilityExplorer({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const item = items[active];
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const select = (i: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActive(i);
  };
  const hover = (i: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActive(i), 90);
  };

  return (
    <>
{isDesktop !== false && (
      <div className="hidden gap-10 lg:grid lg:grid-cols-[35%_1fr] xl:gap-14">
        <ol role="tablist" aria-orientation="vertical" aria-label="Capabilities" className="border-t border-line">
          {items.map((it, i) => {
            const on = i === active;
            return (
              <li key={it.slug} role="presentation" className="border-b border-line">
                <button
                  type="button"
                  role="tab"
                  id={`${id}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${id}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onFocus={() => select(i)}
                  onMouseEnter={() => hover(i)}
                  onKeyDown={(e) => {
                    const next = e.key === "ArrowDown" ? (i + 1) % items.length : e.key === "ArrowUp" ? (i - 1 + items.length) % items.length : -1;
                    if (next < 0) return;
                    e.preventDefault();
                    select(next);
                    document.getElementById(`${id}-tab-${next}`)?.focus();
                  }}
                  className="group relative flex w-full items-center gap-5 py-5 pl-5 pr-2 text-left"
                >
                  <span className={cn("absolute left-0 top-0 h-full w-[2px] origin-top bg-signal transition-transform duration-500", on ? "scale-y-100" : "scale-y-0")} aria-hidden="true" />
                  <span className={cn("font-mono text-[0.79rem] transition-colors", on ? "text-signal-ink" : "text-steel")}>{String(i + 1).padStart(2, "0")}</span>
                  {/* Fixed row height: nothing reflows on hover. */}
                  <span className={cn("flex-1 text-[1.4rem] leading-tight tracking-[-0.025em] transition-colors", on ? "text-ink" : "text-steel group-hover:text-ink")}>{it.name}</span>
                  <ArrowRight className={cn("shrink-0 transition-all duration-300", on ? "translate-x-0 text-signal opacity-100" : "-translate-x-1 opacity-0")} />
                </button>
              </li>
            );
          })}
        </ol>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line">
          <div className="flex items-center justify-between border-b border-line px-6 py-3.5">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-steel">{item.code} · Operating workflow</span>
            <span className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-steel">
              <span className="size-1.5 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" /> Work in motion
            </span>
          </div>
          <div className="p-6 xl:p-8">
            <p key={`${item.slug}-lede`} className="max-w-xl text-[1.06rem] leading-relaxed text-steel animate-enter">
              <span className="text-ink">{item.name}.</span> {item.short}
            </p>
            <WorkflowTrack key={item.slug} stages={item.explorer.flow} />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <ul className="flex flex-wrap gap-1.5" aria-label={`${item.name} capabilities`}>
                {item.explorer.capabilities.map((c) => (
                  <li key={c} className="rounded-md bg-paper px-2.5 py-1 text-[0.86rem] text-graphite ring-1 ring-inset ring-line">
                    {c}
                  </li>
                ))}
              </ul>
              <Link href={`/services/${item.slug}`} className="group inline-flex shrink-0 items-center gap-2 text-[0.96rem] font-medium text-ink">
                Explore {item.name} <ArrowRight className="text-signal transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

)}

      {/* Mobile accordion */}
{isDesktop !== true && (
      <ul className="divide-y divide-line border-y border-line lg:hidden">
        {items.map((it, i) => {
          const open = openMobile === i;
          const pid = `${id}-m-${i}`;
          return (
            <li key={it.slug}>
              <button type="button" aria-expanded={open} aria-controls={pid} onClick={() => setOpenMobile(open ? null : i)} className="flex w-full items-center gap-4 py-5 text-left">
                <span className={cn("font-mono text-[0.79rem]", open ? "text-signal-ink" : "text-steel")}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[1.35rem] leading-tight tracking-[-0.025em] text-ink">{it.name}</span>
                <Plus className={cn("size-5 shrink-0 transition-transform duration-300", open ? "rotate-45 text-signal" : "text-steel")} />
              </button>
              {open && <div id={pid} className="pb-7">
                <p className="text-[1.03rem] leading-relaxed text-steel">{it.short}</p>
                <ol className="mt-6" aria-label={`${it.name} operating workflow`}>
                  {it.explorer.flow.map((s, k) => (
                    <li key={s.label} className="relative flex gap-4 pb-5 last:pb-0">
                      {k < it.explorer.flow.length - 1 && <span className="absolute left-[11px] top-7 h-[calc(100%-20px)] w-px bg-line-strong" aria-hidden="true" />}
                      <span className={cn("relative mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.66rem]", k === 0 ? "bg-signal-cta text-white" : "bg-white text-ink ring-1 ring-line-strong")}>{k + 1}</span>
                      <span>
                        <span className="block font-mono text-[0.86rem] uppercase tracking-[0.08em] text-ink">{s.label}</span>
                        <span className="mt-1 block text-[0.94rem] leading-snug text-steel">{s.details.join(" · ")}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <Link href={`/services/${it.slug}`} className="mt-6 inline-flex items-center gap-2 text-[0.98rem] font-medium text-ink">
                  Explore {it.name} <ArrowRight className="text-signal" />
                </Link>
              </div>}
            </li>
          );
        })}
      </ul>
)}
    </>
  );
}

const STEP_MS = duration.signalStep;

/**
 * Horizontal operating workflow. A red signal travels the track at constant
 * speed; the stage it reaches lights up and reveals its detail. Clicking a
 * stage jumps to it and pauses auto-advance briefly. Labels alternate above
 * and below the track so long stage names have room.
 */
export function WorkflowTrack({ stages, tone = "light" }: { stages: readonly Stage[]; tone?: "light" | "dark" }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pauseTicks = useRef(0);
  const cur = useRef(0);
  const [current, setCurrent] = useState(0);
  const [wrapping, setWrapping] = useState(false);
  const n = stages.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const dark = tone === "dark";

  useEffect(() => {
    if (reduced || !ref.current) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const off = observeVisibility(ref.current, (visible) => {
      clearInterval(timer);
      if (!visible) return;
      timer = setInterval(() => {
        // After a manual jump, hold the chosen stage for a few beats.
        if (pauseTicks.current > 0) {
          pauseTicks.current -= 1;
          return;
        }
        const next = (cur.current + 1) % n;
        cur.current = next;
        setWrapping(next === 0);
        setCurrent(next);
      }, STEP_MS);
    });
    return () => {
      off();
      clearInterval(timer);
    };
  }, [n, reduced]);

  const jump = (i: number) => {
    pauseTicks.current = 4;
    cur.current = i;
    setWrapping(false);
    setCurrent(i);
  };

  const stage = stages[current];
  const ease = `${STEP_MS * 0.9}ms linear`;

  return (
    <div ref={ref} className="mt-8">
      <div className="relative h-[168px]">
        <div className={cn("absolute top-1/2 h-px -translate-y-1/2", dark ? "bg-line-dark-strong" : "bg-line-strong")} style={{ left: `${x(0)}%`, right: `${100 - x(n - 1)}%` }} aria-hidden="true" />
        <div
          className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-signal"
          style={{ left: `${x(0)}%`, width: `${x(current) - x(0)}%`, transition: wrapping ? "none" : `width ${ease}` }}
          aria-hidden="true"
        />
        {!reduced && (
          <span
            className="pointer-events-none absolute top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_0_5px_rgb(234_62_58/0.18)]"
            style={{ left: `${x(current)}%`, transition: wrapping ? "none" : `left ${ease}` }}
            aria-hidden="true"
          />
        )}
        <ol className="absolute inset-0" aria-label="Workflow stages">
          {stages.map((s, i) => {
            const on = i === current;
            const done = i < current;
            const above = i % 2 === 0;
            return (
              <li key={s.label} className="absolute top-0 h-full -translate-x-1/2" style={{ left: `${x(i)}%`, width: `${(200 / n) * 0.96}%` }}>
                <button type="button" onClick={() => jump(i)} aria-current={on ? "step" : undefined} className="group absolute inset-x-0 top-0 flex h-full flex-col items-center">
                  <span className={cn("flex h-1/2 w-full flex-col items-center px-1 text-center", above ? "justify-end pb-5" : "invisible")}>
                    {above && <StageLabel i={i} label={s.label} on={on} done={done} dark={dark} />}
                  </span>
                  <span
                    className={cn(
                      "absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 transition-colors duration-300",
                      on
                        ? cn("border-signal", dark ? "bg-ink" : "bg-white")
                        : done
                          ? dark
                            ? "border-white bg-white"
                            : "border-ink bg-ink"
                          : dark
                            ? "border-line-dark-strong bg-ink group-hover:border-white"
                            : "border-line-strong bg-white group-hover:border-ink",
                    )}
                    aria-hidden="true"
                  />
                  <span className={cn("flex h-1/2 w-full flex-col items-center px-1 text-center", !above ? "justify-start pt-5" : "invisible")}>
                    {!above && <StageLabel i={i} label={s.label} on={on} done={done} dark={dark} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={cn("mt-4 grid grid-cols-[auto_1fr] items-start gap-6 rounded-[var(--radius-card)] p-5 ring-1", dark ? "bg-ink-2 ring-line-dark" : "bg-paper ring-line")} aria-live="polite">
        <div className="min-w-[9rem]">
          <p className={cn("font-mono text-[0.75rem] uppercase tracking-[0.12em]", dark ? "text-signal" : "text-signal-ink")}>
            Stage {String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
          <p key={stage.label} className={cn("mt-2 text-[1.6rem] leading-none tracking-[-0.03em] animate-enter", dark ? "text-white" : "text-ink")}>
            {stage.label}
          </p>
        </div>
        <ul key={`${stage.label}-d`} className="flex flex-wrap gap-2 pt-1">
          {stage.details.map((d, k) => (
            <li
              key={d}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-[0.96rem] ring-1 animate-enter",
                dark ? "bg-white/[0.05] text-white ring-line-dark" : "bg-white text-ink ring-line",
              )}
              style={{ animationDelay: `${60 + k * 50}ms` }}
            >
              <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StageLabel({ i, label, on, done, dark }: { i: number; label: string; on: boolean; done: boolean; dark: boolean }) {
  return (
    <>
      <span className={cn("font-mono text-[0.68rem]", on ? (dark ? "text-signal" : "text-signal-ink") : dark ? "text-mute" : "text-steel")}>{String(i + 1).padStart(2, "0")}</span>
      <span
        className={cn(
          "mt-1 font-mono text-[0.76rem] uppercase leading-tight tracking-[0.06em] transition-colors",
          on ? (dark ? "text-white" : "text-ink") : done ? (dark ? "text-fog" : "text-graphite") : dark ? "text-mute" : "text-steel",
        )}
      >
        {label}
      </span>
    </>
  );
}

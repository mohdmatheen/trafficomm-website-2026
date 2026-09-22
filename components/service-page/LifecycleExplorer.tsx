"use client";

import { useId, useState } from "react";
import { Plus } from "@/components/ui/Icons";
import type { ServicePageContent } from "@/data/service-pages/types";
import { cn } from "@/lib/cn";

type Stage = ServicePageContent["lifecycle"]["stages"][number];

/**
 * Desktop: horizontal stage rail + detail panel (click, hover, focus, arrows).
 * Mobile: vertical accordion lifecycle.
 */
export function LifecycleExplorer({ stages }: { stages: readonly Stage[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const n = stages.length;
  const s = stages[active];

  const focusTab = (i: number) => {
    setActive(i);
    document.getElementById(`${id}-t${i}`)?.focus();
  };

  return (
    <>
      <div className="hidden lg:block">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[22px] h-px bg-line-strong" aria-hidden="true" />
          <div className="absolute left-0 top-[22px] h-[2px] bg-signal transition-[width] duration-500 ease-[var(--ease-out-expo)]" style={{ width: `${((active + 0.5) / n) * 100}%` }} aria-hidden="true" />
          <ol role="tablist" aria-label="Campaign lifecycle stages" className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {stages.map((st, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <li key={st.code} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    id={`${id}-t${i}`}
                    aria-selected={on}
                    aria-controls={`${id}-p`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") {
                        e.preventDefault();
                        focusTab((i + 1) % n);
                      } else if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        focusTab((i - 1 + n) % n);
                      }
                    }}
                    className="group flex w-full flex-col items-center gap-3 px-1 text-center"
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full font-mono text-[0.75rem] transition-all duration-300",
                        on ? "bg-ink text-white shadow-[0_0_0_5px_rgb(234_62_58/0.2)]" : done ? "bg-white text-ink ring-1 ring-ink" : "bg-white text-steel ring-1 ring-line-strong group-hover:text-ink",
                      )}
                    >
                      {st.code}
                    </span>
                    <span className={cn("text-[0.98rem] leading-tight tracking-[-0.01em] transition-colors", on ? "text-ink" : "text-steel group-hover:text-ink")}>{st.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div id={`${id}-p`} role="tabpanel" aria-labelledby={`${id}-t${active}`} className="mt-10 grid grid-cols-[1fr_1.35fr] overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line">
          <div key={s.code} className="p-9 [animation:engine-in_0.4s_var(--ease-out-expo)_both]">
            <p className="font-mono text-[0.79rem] uppercase tracking-[0.12em] text-signal-ink">
              Stage {s.code} / {String(n).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-[2.4rem] leading-none tracking-[-0.04em] text-ink">{s.title}</h3>
            <p className="mt-5 max-w-sm text-[1.06rem] leading-relaxed text-steel">{s.summary}</p>
          </div>
          <div className="border-l border-line bg-paper p-9">
            <p className="eyebrow mb-5 text-steel">What Trafficomm handles</p>
            <ul key={`${s.code}-i`} className="grid grid-cols-2 gap-2">
              {s.items.map((it, k) => (
                <li
                  key={it}
                  className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-[1rem] text-ink ring-1 ring-line [animation:engine-in_0.4s_var(--ease-out-expo)_both]"
                  style={{ animationDelay: `${50 + k * 40}ms` }}
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ol className="lg:hidden" aria-label="Campaign lifecycle stages">
        {stages.map((st, i) => {
          const isOpen = open === i;
          const pid = `${id}-m${i}`;
          return (
            <li key={st.code} className="relative pl-12">
              {i < n - 1 && <span className="absolute bottom-0 left-[19px] top-10 w-px bg-line-strong" aria-hidden="true" />}
              <span className={cn("absolute left-0 top-3 flex size-10 items-center justify-center rounded-full font-mono text-[0.72rem]", isOpen ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line-strong")}>{st.code}</span>
              <button type="button" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="text-[1.2rem] tracking-[-0.02em] text-ink">{st.title}</span>
                <Plus className={cn("size-5 shrink-0 transition-transform duration-300", isOpen ? "rotate-45 text-signal" : "text-steel")} />
              </button>
              <div id={pid} hidden={!isOpen} className="pb-6">
                <p className="text-[1rem] leading-relaxed text-steel">{st.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {st.items.map((it) => (
                    <li key={it} className="rounded-md bg-white px-3 py-1.5 text-[0.94rem] text-ink ring-1 ring-line">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { platforms } from "@/data/platforms";
import { cn } from "@/lib/cn";
import { ArrowRight, Plus } from "@/components/ui/Icons";
import { LogoMark } from "@/components/ui/Logo";

/**
 * Desktop: radial ecosystem — hover, focus or click a platform to see what
 * Trafficomm operates on it. Mobile: expandable platform cards.
 */
export function PlatformOrbit() {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const baseId = useId();
  const p = platforms[active];
  const n = platforms.length;

  const pos = (i: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    // Rounded so server and client produce identical style strings.
    return { x: Math.round((50 + Math.cos(a) * 41) * 100) / 100, y: Math.round((50 + Math.sin(a) * 41) * 100) / 100 };
  };

  return (
    <>
      {/* Desktop radial */}
      <div className="hidden items-center gap-12 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[620px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="50" cy="50" r="41" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="27" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="0.2" strokeDasharray="0.6 1.2" />
            {platforms.map((_, i) => {
              const { x, y } = pos(i);
              const on = i === active;
              return (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={on ? "#ea3e3a" : "white"}
                  strokeOpacity={on ? 0.9 : 0.1}
                  strokeWidth={on ? 0.35 : 0.2}
                  strokeDasharray={on ? "1 1" : undefined}
                  className={on ? "animate-dash" : undefined}
                  style={{ transition: "stroke 0.4s, stroke-opacity 0.4s" }}
                />
              );
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 flex size-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-ink-3 ring-1 ring-line-dark-strong shadow-[0_0_80px_rgb(234_62_58/0.25)]">
            <LogoMark className="w-[34%]" inverted />
            <span className="mt-2 font-brand text-[0.93rem] font-semibold text-white">Trafficomm</span>
            <span className="eyebrow mt-1 !text-[0.62rem] text-signal">One ops team</span>
          </div>

          <ul role="tablist" aria-label="Platforms" aria-orientation="vertical">
            {platforms.map((pl, i) => {
              const { x, y } = pos(i);
              const on = i === active;
              return (
                <li key={pl.slug} role="presentation" className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                  <button
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${i}`}
                    aria-selected={on}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={on ? 0 : -1}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                        e.preventDefault();
                        const next = (i + 1) % n;
                        setActive(next);
                        document.getElementById(`${baseId}-tab-${next}`)?.focus();
                      }
                      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                        e.preventDefault();
                        const prev = (i - 1 + n) % n;
                        setActive(prev);
                        document.getElementById(`${baseId}-tab-${prev}`)?.focus();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[0.98rem] transition-all duration-300",
                      on
                        ? "bg-white text-ink shadow-[0_0_0_6px_rgb(234_62_58/0.18)]"
                        : "bg-ink-2 text-fog ring-1 ring-line-dark-strong hover:text-white",
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", on ? "bg-signal" : "bg-mute")} aria-hidden="true" />
                    {pl.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="rounded-[var(--radius-panel)] bg-ink-2 p-8 ring-1 ring-line-dark"
        >
          <div key={p.slug} className="animate-enter">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-signal">{p.category}</p>
              <p className="eyebrow text-mute">
                {String(active + 1).padStart(2, "0")} / {n}
              </p>
            </div>
            <p className="mt-5 text-[2.4rem] leading-none tracking-[-0.04em] text-white">{p.name}</p>
            <p className="mt-1 text-[0.98rem] text-mute">{p.short}</p>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-fog">{p.intro}</p>
            <p className="eyebrow mt-7 mb-3 text-mute">What we operate</p>
            <ul className="grid gap-px overflow-hidden rounded-lg bg-line-dark">
              {p.capabilities.map((c) => (
                <li key={c} className="flex items-center gap-3 bg-ink-2 px-4 py-2.5 text-[0.98rem] text-white">
                  <span className="size-1 rounded-full bg-signal" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
            <Link href={`/platforms/${p.slug}`} className="group mt-7 inline-flex items-center gap-2 text-[0.98rem] font-medium text-white">
              {p.name} operations <ArrowRight className="text-signal transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="grid gap-2 sm:grid-cols-2 lg:hidden">
        {platforms.map((pl, i) => {
          const open = openMobile === i;
          const id = `${baseId}-m-${i}`;
          return (
            <li key={pl.slug} className="rounded-[var(--radius-card)] bg-ink-2 ring-1 ring-line-dark">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpenMobile(open ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span>
                  <span className="block text-[1.15rem] tracking-[-0.02em] text-white">{pl.name}</span>
                  <span className="eyebrow mt-1.5 block !text-[0.66rem] text-mute">{pl.category}</span>
                </span>
                <Plus className={cn("text-fog transition-transform duration-300", open && "rotate-45 text-signal")} />
              </button>
              <div id={id} hidden={!open} className="px-5 pb-5">
                <ul className="flex flex-wrap gap-1.5">
                  {pl.capabilities.map((c) => (
                    <li key={c} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.86rem] text-fog">
                      {c}
                    </li>
                  ))}
                </ul>
                <Link href={`/platforms/${pl.slug}`} className="mt-4 inline-flex items-center gap-2 text-[0.96rem] text-white">
                  {pl.name} operations <ArrowRight className="text-signal" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

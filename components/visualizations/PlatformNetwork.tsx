"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useMediaQuery, usePauseSvgWhenHidden, usePrefersReducedMotion } from "@/components/motion/useInView";
import { ArrowRight, ChevronDown } from "@/components/ui/Icons";
import { LogoMark } from "@/components/ui/Logo";
import { PlatformMark } from "@/components/ui/PlatformMark";
import type { Platform } from "@/data/types";
import { cn } from "@/lib/cn";

type Item = Pick<Platform, "slug" | "name" | "officialName" | "category" | "ecosystem">;

const R = 38; // node ring radius, % of the square
const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Signature ecosystem diagram. Every platform connects to the Trafficomm
 * operations node; data particles travel inward along each path. Selecting a
 * platform (hover, focus, click or arrow keys) turns its path red, dims the
 * rest and reveals what Trafficomm operates there.
 */
export function PlatformNetwork({ items, panelLabel = "What Trafficomm operates" }: { items: Item[]; panelLabel?: string }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const rawId = useId();
  // SMIL syncbase references (id.begin / id.end) need a plain identifier.
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const handshake = useRef<SVGAnimateMotionElement>(null);
  usePauseSvgWhenHidden(svgRef);

  // Handshake: when a platform becomes active, one signal travels Trafficomm → platform → Trafficomm.
  useEffect(() => {
    if (!reduced) handshake.current?.beginElement();
  }, [active, reduced]);
  const n = items.length;
  const p = items[active];

  const pos = (i: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: round(50 + Math.cos(a) * R), y: round(50 + Math.sin(a) * R) };
  };
  // Slightly curved connector from node to core, as an SVG path in 0–100 space.
  const pathFor = (i: number) => {
    const { x, y } = pos(i);
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const cx = round(50 + Math.cos(a + 0.35) * R * 0.5);
    const cy = round(50 + Math.sin(a + 0.35) * R * 0.5);
    return `M${x} ${y} Q${cx} ${cy} 50 50`;
  };

  const focusTab = (i: number) => {
    setActive(i);
    document.getElementById(`${id}-tab-${i}`)?.focus();
  };

  return (
    <>
      {/* Desktop network. Both variants server-render (no layout shift); the unused one unmounts after hydration. */}
      {isDesktop !== false && (
      <div className="hidden items-center gap-12 lg:grid lg:grid-cols-[1.2fr_0.8fr] xl:gap-16">
        <div className="relative mx-auto aspect-square w-full max-w-[640px]">
          <svg ref={svgRef} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <circle cx="50" cy="50" r={R} fill="none" stroke="white" strokeOpacity="0.07" strokeWidth="0.15" />
            <circle cx="50" cy="50" r={R * 0.62} fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="0.15" strokeDasharray="0.4 1.2" />
            {items.map((it, i) => {
              const on = i === active;
              const d = pathFor(i);
              return (
                <g key={it.slug} style={{ opacity: on ? 1 : 0.55, transition: "opacity 0.4s" }}>
                  <path id={`${id}-p${i}`} d={d} fill="none" stroke={on ? "#ea3e3a" : "white"} strokeOpacity={on ? 0.95 : 0.16} strokeWidth={on ? 0.35 : 0.18} style={{ transition: "stroke 0.4s, stroke-opacity 0.4s" }} />
                  {!reduced &&
                    (on ? [0, 0.33, 0.66] : [((i * 0.37) % 1)]).map((off, k) => (
                      <circle key={k} r={on ? 0.75 : 0.45} fill={on ? "#ea3e3a" : "#ffffff"} opacity={on ? 1 : 0.5}>
                        <animateMotion dur={on ? "1.6s" : `${3.2 + (i % 3) * 0.6}s`} begin={`${-off * (on ? 1.6 : 3.2)}s`} repeatCount="indefinite" rotate="auto">
                          <mpath href={`#${id}-p${i}`} />
                        </animateMotion>
                      </circle>
                    ))}
                </g>
              );
            })}
            {!reduced && (
              <circle r="1.1" fill="#ea3e3a" opacity="0">
                <animateMotion ref={handshake} id={`${id}-hs`} begin="indefinite" dur="0.5s" keyPoints="1;0" keyTimes="0;1" calcMode="linear" fill="freeze">
                  <mpath href={`#${id}-p${active}`} />
                </animateMotion>
                <animateMotion begin={`${id}-hs.end`} dur="0.5s" fill="freeze">
                  <mpath href={`#${id}-p${active}`} />
                </animateMotion>
                <set attributeName="opacity" to="1" begin={`${id}-hs.begin`} />
                <set attributeName="opacity" to="0" begin={`${id}-hs.end+0.5s`} />
              </circle>
            )}
          </svg>

          {/* Trafficomm operations node */}
          <div className="absolute left-1/2 top-1/2 flex size-[23%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-ink-3 ring-1 ring-line-dark-strong">
            <span className="absolute inset-[-7%] rounded-full ring-1 ring-signal/40" aria-hidden="true" />
            <LogoMark className="w-[32%]" inverted />
            <span className="mt-2 font-brand text-[0.9rem] font-semibold text-white">Trafficomm</span>
            <span className="eyebrow mt-1 !text-[0.58rem] text-mute">Operations layer</span>
          </div>

          <ul role="tablist" aria-label="Platforms" aria-orientation="horizontal">
            {items.map((it, i) => {
              const { x, y } = pos(i);
              const on = i === active;
              return (
                <li key={it.slug} role="presentation" className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                  <button
                    type="button"
                    role="tab"
                    id={`${id}-tab-${i}`}
                    aria-selected={on}
                    aria-controls={`${id}-panel`}
                    aria-label={it.officialName ? `${it.name} (${it.officialName})` : it.name}
                    tabIndex={on ? 0 : -1}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                        e.preventDefault();
                        focusTab((i + 1) % n);
                      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                        e.preventDefault();
                        focusTab((i - 1 + n) % n);
                      }
                    }}
                    className="group relative flex flex-col items-center gap-2 rounded-2xl p-1"
                  >
                    <span
                      className={cn(
                        "rounded-[16px] transition-[transform,box-shadow,opacity] duration-400",
                        on ? "scale-110 opacity-100 shadow-[0_0_0_2px_#ea3e3a,0_0_0_7px_rgb(234_62_58/0.18)]" : "opacity-80 group-hover:opacity-100",
                      )}
                    >
                      <PlatformMark slug={it.slug} size={56} />
                    </span>
                    {on && !reduced && (
                      <span key={`pulse-${active}`} className="pointer-events-none absolute left-1/2 top-[32px] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
                        <span className="block size-14 rounded-[16px] opacity-0 ring-1 ring-signal [animation:ring-out_var(--dur-burst)_var(--ease-out-expo)]" />
                      </span>
                    )}
                    <span className={cn("whitespace-nowrap font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors", on ? "text-white" : "text-mute")}>{it.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="rounded-[var(--radius-panel)] bg-ink-2 ring-1 ring-line-dark">
          <div className="flex items-center justify-between border-b border-line-dark px-7 py-3.5">
            <span className="eyebrow !text-[0.68rem] text-mute">Platform experience</span>
            <span className="font-mono text-[0.72rem] text-mute tabular">
              {String(active + 1).padStart(2, "0")} / {n}
            </span>
          </div>
          <div key={p.slug} className="p-7 animate-enter">
            <div className="flex items-center gap-4">
              <PlatformMark slug={p.slug} size={64} scale={1.05} />
              <div>
                <p className="text-[2rem] leading-none tracking-[-0.04em] text-white">{p.name}</p>
                <p className="mt-2 text-[0.92rem] text-mute">
                  {p.officialName ? `${p.officialName} · ` : ""}
                  {p.category}
                </p>
              </div>
            </div>
            <p className="eyebrow mt-8 mb-3 !text-[0.68rem] text-mute">{panelLabel}</p>
            <ul className="grid gap-px overflow-hidden rounded-lg bg-line-dark">
              {p.ecosystem.map((c, i) => (
                <li
                  key={c}
                  className="flex items-center justify-between bg-ink-2 px-4 py-2.5 text-[1.0rem] text-white animate-enter"
                  style={{ animationDelay: `${60 + i * 40}ms` }}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[0.68rem] text-mute">{String(i + 1).padStart(2, "0")}</span>
                    {c}
                  </span>
                  <span className="size-1 rounded-full bg-signal" aria-hidden="true" />
                </li>
              ))}
            </ul>
            <Link href={`/platforms/${p.slug}`} className="group mt-7 inline-flex items-center gap-2 text-[0.98rem] font-medium text-white">
              {p.name} operations <ArrowRight className="text-signal transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      )}

      {/* Mobile: trunk-and-branch list */}
      {isDesktop !== true && (
      <div className="lg:hidden">
        <div className="flex items-center gap-3 rounded-[var(--radius-card)] bg-ink-3 px-4 py-3 ring-1 ring-line-dark-strong">
          <span className="flex size-10 items-center justify-center rounded-full bg-ink ring-1 ring-signal/40">
            <LogoMark className="w-5" inverted />
          </span>
          <span>
            <span className="block font-brand text-[1.03rem] font-semibold text-white">Trafficomm</span>
            <span className="eyebrow block !text-[0.62rem] text-mute">Operations layer · 10 platforms</span>
          </span>
        </div>
        <ul className="relative ml-5 border-l border-line-dark-strong pt-2">
          {items.map((it, i) => {
            const open = openMobile === i;
            const pid = `${id}-m-${i}`;
            return (
              <li key={it.slug} className="relative pl-5 pt-2">
                <span className={cn("absolute left-0 top-[2.1rem] h-px w-5 transition-colors", open ? "bg-signal" : "bg-line-dark-strong")} aria-hidden="true" />
                <div className={cn("rounded-[var(--radius-card)] ring-1 transition-colors", open ? "bg-ink-2 ring-signal/40" : "bg-ink-2 ring-line-dark")}>
                  <button type="button" aria-expanded={open} aria-controls={pid} onClick={() => setOpenMobile(open ? null : i)} className="flex w-full items-center gap-3 p-3 text-left">
                    <PlatformMark slug={it.slug} size={44} />
                    <span className="flex-1">
                      <span className="block text-[1.05rem] tracking-[-0.015em] text-white">{it.name}</span>
                      <span className="eyebrow mt-1 block !text-[0.62rem] text-mute">{it.officialName ?? it.category}</span>
                    </span>
                    <ChevronDown className={cn("size-4 text-fog transition-transform duration-300", open && "rotate-180 text-signal")} />
                  </button>
                  {open && <div id={pid} className="px-3 pb-4">
                    <ul className="flex flex-wrap gap-1.5">
                      {it.ecosystem.map((c) => (
                        <li key={c} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.88rem] text-fog">
                          {c}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/platforms/${it.slug}`} className="mt-4 inline-flex items-center gap-2 text-[0.96rem] text-white">
                      {it.name} operations <ArrowRight className="text-signal" />
                    </Link>
                  </div>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      )}
    </>
  );
}

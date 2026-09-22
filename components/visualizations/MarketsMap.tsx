"use client";

import { useRef, useState, type ReactNode } from "react";
import { useInView, usePauseSvgWhenHidden } from "@/components/motion/useInView";
import { cn } from "@/lib/cn";

export type MapMarket = {
  code: string;
  name: string;
  center: { x: number; y: number };
  path: string;
  label: { x: number; y: number; anchor: "start" | "middle" | "end" };
};

/**
 * Markets-supported overlay. Deliberately no office pins: markets are shown as
 * highlighted territory with campaign routes from the centralized operation.
 */
export function MarketsMap({
  width,
  height,
  markets,
  hub,
  children,
}: {
  width: number;
  height: number;
  markets: MapMarket[];
  hub: { x: number; y: number };
  /** Server-rendered base map layer. */
  children: ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const svgRef = useRef<SVGSVGElement>(null);
  usePauseSvgWhenHidden(svgRef);
  const viewBox = `0 0 ${width} ${height}`;

  const arc = (to: { x: number; y: number }) => {
    const mx = (hub.x + to.x) / 2;
    const my = Math.min(hub.y, to.y) - Math.hypot(to.x - hub.x, to.y - hub.y) * 0.35;
    return `M${hub.x} ${hub.y} Q${mx} ${my} ${to.x} ${to.y}`;
  };

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-[1fr_17rem] lg:items-center">
      {/* On small screens the map is enlarged and shifted to the Europe–Asia–Oceania region where all markets sit. */}
      <div className="relative overflow-hidden">
        <div className="max-md:ml-[-88%] max-md:w-[188%]">
        <svg ref={svgRef} viewBox={viewBox} className="h-auto w-full" role="img" aria-label="World map highlighting markets supported: Saudi Arabia, UAE, Qatar, Kuwait, Lebanon and Australia, connected to Trafficomm's centralized operations.">
          {children}

          {markets.map((m, i) => (
            <path
              key={`route-${m.code}`}
              d={arc(m.center)}
              fill="none"
              stroke="#ea3e3a"
              strokeWidth={active === m.code ? 1.6 : 1}
              strokeOpacity={active && active !== m.code ? 0.2 : 0.75}
              strokeDasharray="600"
              strokeDashoffset={inView ? 0 : 600}
              style={{ transition: `stroke-dashoffset 1.6s var(--ease-out-expo) ${i * 0.15}s, stroke-opacity 0.3s` }}
            />
          ))}

          {markets.map((m) => {
            const on = !active || active === m.code;
            return (
              <g key={m.code} opacity={on ? 1 : 0.4} style={{ transition: "opacity 0.3s" }}>
                {m.path && <path d={m.path} fill="none" stroke="#ea3e3a" strokeWidth={active === m.code ? 4 : 3.2} strokeLinecap="round" style={{ transition: "stroke-width 0.3s" }} />}
                <circle cx={m.center.x} cy={m.center.y} r={active === m.code ? 5 : 3.6} fill="#ea3e3a" style={{ transition: "r 0.3s" }} />
                <circle cx={m.center.x} cy={m.center.y} r="3.2" fill="none" stroke="#ea3e3a">
                  <animate attributeName="r" values="3.2;11;3.2" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                </circle>
                <line x1={m.center.x} y1={m.center.y} x2={m.label.x} y2={m.label.y - 4} stroke="#0c0c0d" strokeOpacity="0.35" strokeWidth="0.7" className="max-md:hidden" />
                <text
                  x={m.label.x + (m.label.anchor === "start" ? 3 : m.label.anchor === "end" ? -3 : 0)}
                  y={m.label.y}
                  textAnchor={m.label.anchor}
                  fontSize="14"
                  fontWeight={active === m.code ? 600 : 400}
                  className="fill-ink font-mono uppercase max-md:hidden"
                  letterSpacing="1"
                >
                  {m.name}
                </text>
              </g>
            );
          })}

          <g>
            <circle cx={hub.x} cy={hub.y} r="6" fill="#0c0c0d" />
            <circle cx={hub.x} cy={hub.y} r="2.4" fill="#fff" />
            <text x={hub.x} y={hub.y + 22} textAnchor="middle" fontSize="13" className="fill-steel font-mono uppercase max-md:hidden" letterSpacing="1">
              Centralized operations
            </text>
          </g>
        </svg>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-4 text-steel">Markets supported</p>
        <ul className="divide-y divide-line border-y border-line">
          {markets.map((m, i) => (
            <li key={m.code}>
              <button
                type="button"
                aria-pressed={active === m.code}
                onClick={() => setActive((a) => (a === m.code ? null : m.code))}
                onMouseEnter={() => setActive(m.code)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(m.code)}
                onBlur={() => setActive(null)}
                className={cn(
                  "flex w-full items-center justify-between py-3.5 text-left text-[1.05rem] tracking-[-0.01em] transition-colors",
                  active === m.code ? "text-signal-ink" : "text-ink",
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[0.75rem] text-steel" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  {m.name}
                </span>
                <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.93rem] leading-relaxed text-steel">
          Campaign experience across these markets, delivered from one centralized operations team.
        </p>
      </div>
    </div>
  );
}

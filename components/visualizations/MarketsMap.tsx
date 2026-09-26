"use client";

import { useRef, type ReactNode } from "react";
import { usePauseSvgWhenHidden } from "@/components/motion/useInView";

export type MapMarket = {
  code: string;
  name: string;
  center: { x: number; y: number };
  label: { x: number; y: number; anchor: "start" | "middle" | "end" };
};

/**
 * Markets-supported overlay.
 *
 * Territory is left in the neutral base dot field — shading whole countries red
 * read as "we are everywhere in this country", which is not the claim. The claim
 * is: campaign work comes into one operations hub in India, and execution,
 * reporting and output go back out to the markets. So markets are single dots,
 * India is the only hub marker, and the arcs carry traffic in both directions.
 *
 * Motion is SMIL on paths that already exist, so there is no animation library
 * and nothing to run on the main thread. `usePauseSvgWhenHidden` stops it
 * offscreen; `.map-flow` is hidden under prefers-reduced-motion, which leaves
 * the routes and dots drawn but still.
 */
export function MarketsMap({
  viewBox,
  markets,
  hub,
  hubLabel,
  indiaPath,
  children,
}: {
  /** Cropped to the operating region — see VIEW in WorldMap. */
  viewBox: string;
  markets: MapMarket[];
  hub: { x: number; y: number };
  hubLabel: { x: number; y: number; anchor: "start" | "middle" | "end" };
  /** India's own dots, drawn darker than the base field so the hub sits on identifiable land. */
  indiaPath: string;
  /** Server-rendered base map layer. */
  children: ReactNode;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  usePauseSvgWhenHidden(svgRef);

  /**
   * Bows each route perpendicular to its own chord, always to the side with the
   * smaller y, so a route to Australia sweeps out over the ocean instead of
   * looping north over Asia the way a fixed upward control point did.
   */
  const arc = (to: { x: number; y: number }) => {
    const dx = to.x - hub.x;
    const dy = to.y - hub.y;
    const len = Math.hypot(dx, dy) || 1;
    const sign = -dx > 0 ? -1 : 1; // pick the normal that lifts the curve
    const nx = (-dy / len) * sign;
    const ny = (dx / len) * sign;
    const bow = len * 0.18;
    const cx = (hub.x + to.x) / 2 + nx * bow;
    const cy = (hub.y + to.y) / 2 + (ny > 0 ? -ny : ny) * bow;
    return `M${hub.x} ${hub.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
  };

  return (
    <div className="relative">
      <div className="mx-auto max-w-[920px]">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="h-auto w-full"
          role="img"
          aria-label="World map. Trafficomm's centralized operations hub in India is connected by two-way routes to the markets it supports: Saudi Arabia, UAE, Qatar, Kuwait, Lebanon and Australia."
        >
          {children}

          {/* India reads as land, not as a highlight: ink, not red. */}
          <path d={indiaPath} fill="none" stroke="#0c0c0d" strokeOpacity="0.62" strokeWidth="3.8" strokeLinecap="round" />

          <g fill="none" stroke="#ea3e3a">
            {markets.map((m, i) => {
              const id = `route-${m.code}`;
              const d = arc(m.center);
              // Staggered so six routes never pulse in unison.
              const begin = `${(i * 0.65).toFixed(2)}s`;
              return (
                <g key={id}>
                  <path id={id} d={d} strokeWidth="0.7" strokeOpacity="0.45" />
                  {/* Out: execution, reporting and output leaving the hub. */}
                  <circle r="1.9" fill="#ea3e3a" stroke="none" className="map-flow">
                    <animateMotion dur="4.2s" begin={begin} repeatCount="indefinite" calcMode="linear">
                      <mpath href={`#${id}`} />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" dur="4.2s" begin={begin} repeatCount="indefinite" />
                  </circle>
                  {/* Back in: campaign requirements and data arriving at the hub.
                      Hidden on small screens, which halves the simultaneous motion. */}
                  <circle r="1.7" fill="#0c0c0d" stroke="none" className="map-flow max-md:hidden">
                    <animateMotion
                      dur="4.2s"
                      begin={`${(i * 0.65 + 2.1).toFixed(2)}s`}
                      repeatCount="indefinite"
                      calcMode="linear"
                      keyPoints="1;0"
                      keyTimes="0;1"
                    >
                      <mpath href={`#${id}`} />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      dur="4.2s"
                      begin={`${(i * 0.65 + 2.1).toFixed(2)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {markets.map((m) => (
            <g key={m.code}>
              <circle cx={m.center.x} cy={m.center.y} r="2.5" fill="#ea3e3a" />
              <line
                x1={m.center.x}
                y1={m.center.y}
                x2={m.label.x}
                y2={m.label.y - 4}
                stroke="#0c0c0d"
                strokeOpacity="0.3"
                strokeWidth="0.5"
              />
              <text
                x={m.label.x + (m.label.anchor === "start" ? 3 : m.label.anchor === "end" ? -3 : 0)}
                y={m.label.y}
                textAnchor={m.label.anchor}
                letterSpacing="1"
                paintOrder="stroke"
                stroke="var(--color-paper)"
                strokeWidth="3.5"
                strokeLinejoin="round"
                className="fill-ink font-mono uppercase [font-size:16px] md:[font-size:8.5px]"
              >
                {m.name}
              </text>
            </g>
          ))}

          {/* The hub: the only marker on the map that is more than a dot. */}
          <g>
            <circle cx={hub.x} cy={hub.y} r="5" fill="none" stroke="#ea3e3a" strokeWidth="0.9" className="map-flow">
              <animate attributeName="r" values="5;13;5" dur="4s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx={hub.x} cy={hub.y} r="5.4" fill="#0c0c0d" />
            <circle cx={hub.x} cy={hub.y} r="2.2" fill="#ea3e3a" />
            <text
              x={hubLabel.x}
              y={hubLabel.y}
              textAnchor={hubLabel.anchor}
              letterSpacing="1"
              paintOrder="stroke"
              stroke="var(--color-paper)"
              strokeWidth="4"
              strokeLinejoin="round"
              className="fill-ink font-mono uppercase [font-size:18px] md:[font-size:10px]"
            >
              India
            </text>
            <text
              x={hubLabel.x}
              y={hubLabel.y + 13}
              textAnchor={hubLabel.anchor}
              letterSpacing="1"
              paintOrder="stroke"
              stroke="var(--color-paper)"
              strokeWidth="3.5"
              strokeLinejoin="round"
              className="fill-steel font-mono uppercase [font-size:14px] md:[font-size:7px]"
            >
              Operations hub
            </text>
          </g>
        </svg>
      </div>

      <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-steel">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-ink" aria-hidden="true" />
          Operations hub
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
          Markets supported
        </span>
        <span className="text-graphite normal-case tracking-normal">Campaign work in · execution and reporting out</span>
      </p>
    </div>
  );
}

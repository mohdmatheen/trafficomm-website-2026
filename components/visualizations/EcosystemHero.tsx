"use client";

import { useEffect, useRef, useState } from "react";
import { usePauseSvgWhenHidden, usePrefersReducedMotion, useVisibilityEffect } from "@/components/motion/useInView";
import { duration } from "@/lib/motion/tokens";

/**
 * Hero visual, read top to bottom:
 *   10 advertising platforms  →  Trafficomm  →  Execute · Optimize · Measure · Report
 *
 * Inbound particles arrive irregularly (operational complexity); outbound
 * particles leave at a fixed cadence on four clean lanes (organized output).
 * All motion is written to the DOM from one rAF loop that pauses off-screen.
 *
 * Interaction: hovering, focusing or clicking a platform sends one short
 * burst — platform → Trafficomm → the active output — and highlights that path.
 */

const W = 640;
const H = 640;
const CX = 320;
const CY = 318;
const CORE_R = 64;

const r1 = (n: number) => Math.round(n * 10) / 10;

// Integer hash → [0,1). Deterministic on server and client (no float amplification).
const rand = (i: number) => {
  let x = Math.imul(i + 1, 2654435761) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 2246822507) >>> 0;
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
};

// Left → right across the upper arc. Longer names sit on the outer ring.
const PLATFORMS: { label: string; outer: boolean }[] = [
  { label: "Amazon Ads", outer: true },
  { label: "TikTok", outer: false },
  { label: "Google Ads", outer: true },
  { label: "X", outer: false },
  { label: "Search Ads 360", outer: true },
  { label: "Meta", outer: false },
  { label: "DV360", outer: true },
  { label: "LinkedIn", outer: false },
  { label: "CM360", outer: true },
  { label: "Snapchat", outer: false },
];

const OUTPUTS = ["Execute", "Optimize", "Measure", "Report"];

const nodes = PLATFORMS.map((p, i) => {
  const deg = 188 + (i + 0.5) * (164 / PLATFORMS.length);
  const a = (deg * Math.PI) / 180;
  const r = p.outer ? 272 : 200;
  const w = r1(p.label.length * 7.4 + 34);
  return { ...p, x: r1(CX + Math.cos(a) * r), y: r1(CY + Math.sin(a) * r * 0.92), a, w };
});

type Curve = { sx: number; sy: number; c1x: number; c1y: number; c2x: number; c2y: number; ex: number; ey: number; d: string };

const cubic = (sx: number, sy: number, c1x: number, c1y: number, c2x: number, c2y: number, ex: number, ey: number): Curve => ({
  sx,
  sy,
  c1x,
  c1y,
  c2x,
  c2y,
  ex,
  ey,
  d: `M${sx} ${sy} C${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`,
});

// Inbound: from each platform node, bending irregularly, into the core.
const inbound = nodes.map((n, i) => {
  const ex = r1(CX + Math.cos(n.a) * (CORE_R + 6));
  const ey = r1(CY + Math.sin(n.a) * (CORE_R + 6));
  const bend = (rand(i + 7) - 0.5) * 90;
  const c1x = r1(n.x + Math.cos(n.a + Math.PI / 2) * bend);
  const c1y = r1(n.y + 40 + Math.sin(n.a + Math.PI / 2) * bend * 0.4);
  const c2x = r1(ex + Math.cos(n.a) * 50);
  const c2y = r1(ey + Math.sin(n.a) * 50);
  return cubic(n.x, r1(n.y + 15), c1x, c1y, c2x, c2y, ex, ey);
});

// Outbound: four ordered lanes from the bottom of the core to the output row.
const OUT_Y = 560;
const outX = [92, 244, 396, 548];
const outbound = outX.map((x) => cubic(CX, CY + CORE_R + 6, CX, CY + 150, x, OUT_Y - 110, x, OUT_Y - 18));

const point = (c: Curve, t: number) => {
  const u = 1 - t;
  return [
    u * u * u * c.sx + 3 * u * u * t * c.c1x + 3 * u * t * t * c.c2x + t * t * t * c.ex,
    u * u * u * c.sy + 3 * u * u * t * c.c1y + 3 * u * t * t * c.c2y + t * t * t * c.ey,
  ];
};

// Irregular inbound traffic: 2–3 particles per platform with varied speeds and offsets.
const IN_P = inbound.flatMap((_, i) =>
  Array.from({ length: 2 + (i % 2) }, (_, k) => ({ lane: i, offset: rand(i * 5 + k + 31), speed: 0.1 + rand(i * 5 + k + 77) * 0.22, red: (i + k) % 5 === 0 })),
);
// Ordered outbound traffic: identical speed, evenly spaced.
const OUT_PER_LANE = 3;
const OUT_P = outbound.flatMap((_, lane) => Array.from({ length: OUT_PER_LANE }, (_, k) => ({ lane, offset: k / OUT_PER_LANE })));

const BURST = 4;
const BURST_KEYS = Array.from({ length: BURST }, (_, k) => k);

export function EcosystemHero() {
  const svgRef = useRef<SVGSVGElement>(null);
  const inRefs = useRef<(SVGRectElement | null)[]>([]);
  const outRefs = useRef<(SVGRectElement | null)[]>([]);
  const burstRefs = useRef<(SVGRectElement | null)[]>([]);
  const coreRing = useRef<SVGCircleElement>(null);
  const [active, setActive] = useState(0);
  const [hot, setHot] = useState<number | null>(null);
  const animate = !usePrefersReducedMotion();
  const loop = useRef<{ start: () => void; stop: () => void } | null>(null);
  const burst = useRef<{ lane: number; out: number; t: number } | null>(null);
  const activeRef = useRef(0);
  const hotTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visible = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    let running = false;
    let last = performance.now();
    let t = 0;
    let stageClock = 0;

    const place = (el: SVGRectElement | null, c: Curve, prog: number, half: number, opacity: number) => {
      if (!el) return;
      const [x, y] = point(c, prog);
      el.setAttribute("x", (x - half).toFixed(1));
      el.setAttribute("y", (y - half).toFixed(1));
      el.setAttribute("opacity", opacity.toFixed(2));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      stageClock += dt;
      IN_P.forEach((p, i) => {
        const prog = (p.offset + t * p.speed) % 1;
        place(inRefs.current[i], inbound[p.lane], prog, 1.75, Math.min(1, Math.sin(prog * Math.PI) * 1.4));
      });
      OUT_P.forEach((p, i) => {
        const prog = (p.offset + t * 0.28) % 1;
        place(outRefs.current[i], outbound[p.lane], prog, 2, Math.min(1, Math.sin(prog * Math.PI) * 1.6));
      });
      // User-triggered burst: in along the platform's lane, a core pulse, then out along the active output.
      const b = burst.current;
      if (b) {
        const e = (now - b.t) / 1000;
        const half = duration.burst / 2000;
        for (let k = 0; k < BURST; k++) {
          const lag = k * 0.06;
          const el = burstRefs.current[k];
          if (e - lag < half) place(el, inbound[b.lane], Math.max(0, (e - lag) / half), 2.25, 1);
          else if (e - lag < half * 2) place(el, outbound[b.out], Math.min(1, (e - lag - half) / half), 2.25, 1);
          else el?.setAttribute("opacity", "0");
        }
        const ring = coreRing.current;
        if (ring) {
          const pulse = Math.max(0, 1 - Math.abs(e - half) / 0.25);
          ring.setAttribute("r", String(CORE_R + 6 + pulse * 10));
          ring.setAttribute("stroke-opacity", (pulse * 0.8).toFixed(2));
        }
        if (e > half * 2 + BURST * 0.06) burst.current = null;
      }
      if (stageClock > 2.2 && !burst.current) {
        stageClock = 0;
        setActive((a) => (a + 1) % OUTPUTS.length);
      }
      if (running) raf = requestAnimationFrame(frame);
    };

    loop.current = {
      start: () => {
        if (running) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      },
      stop: () => {
        running = false;
        cancelAnimationFrame(raf);
      },
    };
    // The loop can be created after the first visibility event (motion preference resolves post-hydration).
    if (visible.current) loop.current.start();
    return () => {
      loop.current?.stop();
      loop.current = null;
    };
  }, [animate]);

  useVisibilityEffect(svgRef, (v) => {
    visible.current = v;
    if (v) loop.current?.start();
    else loop.current?.stop();
  });
  usePauseSvgWhenHidden(svgRef);

  // `at` is the event timestamp (same clock as requestAnimationFrame).
  const trigger = (lane: number, at: number) => {
    if (hotTimer.current) clearTimeout(hotTimer.current);
    setHot(lane);
    hotTimer.current = setTimeout(() => setHot(null), duration.burst + 600);
    if (!animate) return;
    if (burst.current && burst.current.lane === lane && at - burst.current.t < duration.burst) return;
    burst.current = { lane, out: activeRef.current, t: at };
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full select-none"
      role="group"
      aria-label="Diagram: campaign activity from Meta, Google Ads, TikTok, Snapchat, X, LinkedIn, DV360, CM360, Search Ads 360 and Amazon Ads flows into Trafficomm, which organizes it into four outputs: execute, optimize, measure and report."
    >
      <defs>
        <pattern id="eh-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#0c0c0d" fillOpacity="0.1" />
        </pattern>
        <radialGradient id="eh-mask-g" cx="50%" cy="48%" r="52%">
          <stop offset="60%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id="eh-mask">
          <rect width={W} height={H} fill="url(#eh-mask-g)" />
        </mask>
      </defs>

      <rect width={W} height={H} fill="url(#eh-dots)" mask="url(#eh-mask)" />

      {/* stage labels */}
      <text x="18" y="24" className="fill-steel font-mono uppercase" fontSize="10.5" letterSpacing="1.6">
        Input · 10 platforms
      </text>
      <text x="18" y={OUT_Y - 44} className="fill-steel font-mono uppercase" fontSize="10.5" letterSpacing="1.6">
        Output
      </text>
      <line x1="18" x2={W - 18} y1={OUT_Y - 36} y2={OUT_Y - 36} stroke="#0c0c0d" strokeOpacity="0.08" strokeDasharray="2 5" />

      {/* inbound lines */}
      {inbound.map((c, i) => (
        <path
          key={i}
          d={c.d}
          fill="none"
          stroke={hot === i ? "#ea3e3a" : "#0c0c0d"}
          strokeOpacity={hot === i ? 0.9 : hot !== null ? 0.08 : 0.13}
          strokeWidth={hot === i ? 1.5 : 1}
          style={{ transition: "stroke var(--dur-fast), stroke-opacity var(--dur-base)" }}
        />
      ))}

      {/* outbound lanes */}
      {outbound.map((c, i) => {
        const on = animate && active === i;
        return (
          <path
            key={i}
            d={c.d}
            fill="none"
            stroke={on ? "#ea3e3a" : "#0c0c0d"}
            strokeOpacity={on ? 0.85 : 0.18}
            strokeWidth={on ? 1.5 : 1}
            style={{ transition: "stroke 0.5s, stroke-opacity 0.5s" }}
          />
        );
      })}

      {/* particles */}
      {IN_P.map((p, i) => {
        const [x, y] = point(inbound[p.lane], (p.offset * 0.7 + 0.15) % 1);
        return (
          <rect
            key={`i${i}`}
            ref={(el) => {
              inRefs.current[i] = el;
            }}
            x={r1(x - 1.75)}
            y={r1(y - 1.75)}
            width="3.5"
            height="3.5"
            fill={p.red ? "#ea3e3a" : "#0c0c0d"}
            opacity={animate ? 0 : 0.55}
          />
        );
      })}
      {OUT_P.map((p, i) => {
        const [x, y] = point(outbound[p.lane], (p.offset + 0.15) % 1);
        return (
          <rect
            key={`o${i}`}
            ref={(el) => {
              outRefs.current[i] = el;
            }}
            x={r1(x - 2)}
            y={r1(y - 2)}
            width="4"
            height="4"
            fill="#ea3e3a"
            opacity={animate ? 0 : 0.8}
          />
        );
      })}

      {BURST_KEYS.map((k) => (
        <rect
          key={k}
          ref={(el) => {
            burstRefs.current[k] = el;
          }}
          width="4.5"
          height="4.5"
          fill="#ea3e3a"
          opacity="0"
        />
      ))}

      {/* core */}
      <circle ref={coreRing} cx={CX} cy={CY} r={CORE_R + 6} fill="none" stroke="#ea3e3a" strokeOpacity="0" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r={CORE_R + 22} fill="none" stroke="#0c0c0d" strokeOpacity="0.1" strokeDasharray="1.5 4.5">
        {animate && <animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="60s" repeatCount="indefinite" />}
      </circle>
      <circle cx={CX} cy={CY} r={CORE_R} fill="#0c0c0d" />
      <g transform={`translate(${CX - 25} ${CY - 30}) scale(0.0439)`}>
        <path d="M302 190h239L301 573h236l-60 92H0z" fill="#fff" />
        <path d="M537 573 782 190h239L777 573z" fill="#ea3e3a" />
        <path d="M601 95 660 0h480l-61 95z" fill="#ea3e3a" />
      </g>
      <text x={CX} y={CY + 18} textAnchor="middle" fontSize="12" fill="#fff" fontWeight="600" className="font-brand">
        Trafficomm
      </text>
      <text x={CX} y={CY + 34} textAnchor="middle" fontSize="7.5" fill="#b9b9bf" className="font-mono uppercase" letterSpacing="1.4">
        Operations layer
      </text>

      {/* platform nodes */}
      {nodes.map((n, i) => (
        <g
          key={n.label}
          transform={`translate(${n.x} ${n.y})`}
          tabIndex={0}
          role="button"
          aria-label={`${n.label}: trace its signal through Trafficomm`}
          className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-[#ea3e3a] [&:focus-visible>rect:first-child]:[stroke-opacity:1]"
          onMouseEnter={(e) => trigger(i, e.timeStamp)}
          onFocus={(e) => trigger(i, e.timeStamp)}
          onClick={(e) => trigger(i, e.timeStamp)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              trigger(i, e.timeStamp);
            }
          }}
        >
          <rect
            x={-n.w / 2}
            y={-14}
            width={n.w}
            height={28}
            rx={14}
            fill="#fff"
            stroke={hot === i ? "#ea3e3a" : "#0c0c0d"}
            strokeOpacity={hot === i ? 1 : 0.14}
            style={{ transition: "stroke var(--dur-fast), stroke-opacity var(--dur-fast)" }}
          />
          <circle cx={-n.w / 2 + 13} cy={0} r={2.6} fill={hot === i ? "#ea3e3a" : "#0c0c0d"} fillOpacity={hot === i ? 1 : 0.45} />
          <text x={7} y={0.5} textAnchor="middle" dominantBaseline="middle" fontSize="12.5" fill="#0c0c0d" letterSpacing="-0.1">
            {n.label}
          </text>
        </g>
      ))}

      {/* outputs */}
      {OUTPUTS.map((label, i) => {
        const on = animate ? active === i : true;
        const solid = on && animate;
        return (
          <g key={label} transform={`translate(${outX[i]} ${OUT_Y})`}>
            <rect x={-62} y={-18} width={124} height={36} rx={6} fill={solid ? "#0c0c0d" : "#fff"} stroke="#0c0c0d" strokeOpacity={solid ? 1 : 0.16} style={{ transition: "fill 0.5s" }} />
            <rect x={-62} y={-18} width={3} height={36} fill={on ? "#ea3e3a" : "#0c0c0d"} fillOpacity={on ? 1 : 0.2} style={{ transition: "fill 0.5s" }} />
            <text
              x={4}
              y={1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11.5"
              letterSpacing="1.6"
              className="font-mono uppercase"
              fill={solid ? "#fff" : "#0c0c0d"}
              style={{ transition: "fill 0.5s" }}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

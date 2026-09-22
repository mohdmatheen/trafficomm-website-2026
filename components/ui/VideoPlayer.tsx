"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePauseSvgWhenHidden, usePrefersReducedMotion } from "@/components/motion/useInView";
import { Play } from "./Icons";

/**
 * Cinematic video frame. With `src`, clicking play loads and plays the film
 * (nothing is downloaded before interaction). Without `src`, it renders a
 * designed "in production" state so the section ships before the film does.
 */
export function VideoPlayer({ src, poster, title, durationLabel }: { src: string | null; poster: string | null; title: string; durationLabel: string }) {
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animate = !usePrefersReducedMotion();

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-panel)] bg-ink-2 ring-1 ring-line-dark">
      {playing && src ? (
        <video ref={videoRef} src={src} poster={poster ?? undefined} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-cover">
          <track kind="captions" />
        </video>
      ) : (
        <>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          ) : (
            <PosterArt animate={animate} />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(12_12_13/0.75))]" aria-hidden="true" />

          <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
            <span className="eyebrow flex items-center gap-2 !text-[0.68rem] text-fog">
              <span className="size-1.5 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" /> {title}
            </span>
            <span className="flex items-center gap-3 font-mono text-[0.77rem] text-mute tabular">
              {src ? `00:00 / ${durationLabel}` : <span className="rounded-full px-2 py-0.5 ring-1 ring-line-dark-strong">Brand film · in production</span>}
            </span>
          </div>

          <button
            type="button"
            onClick={() => (src ? setPlaying(true) : setNotice(true))}
            className="group absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4"
            aria-label={src ? `Play ${title}` : `${title} — film in production`}
          >
            <span className="relative flex size-16 items-center justify-center rounded-full bg-signal text-white shadow-[0_0_0_10px_rgb(234_62_58/0.15)] transition-transform duration-500 group-hover:scale-110 sm:size-24">
              <span className="absolute inset-0 rounded-full ring-1 ring-signal [animation:ring-out_2.4s_ease-out_infinite]" aria-hidden="true" />
              <Play className="ml-1 size-6 sm:size-8" />
            </span>
          </button>


          {notice && (
            <div role="status" className="absolute inset-x-4 bottom-12 mx-auto max-w-sm rounded-xl bg-white/10 px-4 py-3 text-center text-[0.93rem] text-white backdrop-blur-md sm:bottom-16">
              Our brand film is in production. In the meantime, see{" "}
              <Link href="/how-we-work" className="underline decoration-signal underline-offset-4">
                how we work
              </Link>
              .
            </div>
          )}
        </>
      )}
    </div>
  );
}

const LANES = ["Meta", "Google Ads", "DV360", "CM360", "TikTok", "Snapchat", "LinkedIn"];
const STAGES = ["Plan", "Build", "QA", "Launch", "Optimize", "Measure", "Report"];

/**
 * Poster frame in the Trafficomm visual language: letterboxed dark frame,
 * campaign signal lanes converging on a single operations point, a stage
 * timeline and crop marks. Decorative only — no data is implied.
 */
function PosterArt({ animate }: { animate: boolean }) {
  const cx = 800;
  const cy = 450;
  const ref = useRef<SVGSVGElement>(null);
  usePauseSvgWhenHidden(ref);
  return (
    <svg ref={ref} viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="vp-grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64 0H0V64" fill="none" stroke="#fff" strokeOpacity="0.035" />
        </pattern>
        <radialGradient id="vp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ea3e3a" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ea3e3a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vp-lane" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="#0e0e10" />
      <rect width="1600" height="900" fill="url(#vp-grid)" />
      <text x={cx} y={cy + 70} textAnchor="middle" fontSize="260" fontWeight="600" fill="none" stroke="#fff" strokeOpacity="0.045" letterSpacing="-8" className="font-brand">
        Trafficomm
      </text>
      <circle cx={cx} cy={cy} r="360" fill="url(#vp-glow)" />

      {/* inbound campaign lanes → operations point */}
      {LANES.map((l, i) => {
        const y = 170 + i * 93;
        const d = `M140 ${y} C 480 ${y} 560 ${cy} ${cx - 70} ${cy}`;
        return (
          <g key={l}>
            <path id={`vp-l${i}`} d={d} fill="none" stroke="url(#vp-lane)" strokeWidth="1.2" />
            <text x="128" y={y + 5} textAnchor="end" fontSize="15" fill="#85858c" letterSpacing="2" className="font-mono uppercase">
              {l}
            </text>
            {animate && (
              <rect width="7" height="7" x="-3.5" y="-3.5" fill={i % 3 === 0 ? "#ea3e3a" : "#fff"} opacity={i % 3 === 0 ? 1 : 0.7}>
                <animateMotion dur={`${3.4 + (i % 4) * 0.7}s`} begin={`${-i * 0.9}s`} repeatCount="indefinite">
                  <mpath href={`#vp-l${i}`} />
                </animateMotion>
              </rect>
            )}
          </g>
        );
      })}
      {/* organized output lanes */}
      {[0, 1, 2, 3].map((i) => {
        const y = cy - 96 + i * 64;
        const d = `M${cx + 70} ${cy} C 1000 ${cy} 1040 ${y} 1300 ${y} L 1480 ${y}`;
        return (
          <g key={`o${i}`}>
            <path id={`vp-o${i}`} d={d} fill="none" stroke="#ea3e3a" strokeOpacity="0.5" strokeWidth="1.2" />
            <text x="1488" y={y + 5} fontSize="14" fill="#b9b9bf" letterSpacing="2" className="font-mono uppercase">
              {["Execute", "Optimize", "Measure", "Report"][i]}
            </text>
            {animate &&
              [0, 0.5].map((off) => (
                <rect key={off} width="7" height="7" x="-3.5" y="-3.5" fill="#ea3e3a">
                  <animateMotion dur="2.4s" begin={`${-off * 2.4}s`} repeatCount="indefinite">
                    <mpath href={`#vp-o${i}`} />
                  </animateMotion>
                </rect>
              ))}
          </g>
        );
      })}

      {/* letterbox + crop marks */}
      <rect width="1600" height="64" fill="#000" opacity="0.55" />
      <rect y="836" width="1600" height="64" fill="#000" opacity="0.55" />
      {[
        [40, 90, 1, 1],
        [1560, 90, -1, 1],
        [40, 810, 1, -1],
        [1560, 810, -1, -1],
      ].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M${x} ${y + sy * 30} V${y} H${x + sx * 30}`} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
      ))}

      {/* stage timeline */}
      <line x1="120" x2="1480" y1="790" y2="790" stroke="#fff" strokeOpacity="0.15" />
      {STAGES.map((s, i) => {
        const x = 120 + (i * 1360) / (STAGES.length - 1);
        return (
          <g key={s}>
            <line x1={x} x2={x} y1="782" y2="798" stroke="#fff" strokeOpacity="0.4" />
            <text x={x} y="770" textAnchor="middle" fontSize="13" fill="#85858c" letterSpacing="2" className="font-mono uppercase">
              {s}
            </text>
          </g>
        );
      })}
      <rect x="120" y="789" width="190" height="2" fill="#ea3e3a">
        {animate && <animate attributeName="width" values="0;1360" dur="12s" repeatCount="indefinite" />}
      </rect>
    </svg>
  );
}

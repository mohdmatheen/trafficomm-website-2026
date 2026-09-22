import Link from "next/link";
import saudi from "@/data/saudi-dots.json";
import type { Article } from "@/data/types";
import { formatDate, readingMinutes } from "@/lib/content";
import { cn } from "@/lib/cn";
import { ArrowRight } from "@/components/ui/Icons";

/**
 * Performance Lab entries presented as research-report covers.
 * Cover art is diagrammatic and data-free: no figures are implied.
 */
const COVERS: Record<string, { title: string[]; tone: "dark" | "light"; art: "saudi" | "workflow" | "matrix" }> = {
  "saudi-digital-advertising-outlook-2027": { title: ["Saudi Digital", "Advertising", "Outlook 2027"], tone: "dark", art: "saudi" },
  "agency-guide-to-outsourcing-ad-operations": { title: ["The Agency Guide", "to Ad Operations", "Outsourcing"], tone: "light", art: "workflow" },
  "building-vs-outsourcing-ad-operations-team": { title: ["Building vs", "Outsourcing an Ad", "Operations Team"], tone: "dark", art: "matrix" },
};

export function ReportCover({ article, index, className }: { article: Article; index: number; className?: string }) {
  const cover = COVERS[article.slug] ?? { title: [article.title], tone: "dark" as const, art: "matrix" as const };
  const dark = cover.tone === "dark";
  return (
    <Link
      href={`/insights/${article.slug}`}
      className={cn(
        "group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[var(--radius-card)] p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 sm:p-7",
        dark ? "bg-ink text-white ring-1 ring-line-dark hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]" : "bg-[#ecebe6] text-ink ring-1 ring-line hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.3)]",
        className,
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0", dark ? "grid-bg-dark opacity-40" : "grid-bg opacity-60")} aria-hidden="true" />
      <div className="relative flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.14em]">
        <span className={dark ? "text-fog" : "text-graphite"}>Trafficomm Performance Lab</span>
        <span className="text-signal">No. {String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className={cn("relative mt-4 h-px", dark ? "bg-line-dark-strong" : "bg-line-strong")} />

      <div className="relative my-5 flex-1">
        {cover.art === "saudi" && <SaudiArt />}
        {cover.art === "workflow" && <WorkflowArt />}
        {cover.art === "matrix" && <MatrixArt />}
      </div>

      <div className="relative">
        <p className={cn("font-mono text-[0.68rem] uppercase tracking-[0.14em]", dark ? "text-mute" : "text-steel")}>{article.category}</p>
        <h3 className="mt-3 text-[clamp(1.45rem,1.1rem+0.9vw,1.85rem)] font-medium uppercase leading-[1.02] tracking-[-0.02em]">
          {cover.title.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h3>
        <div className={cn("mt-5 flex items-center justify-between border-t pt-4 font-mono text-[0.68rem] uppercase tracking-[0.1em]", dark ? "border-line-dark-strong text-mute" : "border-line-strong text-steel")}>
          <span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {readingMinutes(article)} min
          </span>
          <span className={cn("flex items-center gap-1.5", dark ? "text-white" : "text-ink")}>
            Read <ArrowRight className="size-3.5 text-signal transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SaudiArt() {
  const { cols, rows, dots } = saudi as { cols: number; rows: number; dots: [number, number][] };
  // A handful of highlighted points as abstract signal markers — not data.
  // Keep in sync with MARKED in scripts/generate-saudi-dots.mjs (base dots live in public/maps/saudi-dots.svg).
  const marked = new Set([97, 260, 388, 455, 512, 640, 731, 820]);
  return (
    <div className="flex h-full flex-col">
      {/* Base dot field is a static, cacheable asset; only the highlighted markers are inline. */}
      <svg viewBox={`-2 -2 ${cols + 4} ${rows + 4}`} className="min-h-0 w-full flex-1" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <image href="/maps/saudi-dots.svg" x={-2} y={-2} width={cols + 4} height={rows + 4} />
        {[...marked].map((i) => (
          <g key={i}>
            <circle cx={dots[i][0]} cy={dots[i][1]} r="0.6" fill="#ea3e3a" />
            <circle cx={dots[i][0]} cy={dots[i][1]} r="1.6" fill="none" stroke="#ea3e3a" strokeOpacity="0.45" strokeWidth="0.12" />
          </g>
        ))}
      </svg>
      <p className="mt-3 flex flex-wrap gap-x-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-mute" aria-hidden="true">
        <span className="text-fog">Platform signals</span>
        {["Snapchat", "TikTok", "Meta", "YouTube", "X"].map((s) => (
          <span key={s}>· {s}</span>
        ))}
      </p>
    </div>
  );
}

function WorkflowArt() {
  const stages = ["Agency", "Trafficomm", "Execution"];
  return (
    <svg viewBox="0 0 200 180" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${14 + i * 21} 30 C ${14 + i * 21} 70 100 60 100 88`} fill="none" stroke="#0c0c0d" strokeOpacity="0.16" strokeWidth="0.6" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <path key={`o${i}`} d={`M100 108 C 100 130 ${30 + i * 35} 125 ${30 + i * 35} 152`} fill="none" stroke="#ea3e3a" strokeWidth="0.9" />
      ))}
      {stages.map((s, i) => {
        const y = [22, 98, 162][i];
        const w = i === 1 ? 84 : 70;
        return (
          <g key={s} transform={`translate(${100 - w / 2} ${y - 9})`}>
            <rect width={w} height="18" rx="3" fill={i === 1 ? "#0c0c0d" : "#f6f6f3"} stroke="#0c0c0d" strokeOpacity={i === 1 ? 1 : 0.3} strokeWidth="0.6" />
            <text x={w / 2} y="12" textAnchor="middle" fontSize="6.4" letterSpacing="0.8" fill={i === 1 ? "#fff" : "#0c0c0d"} className="font-mono uppercase">
              {s}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MatrixArt() {
  const dims = ["Cost", "Capacity", "Team structure", "Complexity"];
  return (
    <svg viewBox="0 0 200 180" className="h-full w-full" aria-hidden="true">
      <text x="96" y="14" fontSize="6" fill="#85858c" className="font-mono uppercase" letterSpacing="0.8">Build</text>
      <text x="150" y="14" fontSize="6" fill="#85858c" className="font-mono uppercase" letterSpacing="0.8">Outsource</text>
      {dims.map((d, r) => {
        const y = 34 + r * 36;
        return (
          <g key={d}>
            <line x1="0" x2="200" y1={y + 18} y2={y + 18} stroke="#fff" strokeOpacity="0.1" strokeWidth="0.5" />
            <text x="0" y={y + 6} fontSize="6.6" fill="#ffffff" className="font-mono uppercase" letterSpacing="0.6">
              {d}
            </text>
            <path
              d={Array.from({ length: 10 }, (_, k) => [k < 5 ? 96 + k * 8 : 150 + (k - 5) * 8, k])
                .filter(([, k]) => !(r === 1 && k === 7))
                .map(([x]) => `M${x} ${y}h5v5h-5z`)
                .join("")}
              fill="#fff"
              opacity="0.18"
            />
            {r === 1 && <rect x={166} y={y} width="5" height="5" rx="1" fill="#ea3e3a" />}
          </g>
        );
      })}
    </svg>
  );
}

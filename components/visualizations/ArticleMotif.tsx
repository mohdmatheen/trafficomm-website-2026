import type { Article } from "@/data/types";

/** Generative article hero motifs (no stock imagery). */
export function ArticleMotif({ motif }: { motif: Article["hero"]["motif"] }) {
  const props = { viewBox: "0 0 400 225", className: "h-full w-full", preserveAspectRatio: "xMidYMid slice", "aria-hidden": true } as const;
  if (motif === "bars") {
    return (
      <svg {...props}>
        {Array.from({ length: 24 }, (_, i) => {
          const h = 30 + ((i * 53) % 110) + i * 2.5;
          return <rect key={i} x={20 + i * 15.5} y={205 - h} width="8" height={h} fill={i === 19 ? "#ea3e3a" : "#fff"} opacity={i === 19 ? 1 : 0.12 + (i / 24) * 0.25} />;
        })}
      </svg>
    );
  }
  if (motif === "flow") {
    return (
      <svg {...props}>
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M-10 ${40 + i * 18} C120 ${40 + i * 18} 180 112 260 112 S360 ${50 + i * 15} 420 ${50 + i * 15}`} fill="none" stroke={i === 4 ? "#ea3e3a" : "#fff"} strokeOpacity={i === 4 ? 1 : 0.18} />
        ))}
        <circle cx="260" cy="112" r="10" fill="#ea3e3a" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      {Array.from({ length: 15 * 8 }, (_, i) => {
        const x = i % 15;
        const y = Math.floor(i / 15);
        const on = (x * 7 + y * 3) % 11 === 0;
        return <rect key={i} x={14 + x * 25.5} y={14 + y * 25.5} width="18" height="18" rx="2" fill={on ? "#ea3e3a" : "#fff"} opacity={on ? 0.9 : 0.07} />;
      })}
    </svg>
  );
}

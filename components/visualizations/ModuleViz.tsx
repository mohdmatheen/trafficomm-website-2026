import type { Service } from "@/data/types";

/**
 * Small, static interface-style illustrations for each service module.
 * Pure SVG (server-rendered); motion comes from CSS on card hover.
 * Values are illustrative UI shapes, not data.
 */
export function ModuleViz({ kind }: { kind: Service["viz"] }) {
  const common = { viewBox: "0 0 240 96", className: "h-full w-full", "aria-hidden": true } as const;
  const ink = "currentColor";
  switch (kind) {
    case "pacing":
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((r) => (
            <g key={r} transform={`translate(0 ${10 + r * 21})`}>
              <rect width="240" height="6" rx="3" fill={ink} opacity="0.08" />
              <rect width={[168, 204, 132, 186][r]} height="6" rx="3" fill={r === 2 ? "#ea3e3a" : ink} opacity={r === 2 ? 1 : 0.55} className="origin-left transition-transform duration-700 group-hover:scale-x-[1.06]" />
              <rect x={[180, 180, 180, 180][r]} y="-3" width="1" height="12" fill={ink} opacity="0.4" />
            </g>
          ))}
        </svg>
      );
    case "funnel":
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((r) => {
            const w = 220 - r * 44;
            return <rect key={r} x={(240 - w) / 2} y={6 + r * 22} width={w} height="16" rx="3" fill={r === 3 ? "#ea3e3a" : ink} opacity={r === 3 ? 1 : 0.14 + r * 0.14} />;
          })}
        </svg>
      );
    case "lineitems":
      return (
        <svg {...common}>
          <rect x="4" y="6" width="70" height="14" rx="3" fill={ink} opacity="0.7" />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <path d={`M20 20 V${38 + r * 22} H44`} fill="none" stroke={ink} strokeOpacity="0.3" />
              <rect x="46" y={31 + r * 22} width="96" height="14" rx="3" fill={r === 1 ? "#ea3e3a" : ink} opacity={r === 1 ? 1 : 0.18} />
              <rect x="152" y={35 + r * 22} width={[60, 80, 40][r]} height="6" rx="3" fill={ink} opacity="0.12" />
            </g>
          ))}
        </svg>
      );
    case "tags":
      return (
        <svg {...common} className="h-full w-full font-mono">
          {["gtag('config')", "fbq('track', 'Lead')", "dataLayer.push({...})"].map((t, r) => (
            <g key={t} transform={`translate(0 ${8 + r * 28})`}>
              <rect width="240" height="22" rx="4" fill={ink} opacity="0.05" />
              <circle cx="12" cy="11" r="3.5" fill={r === 1 ? "#ea3e3a" : ink} opacity={r === 1 ? 1 : 0.4} />
              <text x="24" y="15" fontSize="10" fill={ink} opacity="0.65">
                {t}
              </text>
            </g>
          ))}
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          {[40, 58, 50, 72, 64, 84, 78].map((h, i) => (
            <rect key={i} x={6 + i * 33} y={92 - h} width="20" height={h} rx="2" fill={i === 5 ? "#ea3e3a" : ink} opacity={i === 5 ? 1 : 0.16} />
          ))}
          <path d="M16 56 L49 42 L82 48 L115 28 L148 34 L181 14 L214 20" fill="none" stroke={ink} strokeOpacity="0.55" strokeWidth="1.5" />
        </svg>
      );
    case "creative":
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${8 + i * 58} ${i % 2 ? 12 : 4})`}>
              <rect width="46" height="80" rx="7" fill="none" stroke={ink} strokeOpacity="0.35" />
              <rect x="5" y="8" width="36" height={i === 1 ? 52 : 30} rx="3" fill={i === 1 ? "#ea3e3a" : ink} opacity={i === 1 ? 1 : 0.14} />
              <rect x="5" y="66" width="24" height="5" rx="2.5" fill={ink} opacity="0.25" />
            </g>
          ))}
        </svg>
      );
  }
}

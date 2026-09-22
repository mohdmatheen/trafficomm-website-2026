/** Abstract, data-free motifs that give each case study card its own visual identity. */
export function CaseMotif({ slug, tone = "light" }: { slug: string; tone?: "light" | "dark" }) {
  const ink = tone === "light" ? "#0c0c0d" : "#ffffff";
  const props = { viewBox: "0 0 320 160", className: "h-full w-full", "aria-hidden": true, preserveAspectRatio: "xMidYMid slice" } as const;

  if (slug === "mena-agency-ad-operations") {
    return (
      <svg {...props}>
        {Array.from({ length: 30 }, (_, i) => (
          <rect key={i} x={24 + (i % 10) * 28} y={34 + Math.floor(i / 10) * 32} width="20" height="20" rx="3" fill={i < 4 ? ink : "#ea3e3a"} opacity={i < 4 ? 0.85 : 0.2 + (i / 30) * 0.8} />
        ))}
      </svg>
    );
  }
  if (slug === "middle-east-performance-marketing") {
    return (
      <svg {...props}>
        {Array.from({ length: 16 }, (_, i) => {
          const h = 20 + ((i * 37) % 60) + i * 3;
          return <rect key={i} x={20 + i * 18} y={140 - h} width="10" height={h} rx="2" fill={i === 13 ? "#ea3e3a" : ink} opacity={i === 13 ? 1 : 0.14} />;
        })}
        <path d="M20 120 C80 110 120 90 160 80 S250 40 300 30" fill="none" stroke="#ea3e3a" strokeWidth="1.5" />
      </svg>
    );
  }
  if (slug === "rich-media-creative-studio") {
    return (
      <svg {...props}>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`translate(${22 + i * 48} ${i % 2 ? 30 : 18})`}>
            <rect width="36" height="66" rx="6" fill="none" stroke={ink} strokeOpacity="0.3" />
            <rect x="4" y="6" width="28" height={i === 2 ? 48 : 26} rx="3" fill={i === 2 ? "#ea3e3a" : ink} opacity={i === 2 ? 1 : 0.12} />
          </g>
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={`b${i}`} x={22 + i * 48} y={118} width="36" height="4" rx="2" fill={ink} opacity="0.12" />
        ))}
      </svg>
    );
  }
  return (
    <svg {...props}>
      <rect x="24" y="18" width="272" height="124" rx="6" fill="none" stroke={ink} strokeOpacity="0.25" />
      <rect x="36" y="30" width="248" height="20" rx="3" fill={ink} opacity="0.1" />
      <rect x="36" y="58" width="160" height="72" rx="3" fill={ink} opacity="0.06" />
      <rect x="36" y="58" width="160" height="72" rx="3" fill="none" stroke="#ea3e3a" strokeDasharray="4 3" />
      <path d="M108 86 v16 l14 -8z" fill="#ea3e3a" />
      <rect x="206" y="58" width="78" height="32" rx="3" fill="#ea3e3a" opacity="0.9" />
      <rect x="206" y="98" width="78" height="32" rx="3" fill={ink} opacity="0.1" />
    </svg>
  );
}

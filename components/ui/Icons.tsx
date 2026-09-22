import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" {...base} {...p}>
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);
export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" {...base} {...p}>
    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
  </svg>
);
export const ChevronDown = (p: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" {...base} {...p}>
    <path d="m4 6 4 4 4-4" />
  </svg>
);
export const Plus = (p: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" {...base} {...p}>
    <path d="M8 3v10M3 8h10" />
  </svg>
);
export const Check = (p: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" {...base} {...p}>
    <path d="m3 8.5 3 3 7-7" />
  </svg>
);
export const Menu = (p: P) => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" {...base} {...p}>
    <path d="M3 6h14M3 14h14" />
  </svg>
);
export const Close = (p: P) => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" {...base} {...p}>
    <path d="m5 5 10 10M15 5 5 15" />
  </svg>
);
export const Play = (p: P) => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...p}>
    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
  </svg>
);
export const Lock = (p: P) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" {...base} {...p}>
    <rect x="3" y="7" width="10" height="7" rx="1.5" />
    <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
  </svg>
);

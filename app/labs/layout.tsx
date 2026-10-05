import type { ReactNode } from "react";

/**
 * Trafficomm Labs shell.
 *
 * Labs sits inside the main site rather than beside it: the header, footer,
 * analytics and entity schema all come from the root layout, so a visitor who
 * arrives on a tool is one click from the rest of Trafficomm. What differs is
 * the register — product surfaces are white and dense where the marketing site
 * is paper and spacious — and that is expressed with existing tokens only.
 */
export default function LabsLayout({ children }: { children: ReactNode }) {
  return <div className="bg-paper">{children}</div>;
}

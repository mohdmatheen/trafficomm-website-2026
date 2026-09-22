import type { Stat } from "@/data/types";
import { cn } from "@/lib/cn";

export const formatStat = (s: Stat) => s.display ?? `${s.prefix ?? ""}${s.value.toLocaleString("en-US")}${s.suffix ?? ""}`;

/**
 * A key figure. Motion language: "settle" — fades in with a slight rise, then
 * a short baseline draws beneath it. The number is always rendered in full;
 * no counting. Static when reduced motion is on or JS is unavailable.
 */
export function Metric({ stat, value, className, line = true }: { stat?: Stat; value?: string; className?: string; line?: boolean }) {
  const text = value ?? (stat ? formatStat(stat) : "");
  return (
    <span data-reveal="settle" data-line={line ? "" : undefined} className={cn("metric tabular", className)}>
      {text}
    </span>
  );
}

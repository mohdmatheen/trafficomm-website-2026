import { cn } from "@/lib/cn";

/**
 * The shape of a case study's documented figure, next to the figure itself.
 *
 * Three readings, chosen by what the metric actually is:
 *  - "4 → ~30" becomes two bars in that proportion — the scale, seen.
 *  - "99.34%" becomes a filled bar.
 *  - "300+" becomes a magnitude row, deliberately not a count: the blocks
 *    stand for "more than three hundred", they do not enumerate them.
 *
 * Every value comes from data/metrics.ts. Nothing is estimated, rounded up or
 * invented, and the number is always stated in text beside the mark.
 */
export function EvidenceMark({ value, tone = "light", className }: { value: string; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  const muted = dark ? "bg-white/20" : "bg-ink/15";

  // "4 → ~30": the two magnitudes, in proportion.
  const ratio = value.match(/^(\d+)\s*→\s*~?(\d+)$/);
  if (ratio) {
    const [a, b] = [Number(ratio[1]), Number(ratio[2])];
    return (
      <span className={cn("flex w-full max-w-[11rem] flex-col gap-1.5", className)} aria-hidden="true">
        <span className={cn("block h-1.5 rounded-full", muted)} style={{ width: `${Math.max(8, (a / b) * 100)}%` }} />
        <span className="block h-1.5 w-full rounded-full bg-signal" />
      </span>
    );
  }

  // "50%" / "99.34%": the proportion itself.
  const pct = value.match(/^([\d.]+)%$/);
  if (pct) {
    const p = Math.min(100, Number(pct[1]));
    return (
      <span className={cn("block h-1.5 w-full max-w-[11rem] overflow-hidden rounded-full", muted, className)} aria-hidden="true">
        <span className="block h-full rounded-full bg-signal" style={{ width: `${p}%` }} />
      </span>
    );
  }

  // "300+" / "250+" / "50+": magnitude, not a tally.
  if (/^\d+\+$/.test(value)) {
    return (
      <span className={cn("flex w-full max-w-[11rem] items-center gap-1", className)} aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className={cn("block h-1.5 flex-1 rounded-full", i < 5 ? "bg-signal" : muted)} />
        ))}
        <span className={cn("font-mono text-[0.7rem] leading-none", dark ? "text-mute" : "text-steel")}>+</span>
      </span>
    );
  }

  return null;
}

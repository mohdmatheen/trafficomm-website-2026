import { PlatformMark } from "@/components/ui/PlatformMark";
import type { ChainStage } from "@/data/service-depth";
import { cn } from "@/lib/cn";

// Column count per stage count, so rows fill evenly (5 → one row of five, 6 → two rows of three).
const LG_COLS: Record<number, number> = { 3: 3, 4: 4, 5: 5, 6: 3, 7: 4, 8: 4 };
const LG_COLS_CLASS: Record<number, string> = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };
const LG_SPAN_CLASS: Record<number, string> = { 2: "lg:col-span-2", 3: "lg:col-span-3" };

/**
 * Numbered operational chain (e.g. media plan → DV360 → CM360 → … → reporting).
 * Four stages per row on desktop, reading left to right; one column on mobile
 * in sequence. Static by design — the sequence carries
 * the meaning, not motion.
 */
export function StageChain({
  stages,
  label,
  tone = "dark",
  inputLabel = "Input",
  outputLabel = "Output",
}: {
  stages: readonly ChainStage[];
  label: string;
  tone?: "dark" | "light";
  inputLabel?: string;
  outputLabel?: string;
}) {
  const dark = tone === "dark";
  const cols = LG_COLS[stages.length] ?? 4;
  const lgRemainder = stages.length % cols;
  return (
    <ol
      aria-label={label}
      className={cn("grid gap-px overflow-hidden rounded-[var(--radius-panel)] sm:grid-cols-2", LG_COLS_CLASS[cols], dark ? "bg-line-dark ring-1 ring-line-dark" : "bg-line ring-1 ring-line")}
    >
      {stages.map((s, i) => {
        const input = s.owner === "client";
        const output = s.owner === "output";
        const last = i === stages.length - 1;
        return (
          <li
            key={s.label}
            className={cn(
              "relative flex flex-col p-6 sm:p-7",
              // The last stage widens to close an incomplete final row.
              last && stages.length % 2 === 1 && "sm:col-span-2",
              last && (lgRemainder ? LG_SPAN_CLASS[cols - lgRemainder + 1] : "lg:col-span-1"),
              dark ? (output ? "bg-ink-3" : "bg-ink-2") : output ? "bg-paper" : "bg-white")}
            data-reveal
            style={{ "--reveal-delay": `${(i % cols) * 60}ms` } as React.CSSProperties}
          >
            <span className={cn("absolute inset-x-0 top-0 h-[2px]", input ? (dark ? "bg-white/20" : "bg-ink/20") : "bg-signal")} aria-hidden="true" />
            <div className="flex items-center justify-between gap-3">
              <span className={cn("font-mono text-[0.72rem]", dark ? "text-mute" : "text-steel")}>{String(i + 1).padStart(2, "0")}</span>
              {(input || output) && (
                <span className={cn("rounded-full px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-[0.1em]", dark ? "bg-white/[0.06] text-fog" : "bg-paper text-steel")}>
                  {input ? inputLabel : outputLabel}
                </span>
              )}
            </div>
            <h3 className={cn("mt-5 flex min-h-[30px] items-center gap-2.5 text-[1.2rem] leading-tight tracking-[-0.02em]", dark ? "text-white" : "text-ink")}>
              {s.platform && <PlatformMark slug={s.platform} size={30} className="rounded-lg" />}
              {s.label}
            </h3>
            <ul className="mt-4 space-y-1.5">
              {s.items.map((it) => (
                <li key={it} className={cn("flex items-start gap-2.5 text-[0.94rem] leading-snug", dark ? "text-fog" : "text-graphite")}>
                  <span className={cn("mt-[0.6em] h-px w-3 shrink-0", input ? (dark ? "bg-white/40" : "bg-ink/40") : "bg-signal")} aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

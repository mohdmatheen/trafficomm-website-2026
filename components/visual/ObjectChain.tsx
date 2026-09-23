import { cn } from "@/lib/cn";

/**
 * The objects a platform is actually built from, in order.
 *
 * Campaign → ad set → ad is not marketing language, it is the structure an
 * operator works in — showing it says "we know this platform" faster than a
 * paragraph claiming platform expertise. Only hierarchies that are
 * technically correct for the platform appear; the rest of the platform pages
 * carry no chain rather than an approximate one.
 */
export function ObjectChain({ items, label, tone = "light", className }: { items: readonly string[]; label?: string; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-2", className)}>
      {label && <span className={cn("mr-1 font-mono text-[0.62rem] uppercase tracking-[0.12em]", dark ? "text-fog" : "text-steel")}>{label}</span>}
      {items.map((it, i) => (
        <span key={it} className="flex items-center gap-2.5">
          {i > 0 && (
            <span className="text-signal" aria-hidden="true">
              →
            </span>
          )}
          <span
            className={cn(
              "rounded-md px-2.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] ring-1 ring-inset",
              i === items.length - 1 ? (dark ? "bg-white text-ink ring-white" : "bg-ink text-white ring-ink") : dark ? "bg-white/[0.06] text-fog ring-line-dark" : "bg-white text-ink ring-line",
            )}
          >
            {it}
          </span>
        </span>
      ))}
    </div>
  );
}

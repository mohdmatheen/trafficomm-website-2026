import { Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * Small shared pieces for the Wave 1 service visuals (optimization engine,
 * programmatic delivery architecture, connected creative/adtech systems).
 *
 * The three approved prototypes — ad operations, measurement and reporting —
 * keep their own local copies of `Frame` on purpose: those pages are the
 * visual benchmark and must stay pixel-identical, so nothing here refactors
 * them.
 */
export function Frame({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-card)] bg-ink-3/60 p-4 ring-1 ring-line-dark sm:p-5", className)}>
      <p className="eyebrow mb-4 !text-[0.62rem] text-fog">{label}</p>
      {children}
    </div>
  );
}

/**
 * Mono chip used for objects, formats and platform terminology.
 *
 * The "on" state uses signal-ink rather than signal: white text at this size
 * on #ea3e3a is 4.0:1, which fails AA.
 */
export function Chip({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "on" | "plain" }) {
  return (
    <span
      className={cn(
        "rounded-md px-2.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] ring-1 ring-inset",
        tone === "on" ? "bg-signal-ink text-white ring-signal-ink" : tone === "plain" ? "text-white ring-line-dark" : "text-fog ring-line-dark",
      )}
    >
      {children}
    </span>
  );
}

/** Marks an interface or value as a fictional example, never a Trafficomm result. */
export function IllustrativeTag({ children = "Illustrative" }: { children?: React.ReactNode }) {
  return (
    <span className="rounded-full bg-signal-soft/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-signal ring-1 ring-inset ring-signal/40">{children}</span>
  );
}

/** Row of mono labels separated by a red middot — a compact stand-in for a card grid. */
export function DotList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <span className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      {items.map((it, i) => (
        <Fragment key={it}>
          {i > 0 && (
            <span className="text-signal" aria-hidden="true">
              ·
            </span>
          )}
          <span>{it}</span>
        </Fragment>
      ))}
    </span>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({ children, tone = "light", className, dot = false }: { children: ReactNode; tone?: "light" | "dark" | "signal"; className?: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 !text-[0.72rem]",
        tone === "light" && "bg-ink/[0.045] text-graphite ring-1 ring-inset ring-line",
        tone === "dark" && "bg-white/[0.06] text-fog ring-1 ring-inset ring-line-dark",
        tone === "signal" && "bg-signal-soft text-signal-ink ring-1 ring-inset ring-signal/20",
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Small monospaced key/value data label used across dashboards and cards. */
export function DataLabel({ k, v, tone = "light" }: { k: string; v: ReactNode; tone?: "light" | "dark" }) {
  return (
    <div className="flex items-baseline justify-between gap-4 font-mono text-[0.79rem] uppercase tracking-[0.08em]">
      <span className={tone === "light" ? "text-steel" : "text-mute"}>{k}</span>
      <span className={tone === "light" ? "text-ink" : "text-white"}>{v}</span>
    </div>
  );
}

import { LogoMark } from "@/components/ui/Logo";
import type { ServicePageContent } from "@/data/service-pages/types";
import { cn } from "@/lib/cn";

type Node = NonNullable<ServicePageContent["operatingChain"]>["nodes"][number];

/** Structured chain of responsibility: client → account management → operations → QA → client. */
export function OperatingChain({ nodes }: { nodes: readonly Node[] }) {
  return (
    <div data-reveal>
      <ol className="grid gap-3 lg:grid-cols-5 lg:gap-0" aria-label="Chain of responsibility">
        {nodes.map((node, i) => {
          const dark = node.owner === "trafficomm";
          const qa = node.owner === "qa";
          return (
            <li key={`${node.label}-${i}`} className="relative flex flex-col lg:px-1.5">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-[var(--radius-card)] p-5 sm:p-6",
                  dark ? "bg-ink text-white" : qa ? "bg-white ring-2 ring-signal/70" : "bg-white ring-1 ring-line",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("font-mono text-[0.72rem]", dark ? "text-mute" : "text-steel")}>{String(i + 1).padStart(2, "0")}</span>
                  {dark ? (
                    <LogoMark className="w-5" inverted />
                  ) : qa ? (
                    <span className="rounded-full bg-signal-soft px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-signal-ink">QA gate</span>
                  ) : (
                    <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-steel">{i === 0 ? "Input" : "Output"}</span>
                  )}
                </div>
                <h3 className={cn("mt-6 text-[1.2rem] leading-tight tracking-[-0.02em]", dark ? "text-white" : "text-ink")}>{node.label}</h3>
                <ul className="mt-4 space-y-1.5">
                  {node.items.map((it) => (
                    <li key={it} className={cn("flex items-center gap-2.5 text-[0.96rem]", dark ? "text-fog" : "text-graphite")}>
                      <span className={cn("h-px w-3", dark || qa ? "bg-signal" : "bg-ink/40")} aria-hidden="true" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              {i < nodes.length - 1 && (
                <>
                  <span className="absolute -right-2.5 top-1/2 z-10 hidden size-5 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-[0.8rem] text-signal ring-1 ring-line lg:flex" aria-hidden="true">
                    →
                  </span>
                  <span className="mx-auto block h-3 w-px bg-signal/60 lg:hidden" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      {/* return path */}
      <div className="mt-4 hidden items-center gap-3 lg:flex" aria-hidden="true">
        <span className="h-4 w-px bg-line-strong" />
        <span className="h-px flex-1 border-t border-dashed border-line-strong" />
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-steel">Continuous loop · next brief</span>
        <span className="h-px flex-1 border-t border-dashed border-line-strong" />
        <span className="h-4 w-px bg-line-strong" />
      </div>
    </div>
  );
}

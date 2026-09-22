import { aiPipeline } from "@/data/operations";
import { cn } from "@/lib/cn";

const kindLabel = { input: "Input", machine: "Automated", human: "Human decision", output: "Output" } as const;

/**
 * Horizontal on desktop, vertical on mobile. A CSS-only pulse steps through
 * the stages; the human stages are visually distinct because that is where
 * decisions are made.
 */
export function AIPipeline() {
  const n = aiPipeline.length;
  return (
    <ol className="relative grid gap-3 lg:grid-cols-7 lg:gap-0" aria-label="AI-assisted operations workflow">
      {aiPipeline.map((s, i) => {
        const human = s.kind === "human";
        return (
          <li key={s.label} className="relative lg:px-1.5" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
            {i < n - 1 && (
              <span
                className="absolute left-6 top-full h-3 w-px bg-line-strong lg:left-auto lg:right-[-6px] lg:top-9 lg:h-px lg:w-3"
                aria-hidden="true"
              />
            )}
            <div
              className={cn(
                "relative h-full rounded-[var(--radius-card)] p-4 lg:p-5",
                human ? "bg-ink text-white" : "bg-white ring-1 ring-line",
              )}
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] opacity-0 ring-2 ring-signal [animation:ai-step_7s_infinite]"
                style={{ animationDelay: `${i}s` }}
                aria-hidden="true"
              />
              <div className="flex items-center justify-between">
                <span className={cn("font-mono text-[0.72rem]", human ? "text-mute" : "text-steel")}>0{i + 1}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-[0.1em]",
                    human ? "bg-signal text-white" : "bg-paper text-steel",
                  )}
                >
                  {kindLabel[s.kind]}
                </span>
              </div>
              <p className={cn("mt-6 text-[1.08rem] leading-tight tracking-[-0.015em]", human ? "text-white" : "text-ink")}>{s.label}</p>
              <p className={cn("mt-2 text-[0.88rem] leading-snug", human ? "text-fog" : "text-steel")}>{s.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export type PressureTier = { title: string; items: readonly string[]; tone: "base" | "mid" | "risk" };

/**
 * Growth → pressure → risk cascade, resolved by Trafficomm.
 * Shared by the homepage and service pages.
 */
export function PressureCascade({ tiers, resolution, label }: { tiers: readonly PressureTier[]; resolution: { label: string; statement: string }; label: string }) {
  return (
    <ol className="relative" aria-label={label}>
      {tiers.map((tier, i) => (
        <li key={tier.title} className="relative pb-10 pl-12 sm:pl-16" data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
          {/* connector */}
          <span className="absolute left-[11px] top-7 bottom-0 w-px bg-line-strong sm:left-[15px]" aria-hidden="true">
            <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-signal [animation:problem-drop_2.4s_ease-in_infinite]" style={{ animationDelay: `${i * 0.5}s` }} />
          </span>
          <span
            className={cn(
              "absolute left-0 top-0.5 flex size-6 items-center justify-center rounded-full font-mono text-[0.68rem] sm:size-8",
              tier.tone === "risk" ? "bg-signal-cta text-white" : "bg-white text-ink ring-1 ring-line-strong",
            )}
            aria-hidden="true"
          >
            0{i + 1}
          </span>
          <p className={cn("eyebrow mb-4", tier.tone === "risk" ? "text-signal-ink" : "text-steel")}>{tier.title}</p>
          <ul className="flex flex-wrap gap-2">
            {tier.items.map((item) => (
              <li
                key={item}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[0.96rem] sm:text-[1.03rem]",
                  tier.tone === "base" && "bg-white text-ink ring-1 ring-line",
                  tier.tone === "mid" && "bg-ink/[0.06] text-ink",
                  tier.tone === "risk" && "text-signal-ink ring-1 ring-signal/35 bg-signal-soft",
                )}
              >
                {tier.tone === "base" && <span className="mr-1 text-signal">+</span>}
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
      <li className="relative pl-12 sm:pl-16" data-reveal style={{ "--reveal-delay": "300ms" } as React.CSSProperties}>
        <span className="absolute left-0 top-5 flex size-6 items-center justify-center rounded-full bg-ink sm:size-8" aria-hidden="true">
          <LogoMark className="w-3.5 sm:w-4" inverted />
        </span>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-6 text-white sm:p-8">
          <div className="grid-bg-dark absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow text-signal">{resolution.label}</p>
            <p className="mt-3 text-h3 text-white">{resolution.statement}</p>
          </div>
        </div>
      </li>
    </ol>
  );
}

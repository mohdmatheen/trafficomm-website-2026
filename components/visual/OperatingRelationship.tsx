import { PlatformMark } from "@/components/ui/PlatformMark";
import { LogoMark } from "@/components/ui/Logo";
import { platforms } from "@/data/platforms";
import { cn } from "@/lib/cn";

/**
 * The engagement, as a relationship rather than a process.
 *
 * Three layers — your team, Trafficomm, the platforms — with what moves
 * between them stated on the connectors. It is deliberately not a pipeline,
 * a dashboard or a product UI: the question this page has to answer is who
 * decides what, and the answer is that strategy, objectives and final
 * decisions never leave the client layer.
 *
 * Static by construction, so reduced motion shows exactly the same thing.
 * Mobile stacks the label above its band instead of shrinking the desktop
 * arrangement.
 */

const LAYERS = [
  {
    id: "client",
    label: "Your team",
    items: ["Strategy", "Objectives", "Business priorities", "Approvals", "Final decisions"],
  },
  {
    id: "trafficomm",
    label: "Trafficomm",
    items: ["Build", "QA", "Execute", "Optimize", "Measure", "Report"],
  },
] as const;

const LINKS = [
  { down: "Briefs, priorities and approvals", up: "Delivery, QA and reporting" },
  { down: "Setup, trafficking and optimization", up: "Delivery data and results" },
];

function Connector({ down, up }: { down: string; up: string }) {
  return (
    <div className="grid gap-x-5 py-4 lg:grid-cols-[12rem_1fr]" aria-hidden="true">
      <div className="hidden items-center justify-end lg:flex">
        <svg viewBox="0 0 12 44" className="h-11 w-3">
          <path d="M6 4v36" stroke="#ea3e3a" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M2 8 6 2l4 6" fill="none" stroke="#ea3e3a" strokeWidth="1.5" />
          <path d="M2 36l4 6 4-6" fill="none" stroke="#ea3e3a" strokeWidth="1.5" />
        </svg>
      </div>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 pl-4 lg:pl-0">
        {[
          { t: down, d: "↓" },
          { t: up, d: "↑" },
        ].map((l) => (
          <li key={l.t} className="flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-fog">
            <span className="text-signal">{l.d}</span>
            {l.t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OperatingRelationship() {
  const pls = platforms.slice(0, 8);
  return (
    <div>
      {LAYERS.map((layer, i) => (
        <div key={layer.id}>
          <div className="grid gap-x-5 gap-y-3 lg:grid-cols-[12rem_1fr] lg:items-center">
            <p className={cn("flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] lg:justify-end", layer.id === "trafficomm" ? "text-white" : "text-fog")}>
              {layer.id === "trafficomm" && <LogoMark className="w-5" inverted />}
              {layer.label}
            </p>
            <ul
              className={cn(
                "flex flex-wrap gap-1.5 rounded-[var(--radius-card)] p-3 ring-1 ring-inset sm:p-4",
                layer.id === "trafficomm" ? "bg-white/[0.07] ring-signal/50" : "bg-ink-2 ring-line-dark",
              )}
            >
              {layer.items.map((it) => (
                <li
                  key={it}
                  className={cn(
                    "rounded-md px-3 py-2 text-[0.92rem] ring-1 ring-inset",
                    layer.id === "trafficomm" ? "bg-ink-2 text-white ring-line-dark-strong" : "bg-white/[0.04] text-fog ring-line-dark",
                  )}
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <Connector {...LINKS[i]} />
        </div>
      ))}

      <div className="grid gap-x-5 gap-y-3 lg:grid-cols-[12rem_1fr] lg:items-center">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-fog lg:text-right">Platforms &amp; ad tech</p>
        <ul className="flex flex-wrap gap-1.5 rounded-[var(--radius-card)] bg-ink-2 p-3 ring-1 ring-inset ring-line-dark sm:p-4">
          {pls.map((p) => (
            <li key={p.slug} className="flex items-center gap-2 rounded-md bg-white/[0.04] py-1.5 pl-1.5 pr-3 text-[0.9rem] text-fog ring-1 ring-inset ring-line-dark">
              <PlatformMark slug={p.slug} size={22} className="rounded-md" />
              {p.name}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 max-w-2xl text-[0.94rem] leading-relaxed text-mute">
        Strategy, objectives and final decisions stay with your team. Trafficomm operates the layer underneath — inside your platforms, your naming conventions and your approval steps.
      </p>
    </div>
  );
}

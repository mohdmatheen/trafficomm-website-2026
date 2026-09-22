"use client";

import { useId, useState } from "react";
import { processFlows } from "@/data/operations";
import { cn } from "@/lib/cn";

const actorStyle: Record<string, string> = {
  Agency: "bg-paper text-graphite ring-1 ring-line-strong",
  Publisher: "bg-paper text-graphite ring-1 ring-line-strong",
  Trafficomm: "bg-signal-soft text-signal-ink ring-1 ring-signal/25",
};

/** Tabbed process diagrams: agency ad operations vs programmatic. */
export function ProcessFlow() {
  const [active, setActive] = useState(0);
  const id = useId();
  const flow = processFlows[active];

  return (
    <div>
      <div role="tablist" aria-label="Process flows" className="inline-flex rounded-full bg-white p-1 ring-1 ring-line">
        {processFlows.map((f, i) => (
          <button
            key={f.key}
            role="tab"
            type="button"
            id={`${id}-t${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-p`}
            onClick={() => setActive(i)}
            className={cn("rounded-full px-4 py-2 text-[0.96rem] transition-colors sm:px-5", i === active ? "bg-ink text-white" : "text-graphite hover:text-ink")}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div id={`${id}-p`} role="tabpanel" aria-labelledby={`${id}-t${active}`} className="mt-8">
        <p className="max-w-2xl text-[1rem] leading-relaxed text-steel">{flow.intro}</p>
        <ol key={flow.key} className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {flow.steps.map((s, i) => (
            <li
              key={s.title}
              className="relative flex flex-col rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line [animation:engine-in_0.5s_var(--ease-out-expo)_both]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.77rem] text-steel">{String(i + 1).padStart(2, "0")}</span>
                <span className={cn("rounded-full px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.1em]", actorStyle[s.actor])}>{s.actor}</span>
              </div>
              <p className="mt-5 text-[1.1rem] leading-tight tracking-[-0.015em] text-ink">{s.title}</p>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-steel">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

"use client";

import { useId, useState } from "react";
import { cpaTrend, dashboardViews, insightStory } from "@/data/visual/reporting-dashboard";
import { cn } from "@/lib/cn";
import { BarRows, MixBar, TrendLine } from "./MiniChart";

/**
 * A representation of the Trafficomm reporting workflow — not a product.
 * Trafficomm does not sell dashboard software, and every figure here is
 * fictional sample data, labelled as such in the interface itself.
 *
 * The three layers below the numbers carry the actual argument: reporting
 * says what happened, analysis says why, insight says what to do next — and
 * the decision stays with a person.
 */
export function ReportingDashboard({ definitions }: { definitions?: readonly { label: string; question: string; body: string }[] }) {
  const id = useId();
  const [view, setView] = useState(0);
  const v = dashboardViews[view];

  return (
    <div className="overflow-hidden rounded-[var(--radius-panel)] bg-ink-2 ring-1 ring-line-dark">
      {/* Chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark px-5 py-3">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-white">Reporting workflow</span>
        <span className="rounded-full bg-signal-soft/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-signal ring-1 ring-inset ring-signal/40">Illustrative data</span>
      </div>

      {/* View selector */}
      <div className="border-b border-line-dark px-5 py-3">
        <div role="tablist" aria-label="Reporting view" className="flex flex-wrap gap-1.5">
          {dashboardViews.map((d, i) => {
            const on = i === view;
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                id={`${id}-t${i}`}
                aria-selected={on}
                aria-controls={`${id}-p`}
                tabIndex={on ? 0 : -1}
                onClick={() => setView(i)}
                onKeyDown={(e) => {
                  const n = dashboardViews.length;
                  const to = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : null;
                  if (to === null) return;
                  e.preventDefault();
                  setView(to);
                  document.getElementById(`${id}-t${to}`)?.focus();
                }}
                className={cn(
                  "min-h-11 rounded-md px-3.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none",
                  on ? "bg-signal text-white ring-signal" : "text-mute ring-line-dark hover:text-fog",
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div id={`${id}-p`} role="tabpanel" aria-label={`${v.label} reporting view, illustrative data`}>
        {/* KPI cards */}
        <dl className="grid gap-px bg-line-dark sm:grid-cols-2 lg:grid-cols-3">
          {v.kpis.map((k) => (
            <div key={k.label} className="bg-ink-2 p-5">
              <dt className="eyebrow !text-[0.62rem] text-fog">{k.label}</dt>
              <dd className="mt-2 text-[1.9rem] leading-none tracking-[-0.04em] text-white tabular">{k.value}</dd>
              <dd className="mt-2 text-[0.8rem] text-mute">{k.note}</dd>
            </div>
          ))}
        </dl>

        {/* Charts */}
        <div className="grid gap-px border-t border-line-dark bg-line-dark lg:grid-cols-[1.2fr_1fr]">
          <div className="bg-ink-2 p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow !text-[0.62rem] text-fog">CPA trend · 12 periods</p>
              <p className="font-mono text-[0.72rem] text-mute tabular">${cpaTrend[cpaTrend.length - 1].toFixed(2)}</p>
            </div>
            <div className="mt-4 h-24">
              <TrendLine values={cpaTrend} />
            </div>
            <p className="mt-3 text-[0.82rem] text-fog">CPA drifts above target across the last four periods.</p>
          </div>
          <div className="bg-ink-2 p-5">
            <p className="eyebrow !text-[0.62rem] text-fog">{v.breakdownLabel}</p>
            <div className="mt-4">{view === 0 ? <MixBar rows={v.breakdown} /> : <BarRows rows={v.breakdown} />}</div>
          </div>
        </div>

        {/* Reporting → analysis → insight */}
        <ol className="grid gap-px border-t border-line-dark bg-line-dark lg:grid-cols-3">
          {[
            { k: "Reporting", s: insightStory.reporting, body: <p className="mt-3 text-[0.9rem] leading-relaxed text-fog">{insightStory.reporting.detail}</p> },
            {
              k: "Analysis",
              s: insightStory.analysis,
              body: (
                <ul className="mt-3 space-y-1.5">
                  {insightStory.analysis.factors.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[0.9rem] text-fog">
                      <span className="h-px w-3 bg-signal" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              k: "Insight",
              s: insightStory.insight,
              body: (
                <ol className="mt-3 space-y-1.5">
                  {insightStory.insight.actions.map((a, i) => (
                    <li key={a} className="flex items-baseline gap-2.5 text-[0.9rem] text-white">
                      <span className="font-mono text-[0.68rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
                      {a}
                    </li>
                  ))}
                </ol>
              ),
            },
          ].map(({ k, s, body }, i) => (
            <li key={k} className={cn("p-5", i === 2 ? "bg-ink-3" : "bg-ink-2")}>
              <p className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-signal">
                <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                {k}
              </p>
              <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-mute">{definitions?.[i]?.question ?? s.question}</p>
              {definitions?.[i] && <p className="mt-2 text-[0.88rem] leading-relaxed text-mute">{definitions[i].body}</p>}
              <p className="mt-3 text-[1.05rem] leading-snug text-white">{s.headline}</p>
              {body}
            </li>
          ))}
        </ol>

        <p className="border-t border-line-dark px-5 py-4 text-[0.82rem] leading-relaxed text-mute">
          Illustrative interface and sample values — not Trafficomm or client performance. Reports are produced in your templates, and the decision stays with your team.
        </p>
      </div>
    </div>
  );
}

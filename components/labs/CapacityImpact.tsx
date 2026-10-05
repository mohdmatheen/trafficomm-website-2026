"use client";

import { useEffect, useRef } from "react";
import { Slider } from "@/components/labs/primitives";
import { formatHours, formatNumber, formatPercent } from "@/lib/labs/currency";
import { ALLOCATION_CATEGORIES, allocationRows } from "@/lib/labs/allocation";
import type { useLabsCalculator } from "@/lib/labs/state";
import { cn } from "@/lib/cn";

type Ctx = ReturnType<typeof useLabsCalculator>;

/**
 * Current operating model versus external delivery.
 *
 * Two stacked bars drawn to the same scale — the team's productive capacity — so
 * the comparison is honest: the second bar is not a different chart, it is the
 * same capacity divided differently. Externally delivered work is shown as a
 * distinct band rather than removed, because that workload does not disappear;
 * it moves outside the internal team.
 *
 * Nothing here is colour-only. Every band carries its own label, hours, share
 * and a hatch or solid fill, the two models are named in text, and the whole
 * comparison is repeated as a table for assistive technology.
 */
export function CapacityImpact(ctx: Ctx) {
  const { state, dispatch, result: base, scenario, context, trackEvent } = ctx;
  const seen = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // One view event when the section first reaches the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || seen.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !seen.current) {
          seen.current = true;
          trackEvent("capacity_visual_viewed", context());
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [context, trackEvent]);

  const capacity = Math.max(base.productiveCapacity, base.workloadHours, 1);
  const alloc = state.scenario.externalAllocation;

  // Current model: the workload as it stands, against capacity.
  const currentWork = base.workloadHours;
  const currentSpare = Math.max(0, base.productiveCapacity - base.workloadHours);

  // With external delivery: the same workload, split by where it is performed.
  const delivered = scenario.externallyDeliveredHours;
  const retained = scenario.internalHours;
  const released = Math.max(0, base.workloadHours - retained);

  const rows = allocationRows(state.allocation, released);
  const hasReleased = released > 0.5;

  return (
    <section ref={sectionRef} aria-labelledby="capacity-impact-title" className="grid gap-10">
      <div>
        <h3 id="capacity-impact-title" className="text-[clamp(1.5rem,1.25rem+1.1vw,2.1rem)] leading-[1.1] tracking-[-0.03em] text-ink">
          See how outsourcing changes your team&rsquo;s capacity
        </h3>
        <p className="mt-3 max-w-prose text-[1.02rem] leading-relaxed text-steel">
          Explore how moving eligible execution workload outside the core team could release internal capacity for strategy, client growth, analysis and new
          business. The slider moves a share of the <strong className="font-medium text-ink">eligible</strong> workload — not a share of your team, your hours
          or your payroll.
        </p>
      </div>

      <div className="rounded-[var(--radius-panel)] bg-white p-5 ring-1 ring-inset ring-line sm:p-8">
        <Slider
          id="capacity-external"
          label="External execution allocation"
          min={0}
          max={100}
          step={5}
          value={Math.round(alloc * 100)}
          valueLabel={alloc === 0 ? "All delivered internally" : `${Math.round(alloc * 100)}% of eligible workload`}
          minLabel="0%"
          maxLabel="100% of eligible"
          onChange={(v) => {
            dispatch({ type: "setScenario", patch: { externalAllocation: v / 100 } });
            trackEvent("externalization_changed", { ...context(), scenario_control: "external_allocation" });
          }}
        />
        <p className="mt-2 text-[0.84rem] leading-relaxed text-steel">
          {formatHours(base.externalizableHours)} of your {formatHours(base.workloadHours)} monthly workload is eligible. At {Math.round(alloc * 100)}% that is{" "}
          {formatHours(delivered)} delivered externally.
        </p>

        <div className="mt-8 grid gap-7">
          <Model
            name="Current operating model"
            caption="All operational workload delivered by the internal team."
            capacity={capacity}
            bands={[
              { key: "work", label: "Operational execution, internal", hours: currentWork, tone: "burden" },
              { key: "spare", label: "Remaining capacity", hours: currentSpare, tone: "spare" },
            ]}
            footnote={`Team utilization ${formatPercent(base.utilization)}`}
          />
          <Model
            name="With external delivery"
            caption="The same workload, divided by where it is performed."
            capacity={capacity}
            bands={[
              { key: "retained", label: "Operational execution, retained internally", hours: retained, tone: "burden" },
              { key: "delivered", label: "Delivered externally", hours: delivered, tone: "external" },
              { key: "released", label: "Internal capacity released", hours: released, tone: "released" },
              { key: "spare", label: "Remaining capacity", hours: currentSpare, tone: "spare" },
            ]}
            footnote={`Internal utilization ${formatPercent(scenario.internalUtilization)} · internal requirement ${formatNumber(scenario.internalFteRequirement, 1)} FTE`}
          />
        </div>

        <p className="mt-6 text-[0.84rem] leading-relaxed text-steel">
          Externally delivered hours are not removed from the campaign — they are performed outside the internal team. &ldquo;Released&rdquo; describes internal
          capacity that is no longer committed to that execution.
        </p>
      </div>

      {/* Reallocation. Suppressed entirely when there is nothing to allocate. */}
      {hasReleased ? (
        <div>
          <h4 className="text-[1.3rem] tracking-[-0.025em] text-ink">How could you use the capacity released?</h4>
          <p className="mt-2 max-w-prose text-[0.98rem] leading-relaxed text-steel">
            {formatHours(released)} a month, divided however you expect to use it. The split below is{" "}
            <strong className="font-medium text-ink">illustrative</strong> — Trafficomm has no way of knowing how your team would spend it. Move any category and
            the rest adjust.
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <ul className="grid gap-5">
              {rows.map((r) => (
                <li key={r.id}>
                  <Slider
                    id={`alloc-${r.id}`}
                    label={r.label}
                    min={0}
                    max={100}
                    step={1}
                    value={r.percent}
                    valueLabel={`${formatHours(r.hours)} · ${r.percent}%`}
                    onChange={(v) => {
                      dispatch({ type: "setAllocation", id: r.id, value: v });
                      trackEvent("capacity_allocation_changed", { ...context(), scenario_control: r.id });
                    }}
                  />
                </li>
              ))}
              <li className="flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-[0.98rem] text-ink">Total</span>
                <span className="font-mono text-[0.9rem] tabular-nums text-ink">
                  {formatHours(rows.reduce((s, r) => s + r.hours, 0))} · 100%
                </span>
              </li>
            </ul>
            <ul className="grid content-start gap-3">
              {ALLOCATION_CATEGORIES.map((c) => (
                <li key={c.id} className="rounded-[var(--radius-card)] bg-paper px-5 py-4 ring-1 ring-inset ring-line">
                  <p className="text-[1rem] tracking-[-0.01em] text-ink">{c.label}</p>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-steel">{c.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-[0.84rem] leading-relaxed text-steel">
            These describe what released capacity could support. They are possibilities, not outcomes Trafficomm is forecasting — the model contains no link
            between hours and revenue, and does not pretend to.
          </p>
        </div>
      ) : (
        <div className="rounded-[var(--radius-card)] bg-paper px-6 py-8 text-center ring-1 ring-inset ring-line">
          <p className="text-[1.02rem] text-ink">Nothing is released yet.</p>
          <p className="mx-auto mt-2 max-w-prose text-[0.94rem] leading-relaxed text-steel">
            Move the external execution allocation above zero to see how internal capacity would change, and what it could be used for.
          </p>
        </div>
      )}
    </section>
  );
}

const TONES = {
  burden: { fill: "bg-signal", chip: "bg-signal", label: "currently consuming internal capacity" },
  external: { fill: "bg-ink", chip: "bg-ink", label: "performed outside the internal team" },
  released: { fill: "bg-signal-soft ring-1 ring-inset ring-signal/50", chip: "bg-signal-soft ring-1 ring-inset ring-signal/50", label: "internal capacity no longer committed" },
  spare: { fill: "bg-line-strong", chip: "bg-line-strong", label: "capacity not consumed by the stated workload" },
} as const;

type Band = { key: string; label: string; hours: number; tone: keyof typeof TONES };

function Model({ name, caption, bands, capacity, footnote }: { name: string; caption: string; bands: Band[]; capacity: number; footnote: string }) {
  const shown = bands.filter((b) => b.hours > 0.5);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[1.05rem] tracking-[-0.015em] text-ink">{name}</p>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-steel">{footnote}</p>
      </div>
      <p className="mt-1 text-[0.88rem] leading-relaxed text-steel">{caption}</p>

      <div className="mt-4 flex h-14 w-full overflow-hidden rounded-[10px] bg-paper-2" role="presentation">
        {shown.map((b) => (
          <div
            key={b.key}
            className={cn("h-full transition-[flex-grow] duration-500 ease-out motion-reduce:transition-none", TONES[b.tone].fill)}
            style={{ flexGrow: b.hours, flexBasis: 0 }}
          />
        ))}
      </div>

      {/* Labels carry the meaning; the bar is the supporting illustration. */}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {shown.map((b) => (
          <li key={b.key} className="flex items-baseline gap-2.5">
            <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-[3px]", TONES[b.tone].chip)} aria-hidden="true" />
            <span className="flex-1 text-[0.92rem] leading-snug text-graphite">{b.label}</span>
            <span className="whitespace-nowrap font-mono text-[0.82rem] tabular-nums text-ink">{formatHours(b.hours)}</span>
            <span className="w-11 whitespace-nowrap text-right font-mono text-[0.82rem] tabular-nums text-steel">
              {Math.round((b.hours / capacity) * 100)}%
            </span>
          </li>
        ))}
      </ul>

      {/* Wrapped, not `sr-only` on the table itself: a table ignores
          `overflow: hidden` on its own box and lays out at natural width. */}
      <div className="sr-only">
        <table>
          <caption>{`${name}. ${caption}`}</caption>
          <thead>
            <tr>
              <th scope="col">Band</th>
              <th scope="col">Hours per month</th>
              <th scope="col">Share of productive capacity</th>
              <th scope="col">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((b) => (
              <tr key={b.key}>
                <th scope="row">{b.label}</th>
                <td>{formatHours(b.hours)}</td>
                <td>{Math.round((b.hours / capacity) * 100)}%</td>
                <td>{TONES[b.tone].label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

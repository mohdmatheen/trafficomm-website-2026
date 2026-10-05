"use client";

import { useEffect, useRef } from "react";
import { Slider } from "@/components/labs/primitives";
import { formatHours, formatNumber, formatPercent } from "@/lib/labs/currency";
import { allocationRows } from "@/lib/labs/allocation";
import type { useLabsCalculator } from "@/lib/labs/state";
import { cn } from "@/lib/cn";

type Ctx = ReturnType<typeof useLabsCalculator>;

/**
 * Current operating model versus external delivery.
 *
 * Both internal-capacity bars are drawn against the same scale — the team's
 * productive capacity — and each band's width is its share of that scale, so the
 * printed percentage and the drawn width are the same number. An earlier version
 * sized bands with `flex-grow`, which normalises every bar to the full width: the
 * second bar carried more hours than the first and was silently compressed,
 * making the retained-internal band look smaller than it is. A capacity chart
 * that flatters the outsourcing case is worse than no chart.
 *
 * Externally delivered work sits on its own track below the bar, at the same
 * hours-per-pixel, rather than inside it. It is the same quantity as the released
 * capacity seen from the other side, so drawing both inside one bar would have
 * counted it twice and made the second model look larger than the team.
 *
 * Nothing is colour-only. Every band carries its own label, hours and share, the
 * external track is hatched as well as separated, the two models are named in
 * text, and the whole comparison is repeated as a table for assistive technology.
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

  const releasedFte = released / (base.productiveHoursPerFte || 1);
  const pct = Math.round(alloc * 100);

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

        {/* The payoff, stated once and in full, next to the picture that shows it. */}
        <p className="mt-7 max-w-[62ch] text-[clamp(1.12rem,1rem+0.45vw,1.42rem)] leading-snug tracking-[-0.02em] text-ink">
          {hasReleased ? (
            <>
              At {pct}%, <strong className="font-medium">{formatHours(released)} a month</strong> of internal capacity &mdash; about{" "}
              {formatNumber(releasedFte, 1)} full-time equivalents &mdash; would no longer be committed to execution. The work itself continues; it is
              performed outside the internal team.
            </>
          ) : (
            <>Everything is delivered internally. Move the allocation above zero to see how the team&rsquo;s capacity would divide.</>
          )}
        </p>

        <div className="mt-8 grid gap-9">
          <Model
            name="Current operating model"
            caption="All operational workload delivered by the internal team."
            scale={capacity}
            bands={[
              { key: "work", label: "Operational execution, internal", hours: currentWork, tone: "burden" },
              { key: "spare", label: "Remaining capacity", hours: currentSpare, tone: "spare" },
            ]}
            footnote={`Team utilization ${formatPercent(base.utilization)}`}
          />
          <Model
            name="With external delivery"
            caption="The same team capacity, divided differently. Both bars are drawn to the same scale."
            scale={capacity}
            bands={[
              { key: "retained", label: "Operational execution, retained internally", hours: retained, tone: "burden" },
              { key: "released", label: "Internal capacity released", hours: released, tone: "released" },
              { key: "spare", label: "Remaining capacity", hours: currentSpare, tone: "spare" },
            ]}
            external={{ hours: delivered, offsetHours: retained, label: "Delivered externally, outside the internal team" }}
            footnote={`Internal utilization ${formatPercent(scenario.internalUtilization)} \u00b7 internal requirement ${formatNumber(scenario.internalFteRequirement, 1)} FTE`}
          />
        </div>

        {/* Only worth saying once there are two things to tell apart. */}
        {hasReleased && (
          <p className="mt-6 text-[0.84rem] leading-relaxed text-steel">
            The external track and the released band are the same hours seen from two sides: the work still happens, and the internal capacity it used to
            consume is what becomes available. They are shown separately so that neither is mistaken for the other, and they are never added together.
          </p>
        )}
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
          {/* One row per category. An earlier layout repeated all six labels in a
              second column beside the sliders; the description belongs with the
              control it describes, not in a parallel list of the same names. */}
          <ul className="mt-6 grid gap-7 lg:grid-cols-2 lg:gap-x-12">
            {rows.map((r) => (
              <li key={r.id}>
                <Slider
                  id={`alloc-${r.id}`}
                  label={r.label}
                  min={0}
                  max={100}
                  step={1}
                  value={r.percent}
                  valueLabel={`${formatHours(r.hours)} \u00b7 ${r.percent}%`}
                  onChange={(v) => {
                    dispatch({ type: "setAllocation", id: r.id, value: v });
                    trackEvent("capacity_allocation_changed", { ...context(), scenario_control: r.id });
                  }}
                />
                <p className="mt-2 text-[0.86rem] leading-relaxed text-steel">{r.blurb}</p>
              </li>
            ))}
            <li className="flex items-baseline justify-between border-t border-line pt-4 lg:col-span-2">
              <span className="text-[0.98rem] text-ink">Total</span>
              <span className="font-mono text-[0.9rem] tabular-nums text-ink">{formatHours(rows.reduce((s, r) => s + r.hours, 0))} &middot; 100%</span>
            </li>
          </ul>
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

/**
 * Current state reads as warning, released capacity as the opportunity. Neither
 * meaning rests on colour: every band is labelled with what it is, how many hours
 * it holds and what share of capacity that is, and the external track is hatched
 * and physically separated as well as differently filled. The palette holds no
 * green, so the positive band is solid ink rather than an invented brand colour.
 */
const TONES = {
  burden: { fill: "bg-signal", meaning: "currently consuming internal capacity" },
  released: { fill: "bg-ink", meaning: "internal capacity no longer committed to execution" },
  spare: { fill: "bg-line-strong", meaning: "capacity not consumed by the stated workload" },
} as const;

/** Diagonal hatch: work performed outside the internal team, not an internal band. */
const HATCH = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgb(12 12 13 / 0.62) 0 5px, rgb(12 12 13 / 0.16) 5px 10px)",
} as const;

type Band = { key: string; label: string; hours: number; tone: keyof typeof TONES };
/** `offsetHours` aligns the track under the released band — the same hours, seen from the other side. */
type External = { hours: number; label: string; offsetHours: number };

function Model({
  name,
  caption,
  bands,
  scale,
  footnote,
  external,
}: {
  name: string;
  caption: string;
  bands: Band[];
  scale: number;
  footnote: string;
  external?: External;
}) {
  const shown = bands.filter((b) => b.hours > 0.5);
  const share = (hours: number) => (hours / scale) * 100;
  const hasExternal = !!external && external.hours > 0.5;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[1.05rem] tracking-[-0.015em] text-ink">{name}</p>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-steel">{footnote}</p>
      </div>
      <p className="mt-1 text-[0.88rem] leading-relaxed text-steel">{caption}</p>

      {/* Internal capacity. Widths are shares of `scale`, so a band drawn at a
          third of the bar is a third of capacity — the same number printed beside it. */}
      <div className="mt-4 flex h-14 w-full overflow-hidden rounded-[10px] bg-paper-2" role="presentation">
        {shown.map((b) => (
          <div
            key={b.key}
            className={cn("h-full transition-[width] duration-500 ease-out motion-reduce:transition-none", TONES[b.tone].fill)}
            style={{ width: `${share(b.hours)}%` }}
          />
        ))}
      </div>

      {/* Labels carry the meaning; the bar is the supporting illustration. */}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {shown.map((b) => (
          <li key={b.key} className="flex items-baseline gap-2.5">
            <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-[3px]", TONES[b.tone].fill)} aria-hidden="true" />
            <span className="flex-1 text-[0.92rem] leading-snug text-graphite">{b.label}</span>
            <span className="whitespace-nowrap font-mono text-[0.82rem] tabular-nums text-ink">{formatHours(b.hours)}</span>
            <span className="w-11 whitespace-nowrap text-right font-mono text-[0.82rem] tabular-nums text-steel">{Math.round(share(b.hours))}%</span>
          </li>
        ))}
      </ul>

      {hasExternal && (
        <div className="mt-5 border-t border-dashed border-line-strong pt-4">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-steel">Performed outside the internal team</p>
          {/* Same hours-per-pixel as the bar above, so the two are directly comparable. */}
          <div className="mt-2 flex h-8 w-full overflow-hidden rounded-[8px]" role="presentation">
            <div
              className="h-full rounded-[8px] ring-1 ring-inset ring-ink/25 transition-[width,margin] duration-500 ease-out motion-reduce:transition-none"
              style={{ ...HATCH, width: `${share(external.hours)}%`, marginLeft: `${share(external.offsetHours)}%` }}
            />
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li className="flex items-baseline gap-2.5">
              <span className="mt-1.5 size-2.5 shrink-0 rounded-[3px] ring-1 ring-inset ring-ink/25" style={HATCH} aria-hidden="true" />
              <span className="flex-1 text-[0.92rem] leading-snug text-graphite">{external.label}</span>
              <span className="whitespace-nowrap font-mono text-[0.82rem] tabular-nums text-ink">{formatHours(external.hours)}</span>
              <span className="w-11 whitespace-nowrap text-right font-mono text-[0.82rem] tabular-nums text-steel">{Math.round(share(external.hours))}%</span>
            </li>
          </ul>
        </div>
      )}

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
                <td>{Math.round(share(b.hours))}%</td>
                <td>{TONES[b.tone].meaning}</td>
              </tr>
            ))}
            {hasExternal && (
              <tr>
                <th scope="row">{external.label}</th>
                <td>{formatHours(external.hours)}</td>
                <td>{Math.round(share(external.hours))}%</td>
                <td>performed outside the internal team, not drawn from internal capacity</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { BarRows, ScoreBars, ScoreDial, StackedBar, type Datum } from "@/components/labs/charts";
import { CapacityImpact } from "@/components/labs/CapacityImpact";
import { DeliveryEstimate } from "@/components/labs/DeliveryEstimate";
import { Report } from "@/components/labs/Report";
import { CountUp, EstimatedTag, Explain, Money, Slider, Stat } from "@/components/labs/primitives";
import { formatHours, formatMoney, formatNumber, formatPercent } from "@/lib/labs/currency";
import { MAX_REPORTING_REDUCTION } from "@/lib/labs/scenario";
import type { useLabsCalculator } from "@/lib/labs/state";

type Ctx = ReturnType<typeof useLabsCalculator>;

const CATEGORY_TONE: Record<string, Datum["tone"]> = {
  Execution: "signal",
  Measurement: "ink",
  Strategy: "ink",
  Administration: "muted",
};

export function Results(ctx: Ctx) {
  const { state, dispatch, result: r, market, fx, context, trackEvent } = ctx;
  const over = r.utilization > 1;

  return (
    <div className="grid gap-14">
      {/* Headline. Four metrics, not ten — utilization and externalizable workload
          are the two that change what a reader does next. */}
      <section aria-labelledby="results-headline">
        <h2 id="results-headline" className="text-[clamp(1.8rem,1.4rem+1.6vw,2.7rem)] leading-[1.08] tracking-[-0.035em] text-ink">
          Here is what your operation costs to run.
        </h2>
        <p className="mt-3 max-w-prose text-[1.02rem] leading-relaxed text-steel">
          Calculated from the inputs you gave, against Trafficomm&rsquo;s operating assumptions. Every figure below is yours to check — nothing has been sent anywhere.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Team utilization" tone={over ? "signal" : "light"} note={over ? "Workload exceeds the team's productive capacity." : "Share of productive capacity the workload consumes."}>
            <span className="block whitespace-nowrap text-[clamp(1.6rem,11cqi,3rem)] font-medium tabular-nums tracking-[-0.04em] text-ink">
              <CountUp value={r.utilization} format={(n) => formatPercent(n)} />
            </span>
          </Stat>
          <Stat label="Monthly team cost" note={`Fully loaded, including the ${Math.round(state.input.operating.employerOverhead * 100)}% employer overhead.`}>
            <Money amount={r.loadedMonthlyCost} currency={market.currency} fx={fx} size="xl" />
          </Stat>
          <Stat label="Execution cost" note="What the execution half of the workload costs at your effective hourly rate.">
            <Money amount={r.executionCost} currency={market.currency} fx={fx} size="xl" />
          </Stat>
          <Stat label="Externalizable workload" tone="dark" note="Hours per month potentially suitable for external delivery. An assessment of the work, not a recommendation.">
            <span className="block whitespace-nowrap text-[clamp(1.6rem,11cqi,3rem)] font-medium tabular-nums tracking-[-0.04em] text-white">
              <CountUp value={r.externalizableHours} format={(n) => formatNumber(n, 0)} />
            </span>
            <span className="mt-1 block font-mono text-[0.72rem] uppercase tracking-[0.1em] text-fog">hours / month</span>
          </Stat>
        </div>

        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Productive capacity", value: formatHours(r.productiveCapacity), note: `${formatNumber(r.headcount, 0)} people` },
            { label: "Execution FTE", value: formatNumber(r.executionFte, 1), note: "people-equivalent on execution" },
            { label: "Cost per campaign", value: formatMoney(r.costPerCampaign, market.currency), note: `≈ USD ${formatNumber(r.costPerCampaign * fx.rate, 2)}` },
            { label: "Annual team cost", value: formatMoney(r.annualLoadedCost, market.currency), note: `≈ USD ${formatNumber(r.annualLoadedCost * fx.rate, 0)}` },
          ].map((s) => (
            <div key={s.label} className="rounded-[var(--radius-card)] bg-paper px-5 py-4 ring-1 ring-inset ring-line">
              <dt className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-steel">{s.label}</dt>
              <dd className="mt-2 text-[1.3rem] tabular-nums tracking-[-0.02em] text-ink">{s.value}</dd>
              <dd className="mt-0.5 font-mono text-[0.68rem] tabular-nums text-steel">{s.note}</dd>
            </div>
          ))}
        </dl>

        {/* One line for the whole screen rather than FX metadata on every tile. */}
        <p className="mt-4 text-[0.82rem] leading-relaxed text-steel">
          USD equivalents use 1 {market.currency} = {fx.rate.toFixed(5)} USD,{" "}
          {fx.source === "fallback" ? (
            <>reference rate from {formatDate(fx.asOf)}</>
          ) : (
            <>rate updated {formatDate(fx.asOf)}</>
          )}
          .
        </p>
      </section>

      {/* Where the time goes, and how capacity is allocated. */}
      <section aria-labelledby="time-title" className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h3 id="time-title" className="text-[1.35rem] tracking-[-0.025em] text-ink">Where your team&rsquo;s time goes</h3>
          <p className="mt-2 text-[0.94rem] leading-relaxed text-steel">Operational hours per month by activity.</p>
          <div className="mt-6">
            <BarRows
              caption="Operational hours per month by activity"
              unit="Hours per month"
              data={r.activities
                .slice()
                .sort((a, b) => b.hoursPerMonth - a.hoursPerMonth)
                .map((a) => ({ key: a.id, label: a.label, value: a.hoursPerMonth, display: formatHours(a.hoursPerMonth), tone: CATEGORY_TONE[a.category] }))}
            />
          </div>
        </div>
        <div>
          <h3 className="text-[1.35rem] tracking-[-0.025em] text-ink">Capacity allocation</h3>
          <p className="mt-2 text-[0.94rem] leading-relaxed text-steel">
            {over ? "The workload exceeds capacity, so there is no unused headroom." : "How the team's productive capacity divides."}
          </p>
          <div className="mt-6">
            <StackedBar
              caption="Productive capacity by category"
              total={Math.max(r.productiveCapacity, r.workloadHours)}
              data={[
                { key: "exec", label: "Execution", value: r.executionHours, display: formatHours(r.executionHours), tone: "signal" },
                { key: "meas", label: "Measurement", value: r.measurementHours, display: formatHours(r.measurementHours), tone: "ink" },
                { key: "strat", label: "Strategy", value: r.strategyHours, display: formatHours(r.strategyHours), tone: "ink" },
                { key: "admin", label: "Administration", value: r.administrationHours, display: formatHours(r.administrationHours), tone: "muted" },
                ...(r.capacityGap > 0 ? [{ key: "gap", label: "Unused capacity", value: r.capacityGap, display: formatHours(r.capacityGap), tone: "muted" as const }] : []),
              ]}
            />
          </div>
        </div>
      </section>

      {/* The score, explained rather than asserted. */}
      <section aria-labelledby="score-title" className="rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-inset ring-line sm:p-8">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div className="lg:w-56">
            <h3 id="score-title" className="text-[1.35rem] tracking-[-0.025em] text-ink">Trafficomm Operational Efficiency Score</h3>
            <div className="mt-6">
              <ScoreDial score={r.efficiencyScore}>
                <span className="block text-[2.8rem] font-medium tabular-nums leading-none tracking-[-0.04em] text-ink">
                  <CountUp value={r.efficiencyScore} format={(n) => String(Math.round(n))} />
                </span>
                <span className="mt-1 block font-mono text-[0.68rem] uppercase tracking-[0.12em] text-steel">out of 100</span>
              </ScoreDial>
            </div>
          </div>
          <div>
            <p className="text-[0.98rem] leading-relaxed text-steel">
              The sum of five weighted components, from the inputs you gave. It describes how this operation runs — a low automation score on a team with
              strong standards means something different from the reverse.
            </p>
            <Explain label="What does this score mean?">
              Trafficomm&rsquo;s own diagnostic, scored out of 100 from the operational inputs on the previous step. It is <strong className="font-medium text-ink">not</strong>{" "}
              an industry percentile and not a comparison against other agencies — a 65 does not mean you are ahead of 65% of anyone. It is a way of seeing
              which parts of the operation are carrying the most manual effort.
            </Explain>
            <div className="mt-6">
              <ScoreBars caption="Operational efficiency score components" data={r.efficiencyBreakdown} />
            </div>
          </div>
        </div>
      </section>

      {/* Externalizable workload — stated as a measurement, with its derivation. */}
      <section aria-labelledby="external-title">
        <h3 id="external-title" className="text-[1.35rem] tracking-[-0.025em] text-ink">Externalizable workload</h3>
        <p className="mt-3 max-w-prose text-[1.02rem] leading-relaxed text-steel">
          Approximately <strong className="font-medium text-ink">{formatNumber(r.externalizableHours, 0)} hours per month</strong> of this workload — equivalent
          to about {formatNumber(r.externalizableFte, 1)} full-time productive capacities — is potentially suitable for external delivery. That is an
          assessment of the kind of work, not a recommendation: whether any of it should move is a decision about your operating model.
        </p>
        <Explain label={`What does ${formatNumber(r.externalizableFte, 1)} FTE mean here?`}>
          It means this workload is equivalent to roughly {formatNumber(r.externalizableFte, 1)} full-time productive capacities at your team&rsquo;s available
          operating hours. It does not mean {formatNumber(r.externalizableFte, 1)} roles are surplus, and it is not a suggestion to remove anyone — the same
          hours are usually spread thinly across several people rather than concentrated in a few.
        </Explain>
        <div className="mt-6">
          <BarRows
            caption="Externalizable hours per month by activity"
            unit="Externalizable hours per month"
            data={r.activities
              .slice()
              .sort((a, b) => b.externalizableHours - a.externalizableHours)
              .map((a) => ({
                key: a.id,
                label: `${a.label} · ${Math.round(a.externalizable * 100)}%`,
                value: a.externalizableHours,
                display: formatHours(a.externalizableHours),
                tone: a.externalizable >= 0.7 ? "signal" : "muted",
              }))}
          />
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-[0.86rem] leading-relaxed text-steel">
          <EstimatedTag>Model assumption</EstimatedTag>
          <span>The share per activity is a Trafficomm assumption, not an observation about your team.</span>
        </p>
      </section>

      <CapacityImpact {...ctx} />

      <Simulator ctx={ctx} />

      {/* Commercial bridge. No price is quoted, because no standardised delivery
          price exists in the model — stating one would be invention. */}
      <DeliveryEstimate {...ctx} />

      {/* Hidden on screen; the only thing that prints. */}
      <div className="labs-report-host">
        <Report {...ctx} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={() => {
            trackEvent("report_downloaded", context());
            // The browser's print dialog offers "Save as PDF" on every modern
            // platform; see the print stylesheet in globals.css for why that is
            // preferred to bundling a generator. The class scopes the isolation
            // to this action, and is removed however the dialog is dismissed.
            const body = document.body;
            const clear = () => body.classList.remove("labs-printing");
            body.classList.add("labs-printing");
            window.addEventListener("afterprint", clear, { once: true });
            // Safari does not always fire afterprint; this is the safety net.
            window.setTimeout(clear, 60_000);
            window.print();
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-[0.95rem] font-medium text-white outline-offset-4 transition-colors duration-200 hover:bg-graphite motion-reduce:transition-none"
        >
          Download my analysis
          <span aria-hidden="true">↓</span>
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "goto", step: "operations" })}
          className="min-h-11 text-[0.95rem] text-steel underline decoration-line-strong underline-offset-4 outline-offset-4 hover:text-ink"
        >
          Adjust my inputs
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "reset" })}
          className="min-h-11 text-[0.95rem] text-steel underline decoration-line-strong underline-offset-4 outline-offset-4 hover:text-ink"
        >
          Start again
        </button>
      </div>
    </div>
  );
}

/** "2026-10-05" reads as a date, not a key. */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function Simulator({ ctx }: { ctx: Ctx }) {
  const { state, dispatch, result: base, scenario, trackEvent, context } = ctx;
  const [touched, setTouched] = useState(false);
  const s = state.scenario;

  const report = (control: string) => {
    if (!touched) setTouched(true);
    trackEvent("scenario_changed", { ...context(), scenario_control: control });
  };

  return (
    <section aria-labelledby="sim-title" className="rounded-[var(--radius-panel)] bg-paper-2 p-6 ring-1 ring-inset ring-line sm:p-8">
      <h3 id="sim-title" className="text-[1.35rem] tracking-[-0.025em] text-ink">Explore your operating model</h3>
      <p className="mt-2 max-w-prose text-[0.98rem] leading-relaxed text-steel">
        What could happen to internal capacity if the operating model changed? These show how hours and capacity move — not a saving, because the model holds
        no delivery price, and not a headcount decision.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div className="grid gap-8 content-start">
          <Slider
            id="sim-automation"
            label="If reporting were more automated"
            min={0}
            max={100}
            value={Math.round(s.reportingAutomation * 100)}
            valueLabel={s.reportingAutomation === 0 ? "As today" : `${Math.round(s.reportingAutomation * 100)}% automated`}
            minLabel="Manual"
            maxLabel="Automated"
            onChange={(v) => {
              dispatch({ type: "setScenario", patch: { reportingAutomation: v / 100 } });
              report("reporting_automation");
            }}
          />
          <p className="-mt-4 text-[0.84rem] leading-relaxed text-steel">
            Caps at {Math.round(MAX_REPORTING_REDUCTION * 100)}% of reporting and extraction hours. Assembly automates; deciding what the numbers mean does not.
          </p>
          <p className="-mt-2 text-[0.84rem] leading-relaxed text-steel">
            The external execution allocation lever sits with the capacity comparison above, where its effect is visible. Both levers feed the same model, so
            the figures here reflect whatever it is set to.
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 lg:content-start">
          <Delta label="Internal workload" value={scenario.internalHours} base={base.workloadHours} format={formatHours} />
          <Delta label="Internal utilization" value={scenario.internalUtilization} base={base.utilization} format={(n) => formatPercent(n)} />
          <Delta
            label="Internal FTE required"
            value={scenario.internalFteRequirement}
            base={base.workloadHours / (base.productiveHoursPerFte || 1)}
            format={(n) => formatNumber(n, 1)}
          />
          {/* The only metric here where up is the improvement. */}
          <Delta label="Capacity released" value={Math.max(0, scenario.capacityReleased)} base={0} format={formatHours} higherIsBetter />
        </dl>
      </div>
    </section>
  );
}

/**
 * A scenario metric against its base.
 *
 * Compares the numbers rather than their formatted strings — the formatters use
 * a non-breaking space, so a literal comparison silently never matched. The
 * arrow reflects the actual direction of travel, and `higherIsBetter` decides
 * which direction counts as an improvement: released capacity going up is good,
 * everything else here going down is.
 */
function Delta({
  label,
  value,
  base,
  format,
  higherIsBetter = false,
}: {
  label: string;
  value: number;
  base: number;
  format: (n: number) => string;
  higherIsBetter?: boolean;
}) {
  // A tolerance, not equality: these are floats, and a sub-unit move is not a change worth announcing.
  const changed = Math.abs(value - base) > 0.005;
  const up = value > base;
  const improved = higherIsBetter ? up : !up;
  return (
    <div className="rounded-[var(--radius-card)] bg-white px-5 py-4 ring-1 ring-inset ring-line">
      <p className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-steel">{label}</p>
      <p className="mt-2 text-[1.45rem] tabular-nums tracking-[-0.025em] text-ink">{format(value)}</p>
      <p className="mt-1 font-mono text-[0.68rem] tabular-nums text-steel">
        {changed ? (
          <>
            <span aria-hidden="true" className={improved ? "text-signal-ink" : "text-steel"}>
              {up ? "↑" : "↓"}
            </span>{" "}
            <span className="sr-only">{up ? "up" : "down"} </span>from {format(base)}
          </>
        ) : (
          "unchanged"
        )}
      </p>
    </div>
  );
}

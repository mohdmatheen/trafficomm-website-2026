"use client";

import { formatHours, formatMoney, formatNumber, formatPercent, formatUsd } from "@/lib/labs/currency";
import { METHODOLOGY_VERSION } from "@/lib/labs/engine";
import type { useLabsCalculator } from "@/lib/labs/state";

type Ctx = ReturnType<typeof useLabsCalculator>;

/**
 * The downloadable analysis.
 *
 * Rendered as a print document rather than generated with a PDF library. A
 * client-side generator (jsPDF plus html2canvas, or pdfmake) would add several
 * hundred kilobytes to a page whose whole proposition is that it is fast, and it
 * would produce a rasterised or re-typeset approximation of what the browser can
 * already lay out natively. Printing to PDF keeps the type vector and selectable,
 * honours the reader's page size, costs nothing in bundle, and works offline.
 * Every modern browser and OS offers "Save as PDF" from the print dialog.
 *
 * This block is hidden on screen and is the only thing that prints. It contains
 * no internal lead score and no qualification field — it is a document the
 * reader could put in front of their own board.
 */
/** Declared outside Report so it is not recreated on every render. */
function Table({ title, data }: { title: string; data: [string, string][] }) {
  return (
    <section className="report-block">
      <h2>{title}</h2>
      <table>
        <tbody>
          {data.map(([k, v]) => (
            <tr key={k}>
              <th scope="row">{k}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function Report({ state, result: r, market, fx }: Ctx) {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const money = (n: number) => `${formatMoney(n, market.currency)}  ${formatUsd(n, fx.rate)}`;

  const rows: [string, string][] = [
    ["Team", `${formatNumber(r.headcount, 0)} people`],
    ["Active clients / accounts", formatNumber(state.input.activeClients, 0)],
    ["Campaigns per month", formatNumber(state.input.campaignsPerMonth, 0)],
    ["Markets managed", formatNumber(state.input.marketsManaged, 0)],
    ["Platforms in use", String(state.platforms.length)],
  ];

  const workload: [string, string][] = [
    ["Productive capacity", formatHours(r.productiveCapacity)],
    ["Operational workload", formatHours(r.workloadHours)],
    ["Team utilization", formatPercent(r.utilization)],
    ["Execution hours", formatHours(r.executionHours)],
    ["Measurement hours", formatHours(r.measurementHours)],
    ["Strategy hours", formatHours(r.strategyHours)],
    ["Administration hours", formatHours(r.administrationHours)],
  ];

  const cost: [string, string][] = [
    ["Monthly team cost (fully loaded)", money(r.loadedMonthlyCost)],
    ["Annual team cost", money(r.annualLoadedCost)],
    ["Effective hourly cost", money(r.effectiveHourlyCost)],
    ["Execution cost per month", money(r.executionCost)],
    ["Cost per campaign", money(r.costPerCampaign)],
  ];

  const external: [string, string][] = [
    ["Externalizable workload", formatHours(r.externalizableHours)],
    ["Equivalent capacity", `${formatNumber(r.externalizableFte, 1)} FTE`],
    ["Internal cost of that workload", money(r.externalizableCost)],
  ];

  return (
    <div className="labs-report" aria-hidden="true">
      <header className="report-head">
        <div>
          <p className="report-brand">Trafficomm Labs</p>
          <h1>AdOps Capacity Analysis</h1>
        </div>
        <div className="report-meta">
          <p>{today}</p>
          <p>{market.label}</p>
        </div>
      </header>

      <section className="report-block report-headline">
        <div>
          <p className="report-label">Team utilization</p>
          <p className="report-figure">{formatPercent(r.utilization)}</p>
        </div>
        <div>
          <p className="report-label">Monthly team cost</p>
          <p className="report-figure">{formatMoney(r.loadedMonthlyCost, market.currency)}</p>
          <p className="report-sub">{formatUsd(r.loadedMonthlyCost, fx.rate)}</p>
        </div>
        <div>
          <p className="report-label">Externalizable workload</p>
          <p className="report-figure">{formatNumber(r.externalizableHours, 0)} hrs</p>
          <p className="report-sub">per month · {formatNumber(r.externalizableFte, 1)} FTE</p>
        </div>
        <div>
          <p className="report-label">Operational efficiency</p>
          <p className="report-figure">{r.efficiencyScore} / 100</p>
        </div>
      </section>

      <Table title="The operation" data={rows} />
      <Table title="Workload and capacity" data={workload} />
      <Table title="Cost of execution" data={cost} />
      <Table title="Externalizable workload" data={external} />

      <section className="report-block">
        <h2>Capacity allocation</h2>
        <table>
          <tbody>
            {[
              ["Execution", r.executionHours],
              ["Measurement", r.measurementHours],
              ["Strategy", r.strategyHours],
              ["Administration", r.administrationHours],
              ["Unused capacity", r.capacityGap],
            ].map(([label, hours]) => (
              <tr key={String(label)}>
                <th scope="row">{label as string}</th>
                <td>
                  {formatHours(hours as number)} ·{" "}
                  {formatPercent((hours as number) / Math.max(r.productiveCapacity, r.workloadHours))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="report-block">
        <h2>Operational efficiency score</h2>
        <table>
          <tbody>
            {r.efficiencyBreakdown.map((b) => (
              <tr key={b.key}>
                <th scope="row">{b.label}</th>
                <td>
                  {formatNumber(b.score, 1)} / {b.max}
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row">Total</th>
              <td>{r.efficiencyScore} / 100</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="report-block report-note">
        <h2>Methodology and assumptions</h2>
        <p>
          Calculated with the Trafficomm AdOps Capacity engine, methodology v{METHODOLOGY_VERSION}. Capacity assumes{" "}
          {state.input.operating.hoursPerWeek} hours per week over {state.input.operating.weeksPerMonth} weeks, of which{" "}
          {Math.round(state.input.operating.productiveAvailability * 100)}% is treated as productive operating time. Team cost includes an employer overhead of{" "}
          {Math.round(state.input.operating.employerOverhead * 100)}% for benefits, recruitment, equipment and administration.
        </p>
        <p>
          Salary figures are{" "}
          {state.salaryMode === "custom"
            ? "the costs you supplied."
            : "Trafficomm market assumptions for this market, not published national averages."}{" "}
          Workload hours were{" "}
          {state.workloadMode === "detailed"
            ? "entered directly."
            : "estimated from your business inputs and are an estimate rather than a measurement."}{" "}
          The externalizable share of each activity is a Trafficomm model assumption, not an observation about your team.
        </p>
        <p>
          Amounts are shown in {market.currency} with a USD equivalent at 1 {market.currency} = {fx.rate} USD
          {fx.source === "fallback" ? ` (reference rate, ${fx.asOf}).` : ` (rate updated ${fx.asOf}).`} This analysis describes workload and cost. It does not
          contain a Trafficomm delivery price and is not a quotation.
        </p>
      </section>

      <footer className="report-foot">
        <p>
          <strong>Trafficomm</strong> has run campaign execution behind agencies since 2015 — setup, trafficking, QA, pacing checks, optimisation support,
          reporting and measurement. To see what delivery could look like for this workload, request an estimate at trafficomm.com.
        </p>
      </footer>
    </div>
  );
}

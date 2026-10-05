/**
 * AdOps Capacity calculation engine.
 *
 * A direct transcription of the workbook's Engine sheet. Each field carries the
 * cell it comes from so the two can be diffed. Nothing is rounded except where
 * the workbook rounds (Engine!B25); presentation rounding happens in the UI.
 *
 * METHODOLOGY v1.1 — two authorised departures from the workbook.
 *
 * Phase 1 reproduced the workbook exactly, including two defects. Both were
 * reviewed and their correction signed off; everything else remains a faithful
 * transcription.
 *
 *   1. Complexity index (Engine!B24). The first term was
 *      COUNTIF(Inputs!B4:B4,"<>"), a count of non-empty cells in a single-cell
 *      range — always 1, regardless of any input. What it was meant to measure
 *      cannot be established from the workbook: B4 holds Business Type, which is
 *      a category rather than a magnitude, and nothing else in the sheet suggests
 *      a scale it belonged to. Rather than invent a replacement dimension, the
 *      term is removed and the remaining dimensions carry the average. This
 *      raises the index, because a constant 1 was dragging it down.
 *
 *   2. Lead score (Engine!D4:E14). "3+ markets" was scored twice, at E8 and
 *      again at E12 under the label "Multi-market scale". The duplicate is
 *      removed so one condition earns points once. Classification thresholds are
 *      unchanged.
 *
 * Still reproduced as-is, and still worth noting: Engine!B24 carries a hardcoded
 * 4 as its final term. It is a constant, not a measured dimension, but changing
 * it was not part of this correction.
 */

/** Stamped onto every lead submission so a figure can be traced to the model that produced it. */
export const METHODOLOGY_VERSION = "1.1";
import {
  ACTIVITIES,
  EFFICIENCY_INPUTS,
  MARKETS,
  ROLES,
  type ActivityCategory,
  type ActivityId,
  type CalculatorInput,
} from "./model";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
/** Excel's IFERROR(x/0, 0) behaviour. */
const safeDiv = (a: number, b: number) => (b === 0 || !Number.isFinite(b) ? 0 : a / b);
const mean = (xs: number[]) => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length);

export type ActivityResult = {
  id: ActivityId;
  label: string;
  category: ActivityCategory;
  hoursPerWeek: number;
  /** Inputs!E21:E30 — hours/week x weeks/month. */
  hoursPerMonth: number;
  externalizable: number;
  /** hoursPerMonth x externalizable — the activity's contribution to Engine!B21. */
  externalizableHours: number;
};

export type EfficiencyBreakdown = {
  /** Dashboard!D8:E12 — the five components and their maximums. */
  key: "automation" | "standardization" | "reporting" | "governance" | "strategicCapacity";
  label: string;
  score: number;
  max: number;
};

export type CalculatorResult = {
  headcount: number;                    // Engine!B4
  baseMonthlyCost: number;              // Engine!B5
  loadedMonthlyCost: number;            // Engine!B6
  annualLoadedCost: number;             // Engine!B7
  grossHoursPerFte: number;             // Engine!B8
  productiveHoursPerFte: number;        // Engine!B9
  productiveCapacity: number;           // Engine!B10
  effectiveHourlyCost: number;          // Engine!B11
  workloadHours: number;                // Engine!B12
  utilization: number;                  // Engine!B13
  executionHours: number;               // Engine!B14
  measurementHours: number;             // Engine!B15
  strategyHours: number;                // Engine!B16
  administrationHours: number;          // Engine!B17
  executionCost: number;                // Engine!B18
  executionFte: number;                 // Engine!B19
  costPerCampaign: number;              // Engine!B20
  externalizableHours: number;          // Engine!B21
  externalizableFte: number;            // Engine!B22
  externalizableCost: number;           // Engine!B23
  complexityIndex: number;              // Engine!B24
  efficiencyScore: number;              // Engine!B25 (rounded)
  efficiencyScoreRaw: number;           // Dashboard!E13 (unrounded)
  efficiencyBreakdown: EfficiencyBreakdown[];
  /** Dashboard!B12 — capacity not consumed by the stated workload. */
  capacityGap: number;
  activities: ActivityResult[];
};

export function calculate(input: CalculatorInput): CalculatorResult {
  const { operating: op } = input;

  // Engine!B8:B10 — capacity.
  const grossHoursPerFte = op.hoursPerWeek * op.weeksPerMonth;
  const productiveHoursPerFte = grossHoursPerFte * op.productiveAvailability;
  const headcount = ROLES.reduce((sum, r) => sum + (input.headcount[r.id] || 0), 0);
  const productiveCapacity = headcount * productiveHoursPerFte;

  // Engine!B5:B7 — cost.
  const baseMonthlyCost = ROLES.reduce((sum, r) => sum + (input.headcount[r.id] || 0) * (input.salaries[r.id] || 0), 0);
  const loadedMonthlyCost = baseMonthlyCost * (1 + op.employerOverhead);
  const annualLoadedCost = loadedMonthlyCost * 12;
  const effectiveHourlyCost = safeDiv(loadedMonthlyCost, productiveCapacity);

  // Inputs!E21:E30 — workload, per activity.
  const activities: ActivityResult[] = ACTIVITIES.map((a) => {
    const hoursPerWeek = input.hoursPerWeek[a.id] ?? a.defaultHoursPerWeek;
    const hoursPerMonth = hoursPerWeek * op.weeksPerMonth;
    return {
      id: a.id,
      label: a.label,
      category: a.category,
      hoursPerWeek,
      hoursPerMonth,
      externalizable: a.externalizable,
      externalizableHours: hoursPerMonth * a.externalizable,
    };
  });

  const byCategory = (c: ActivityCategory) => activities.filter((a) => a.category === c).reduce((s, a) => s + a.hoursPerMonth, 0);

  const workloadHours = activities.reduce((s, a) => s + a.hoursPerMonth, 0);     // Engine!B12
  const executionHours = byCategory("Execution");                                // Engine!B14
  const measurementHours = byCategory("Measurement");                            // Engine!B15
  const strategyHours = byCategory("Strategy");                                  // Engine!B16
  const administrationHours = byCategory("Administration");                      // Engine!B17

  const utilization = safeDiv(workloadHours, productiveCapacity);                // Engine!B13
  const executionCost = executionHours * effectiveHourlyCost;                    // Engine!B18
  const executionFte = safeDiv(executionHours, productiveHoursPerFte);           // Engine!B19
  const costPerCampaign = safeDiv(executionCost, input.campaignsPerMonth);       // Engine!B20

  const externalizableHours = activities.reduce((s, a) => s + a.externalizableHours, 0); // Engine!B21
  const externalizableFte = safeDiv(externalizableHours, productiveHoursPerFte);         // Engine!B22
  const externalizableCost = externalizableHours * effectiveHourlyCost;                  // Engine!B23

  // Engine!B24, v1.1: the always-1 COUNTIF term is gone and the remaining
  // dimensions carry the average. See the file header for why it is not replaced.
  const complexityIndex = mean([
    clamp(input.marketsManaged, 1, 5),
    clamp(op.avgCreativesPerCampaign / 4, 1, 5),
    op.reportingComplexity,
    4,
  ]);

  // Engine!B25 / Dashboard!E8:E13.
  const e = input.efficiency;
  const pick = (c: EfficiencyBreakdown["key"]) =>
    EFFICIENCY_INPUTS.filter((x) => x.component === c).map((x) => e[x.id]);

  const automation = (mean(pick("automation")) / 5) * 25;
  const standardization = (mean(pick("standardization")) / 5) * 20;
  const reporting = (e.dashboardEfficiency / 5) * 20;
  const governance = (mean(pick("governance")) / 5) * 20;
  const strategicCapacity = (Math.min(1, safeDiv(strategyHours, productiveCapacity)) / 0.25) * 15;

  const efficiencyBreakdown: EfficiencyBreakdown[] = [
    { key: "automation", label: "Automation", score: automation, max: 25 },
    { key: "standardization", label: "Standardization", score: standardization, max: 20 },
    { key: "reporting", label: "Reporting", score: reporting, max: 20 },
    { key: "governance", label: "QA & governance", score: governance, max: 20 },
    // Dashboard!E12 caps this component at 15; Engine!B25 relies on the MIN(1,…) above.
    { key: "strategicCapacity", label: "Strategic capacity", score: Math.min(15, strategicCapacity), max: 15 },
  ];

  const efficiencyScoreRaw = automation + standardization + reporting + governance + Math.min(15, strategicCapacity);

  return {
    headcount,
    baseMonthlyCost,
    loadedMonthlyCost,
    annualLoadedCost,
    grossHoursPerFte,
    productiveHoursPerFte,
    productiveCapacity,
    effectiveHourlyCost,
    workloadHours,
    utilization,
    executionHours,
    measurementHours,
    strategyHours,
    administrationHours,
    executionCost,
    executionFte,
    costPerCampaign,
    externalizableHours,
    externalizableFte,
    externalizableCost,
    complexityIndex,
    efficiencyScore: Math.round(efficiencyScoreRaw),
    efficiencyScoreRaw,
    efficiencyBreakdown,
    capacityGap: Math.max(0, productiveCapacity - workloadHours),
    activities,
  };
}

/**
 * Engine!D4:E14. Internal routing signal for an intentional enquiry only — it is
 * never shown to the user, never rendered in the report, and never sent to
 * analytics. v1.1 removes the workbook's duplicate "3+ markets" scoring; the
 * classification thresholds are unchanged, so a prospect's band can only move if
 * the duplicate was what pushed them over one.
 */
export function leadScore(input: CalculatorInput, r: CalculatorResult) {
  const marketName = MARKETS[input.market].name;
  const gcc = ["Saudi Arabia", "UAE", "Qatar", "Kuwait", "Bahrain", "Oman"].includes(marketName);
  const parts = [
    { key: "agencyFit", points: input.businessType === "Agency" ? 15 : 5 },
    { key: "gccMarket", points: gcc ? 10 : 0 },
    { key: "campaignVolume", points: input.campaignsPerMonth >= 100 ? 10 : input.campaignsPerMonth >= 50 ? 5 : 0 },
    { key: "teamSize", points: r.headcount >= 5 ? 10 : 0 },
    { key: "markets", points: input.marketsManaged >= 3 ? 5 : 0 },
    { key: "manualReporting", points: input.efficiency.reportingAutomation <= 2 ? 10 : 0 },
    { key: "manualSetup", points: input.efficiency.setupAutomation <= 2 ? 10 : 0 },
    { key: "executionShare", points: safeDiv(r.executionHours, r.productiveCapacity) >= 0.5 ? 10 : 0 },
    // Engine!E12 duplicated the "markets" condition above. Removed in v1.1.
  ];
  const total = parts.reduce((s, p) => s + p.points, 0);
  const classification = total >= 70 ? "Priority" : total >= 50 ? "High" : total >= 30 ? "Medium" : "Low";
  return { parts, total, classification } as const;
}

import { expect, test } from "@playwright/test";
import { calculate, leadScore } from "../lib/labs/engine";
import { buildLabsLeadEmail, sanitizeLabsContext, type LabsLeadRecord } from "../lib/labs/lead";
import { MARKETS, defaultInput } from "../lib/labs/model";

/**
 * Calculation fixtures.
 *
 * The expected values are the workbook's own cached results for the scenario the
 * Inputs sheet ships with (Saudi Arabia, 8 headcount, 150 campaigns). Each
 * assertion names the cell it mirrors, so a future change to either side is
 * traceable. Full float precision is asserted deliberately — a rounding drift
 * here would be a real defect, not a cosmetic one.
 *
 * The workbook's "Stress Tests" sheet is NOT used as a fixture: those rows are
 * hardcoded illustrative scenarios, not engine output, and do not reconcile with
 * the Engine formulas for the same inputs.
 */
const near = (actual: number, expected: number, eps = 1e-9) => expect(Math.abs(actual - expected)).toBeLessThan(eps);

test.describe("AdOps capacity engine — workbook parity (Saudi default scenario)", () => {
  const r = calculate(defaultInput("SA"));

  test("capacity block (Engine!B4, B8:B10)", () => {
    expect(r.headcount).toBe(8);
    near(r.grossHoursPerFte, 173.2);
    near(r.productiveHoursPerFte, 147.22);
    near(r.productiveCapacity, 1177.76);
  });

  test("cost block (Engine!B5:B7, B11)", () => {
    near(r.baseMonthlyCost, 94000);
    near(r.loadedMonthlyCost, 112800);
    near(r.annualLoadedCost, 1353600);
    near(r.effectiveHourlyCost, 95.775030566499112);
  });

  test("workload split (Engine!B12:B17)", () => {
    near(r.workloadHours, 1169.0999999999999);
    near(r.utilization, 0.99264705882352933);
    near(r.executionHours, 801.05);
    near(r.measurementHours, 43.3);
    near(r.strategyHours, 194.85);
    near(r.administrationHours, 129.9);
  });

  test("execution economics (Engine!B18:B20)", () => {
    near(r.executionCost, 76720.588235294112);
    near(r.executionFte, 5.4411764705882346);
    near(r.costPerCampaign, 511.47058823529409);
  });

  test("externalizable workload (Engine!B21:B23)", () => {
    near(r.externalizableHours, 725.27500000000009);
    near(r.externalizableFte, 4.9264705882352944);
    near(r.externalizableCost, 69463.23529411765);
  });

  test("complexity and efficiency (Engine!B24:B25, Dashboard!E8:E13)", () => {
    // v1.1: 3.2 under the workbook, which averaged in an always-1 COUNTIF term.
    near(r.complexityIndex, 3.75);
    expect(r.efficiencyScore).toBe(65);
    near(r.efficiencyScoreRaw, 65.17647058823529);
    const by = Object.fromEntries(r.efficiencyBreakdown.map((b) => [b.key, b.score]));
    near(by.automation, 11.25);
    near(by.standardization, 16);
    near(by.reporting, 12);
    near(by.governance, 16);
    near(by.strategicCapacity, 9.9264705882352935);
  });

  test("capacity gap (Dashboard!B12)", () => {
    near(r.capacityGap, 8.6600000000000819, 1e-8);
  });

  test("USD conversions (Engine!C5:C20 at the workbook's snapshot rate)", () => {
    const fx = MARKETS.SA.fallbackUsdRate;
    near(r.baseMonthlyCost * fx, 25059.46, 1e-6);
    near(r.loadedMonthlyCost * fx, 30071.351999999999, 1e-6);
    near(r.annualLoadedCost * fx, 360856.22399999999, 1e-6);
    near(r.effectiveHourlyCost * fx, 25.532665398722997);
    near(r.executionCost * fx, 20452.941617647055, 1e-8);
    near(r.costPerCampaign * fx, 136.35294411764704);
  });

  test("lead score (Engine!D4:E14)", () => {
    // v1.1: 85 under the workbook, which scored "3+ markets" twice.
    const s = leadScore(defaultInput("SA"), r);
    expect(s.total).toBe(80);
    expect(s.classification).toBe("Priority");
    expect(s.parts.filter((p) => p.key === "markets")).toHaveLength(1);
    expect(s.parts.map((p) => p.key)).not.toContain("multiMarketScale");
  });
});

test.describe("UAE market branch", () => {
  test("uses the UAE salary dataset, not the Saudi one (Inputs!C13:C16)", () => {
    expect(MARKETS.AE.salaries).toEqual({ manager: 32500, senior: 24000, specialist: 21000, analytics: 22000 });
    expect(MARKETS.SA.salaries).toEqual({ manager: 18000, senior: 14000, specialist: 10000, analytics: 8000 });
    expect(MARKETS.AE.currency).toBe("AED");
    expect(MARKETS.SA.currency).toBe("SAR");
  });

  test("cost follows the UAE dataset at the same headcount", () => {
    const r = calculate(defaultInput("AE"));
    // 1x32,500 + 2x24,000 + 4x21,000 + 1x22,000, then the 20% employer overhead.
    near(r.baseMonthlyCost, 186500);
    near(r.loadedMonthlyCost, 223800);
    // Hours are market-independent, so capacity and workload must not move.
    near(r.productiveCapacity, 1177.76);
    near(r.workloadHours, 1169.0999999999999);
  });

  test("FX snapshots match the workbook (Inputs!E33)", () => {
    expect(MARKETS.SA.fallbackUsdRate).toBe(0.26659);
    expect(MARKETS.AE.fallbackUsdRate).toBe(0.272257);
  });
});

test.describe("edge cases", () => {
  test("an empty team divides safely rather than producing Infinity", () => {
    const i = defaultInput("SA");
    i.headcount = { manager: 0, senior: 0, specialist: 0, analytics: 0, other: 0 };
    const r = calculate(i);
    expect(r.productiveCapacity).toBe(0);
    expect(r.effectiveHourlyCost).toBe(0);
    expect(r.utilization).toBe(0);
    expect(r.executionCost).toBe(0);
    expect(Number.isFinite(r.efficiencyScore)).toBe(true);
  });

  test("zero campaigns does not break cost per campaign", () => {
    const i = defaultInput("SA");
    i.campaignsPerMonth = 0;
    expect(calculate(i).costPerCampaign).toBe(0);
  });

  test("a large agency stays finite and proportionate", () => {
    const i = defaultInput("AE");
    i.headcount = { manager: 6, senior: 18, specialist: 40, analytics: 10, other: 4 };
    i.campaignsPerMonth = 900;
    const r = calculate(i);
    expect(r.headcount).toBe(78);
    near(r.productiveCapacity, 78 * 147.22);
    expect(r.utilization).toBeGreaterThan(0);
    expect(r.utilization).toBeLessThan(1);
    expect(Number.isFinite(r.costPerCampaign)).toBe(true);
  });

  test("a one-person team can exceed capacity (utilization > 1)", () => {
    const i = defaultInput("SA");
    i.headcount = { manager: 1, senior: 0, specialist: 0, analytics: 0, other: 0 };
    const r = calculate(i);
    expect(r.utilization).toBeGreaterThan(1);
  });

  test("externalizable hours never exceed total workload", () => {
    const r = calculate(defaultInput("SA"));
    expect(r.externalizableHours).toBeLessThan(r.workloadHours);
  });
});

import { ESTIMATOR_BASELINE, defaultDrivers, estimateHoursPerWeek } from "../lib/labs/estimator";
import { BASE_SCENARIO, MAX_REPORTING_REDUCTION, applyScenario } from "../lib/labs/scenario";
import { ACTIVITIES } from "../lib/labs/model";

test.describe("quick-estimate workload model", () => {
  test("passes exactly through the workbook's default scenario", () => {
    const estimated = estimateHoursPerWeek(defaultDrivers());
    for (const a of ACTIVITIES) expect(estimated[a.id]).toBe(a.defaultHoursPerWeek);
  });

  test("an estimate at baseline drives the engine to the workbook's own results", () => {
    const i = defaultInput("SA");
    i.hoursPerWeek = estimateHoursPerWeek(defaultDrivers());
    const r = calculate(i);
    near(r.workloadHours, 1169.0999999999999);
    near(r.executionHours, 801.05);
    near(r.externalizableHours, 725.27500000000009);
  });

  test("scales sub-linearly with campaign volume", () => {
    const base = estimateHoursPerWeek(defaultDrivers());
    const double = estimateHoursPerWeek({ ...defaultDrivers(), campaignsPerMonth: ESTIMATOR_BASELINE.campaignsPerMonth * 2 });
    expect(double.setup).toBeGreaterThan(base.setup);
    expect(double.setup).toBeLessThan(base.setup * 2);
  });

  test("a near-empty operation produces small positive hours, not zero or NaN", () => {
    const e = estimateHoursPerWeek({ ...defaultDrivers(), campaignsPerMonth: 1, activeClients: 1, platforms: 1, marketsManaged: 1 });
    for (const a of ACTIVITIES) {
      expect(Number.isFinite(e[a.id])).toBe(true);
      expect(e[a.id]).toBeGreaterThanOrEqual(0);
      expect(e[a.id]).toBeLessThan(a.defaultHoursPerWeek);
    }
  });

  test("a very large operation stays finite", () => {
    const e = estimateHoursPerWeek({ campaignsPerMonth: 5000, activeClients: 400, marketsManaged: 12, creativesPerCampaign: 40, platforms: 11, reportingFrequency: 5, optimizationCadence: 5 });
    for (const a of ACTIVITIES) expect(Number.isFinite(e[a.id])).toBe(true);
  });
});

test.describe("scenario simulator", () => {
  const input = defaultInput("SA");
  const base = calculate(input);

  test("the base scenario is the base result", () => {
    const s = applyScenario(input, BASE_SCENARIO);
    near(s.result.workloadHours, base.workloadHours);
    expect(s.externallyDeliveredHours).toBe(0);
    near(s.internalHours, base.workloadHours);
  });

  test("full automation reduces reporting and extraction by the stated ceiling only", () => {
    const s = applyScenario(input, { ...BASE_SCENARIO, reportingAutomation: 1 });
    const reporting = s.result.activities.find((a) => a.id === "reporting")!;
    const baseReporting = base.activities.find((a) => a.id === "reporting")!;
    near(reporting.hoursPerMonth, baseReporting.hoursPerMonth * (1 - MAX_REPORTING_REDUCTION), 1e-9);
    // Activities outside the automatable set are untouched.
    const setup = s.result.activities.find((a) => a.id === "setup")!;
    near(setup.hoursPerMonth, base.activities.find((a) => a.id === "setup")!.hoursPerMonth);
  });

  test("external allocation moves hours out without changing total workload", () => {
    const s = applyScenario(input, { ...BASE_SCENARIO, externalAllocation: 0.6 });
    near(s.result.workloadHours, base.workloadHours);
    near(s.externallyDeliveredHours, base.externalizableHours * 0.6);
    near(s.internalHours, base.workloadHours - base.externalizableHours * 0.6);
    expect(s.internalUtilization).toBeLessThan(base.utilization);
    expect(s.internalFteRequirement).toBeLessThan(base.workloadHours / base.productiveHoursPerFte);
  });

  test("the two levers compose", () => {
    const s = applyScenario(input, { reportingAutomation: 1, externalAllocation: 0.5 });
    expect(s.result.workloadHours).toBeLessThan(base.workloadHours);
    expect(s.internalHours).toBeLessThan(s.result.workloadHours);
    expect(s.capacityReleased).toBeGreaterThan(0);
  });

  test("internal hours never go negative at full allocation", () => {
    const s = applyScenario(input, { reportingAutomation: 1, externalAllocation: 1 });
    expect(s.internalHours).toBeGreaterThan(0);
    expect(s.internalUtilization).toBeGreaterThan(0);
  });

  test("out-of-range lever values are clamped rather than trusted", () => {
    const low = applyScenario(input, { reportingAutomation: -5, externalAllocation: -5 });
    const high = applyScenario(input, { reportingAutomation: 99, externalAllocation: 99 });
    near(low.internalHours, base.workloadHours);
    near(high.internalHours, applyScenario(input, { reportingAutomation: 1, externalAllocation: 1 }).internalHours);
  });
});


import { METHODOLOGY_VERSION } from "../lib/labs/engine";

test.describe("methodology v1.1 — scope of the correction", () => {
  test("is stamped so a figure can be traced to the model that produced it", () => {
    expect(METHODOLOGY_VERSION).toBe("1.1");
  });

  test("no financial or capacity metric moved", () => {
    // The two corrections touch the complexity index and the internal lead score
    // only. Everything a visitor actually sees must still match the workbook, so
    // these are asserted against the same cached values as before.
    for (const market of ["SA", "AE"] as const) {
      const r = calculate(defaultInput(market));
      near(r.productiveCapacity, 1177.76);
      near(r.workloadHours, 1169.0999999999999);
      near(r.utilization, 0.99264705882352933);
      near(r.executionHours, 801.05);
      near(r.externalizableHours, 725.27500000000009);
      near(r.externalizableFte, 4.9264705882352944);
      expect(r.efficiencyScore).toBe(65);
    }
    const sa = calculate(defaultInput("SA"));
    near(sa.loadedMonthlyCost, 112800);
    near(sa.executionCost, 76720.588235294112);
    near(sa.costPerCampaign, 511.47058823529409);
    const ae = calculate(defaultInput("AE"));
    near(ae.loadedMonthlyCost, 223800);
  });

  test("complexity index responds to its inputs instead of being anchored by a constant 1", () => {
    const lo = defaultInput("SA");
    lo.marketsManaged = 1;
    lo.operating = { ...lo.operating, avgCreativesPerCampaign: 4, reportingComplexity: 1 };
    const hi = defaultInput("SA");
    hi.marketsManaged = 5;
    hi.operating = { ...hi.operating, avgCreativesPerCampaign: 20, reportingComplexity: 5 };
    // Under the workbook both ends were compressed by the always-1 term; the
    // corrected index spans a usefully wider range.
    near(calculate(lo).complexityIndex, (1 + 1 + 1 + 4) / 4);
    near(calculate(hi).complexityIndex, (5 + 5 + 5 + 4) / 4);
    expect(calculate(hi).complexityIndex).toBeGreaterThan(calculate(lo).complexityIndex);
  });

  test("one condition cannot be scored twice", () => {
    const i = defaultInput("SA");
    i.marketsManaged = 3;
    const withMarkets = leadScore(i, calculate(i));
    i.marketsManaged = 2;
    const withoutMarkets = leadScore(i, calculate(i));
    // Exactly one 5-point step, not two.
    expect(withMarkets.total - withoutMarkets.total).toBe(5);
  });
});

/**
 * Lead email framing.
 *
 * A preview or local submission lands in the same inbox as a real one, so the
 * subject has to say which it is — /api/assessment already does this, and a test
 * lead mistaken for a prospect is an expensive kind of confusion.
 */
test.describe("labs lead email", () => {
  const record = (environment: LabsLeadRecord["environment"]): LabsLeadRecord => ({
    type: "labs_delivery_estimate",
    tool: "adops-capacity",
    name: "Test Person",
    company: "Meridian Media",
    email: "test@example.com",
    role: "",
    phone: "",
    submittedAt: "2026-10-05T00:00:00.000Z",
    environment,
    context: sanitizeLabsContext({ market: "Saudi Arabia", externalizableHours: 725 }),
  });

  test("non-production submissions are marked in the subject", () => {
    expect(buildLabsLeadEmail(record("preview")).subject).toMatch(/^\[preview\] Labs delivery estimate/);
    expect(buildLabsLeadEmail(record("development")).subject).toMatch(/^\[development\] Labs delivery estimate/);
  });

  test("production submissions carry no prefix", () => {
    expect(buildLabsLeadEmail(record("production")).subject).toMatch(/^Labs delivery estimate — Meridian Media/);
  });
});

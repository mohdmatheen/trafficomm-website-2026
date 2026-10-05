import { expect, test } from "@playwright/test";
import { calculate, leadScore } from "../lib/labs/engine";
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
    near(r.complexityIndex, 3.2);
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
    const s = leadScore(defaultInput("SA"), r);
    expect(s.total).toBe(85);
    expect(s.classification).toBe("Priority");
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

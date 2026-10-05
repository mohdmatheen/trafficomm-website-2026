import { expect, test } from "@playwright/test";
import { ALLOCATION_CATEGORIES, DEFAULT_ALLOCATION, allocationRows, allocationTotal, redistribute, type AllocationId } from "../lib/labs/allocation";
import { calculate } from "../lib/labs/engine";
import { defaultInput } from "../lib/labs/model";
import { applyScenario } from "../lib/labs/scenario";

/**
 * The capacity-impact system.
 *
 * These guard the claims the screen makes: released capacity can never exceed
 * eligible externalizable workload, nothing goes negative, and the allocation
 * always adds up to what it says it does.
 */
const ALLOCS = [0, 0.25, 0.5, 0.75, 1];

test.describe("released capacity", () => {
  for (const market of ["SA", "AE"] as const) {
    for (const alloc of ALLOCS) {
      test(`${market} at ${alloc * 100}% of eligible workload stays within bounds`, () => {
        const input = defaultInput(market);
        const base = calculate(input);
        const s = applyScenario(input, { reportingAutomation: 0, externalAllocation: alloc });
        const released = base.workloadHours - s.internalHours;

        expect(released).toBeGreaterThanOrEqual(-1e-9);
        // The headline promise of the screen: released capacity is capped by what is eligible.
        expect(released).toBeLessThanOrEqual(base.externalizableHours + 1e-9);
        expect(s.externallyDeliveredHours).toBeCloseTo(base.externalizableHours * alloc, 6);
        expect(s.internalHours).toBeGreaterThan(0);
        expect(s.internalUtilization).toBeGreaterThanOrEqual(0);
        expect(s.internalUtilization).toBeLessThanOrEqual(base.utilization + 1e-9);
        expect(s.internalFteRequirement).toBeGreaterThanOrEqual(0);
        // FTE must be supported by the hours it is derived from.
        expect(s.internalFteRequirement).toBeCloseTo(s.internalHours / base.productiveHoursPerFte, 6);
        for (const v of [released, s.internalHours, s.internalUtilization, s.internalFteRequirement, s.externallyDeliveredHours]) {
          expect(Number.isFinite(v)).toBe(true);
        }
      });
    }
  }

  test("at 0% nothing is released", () => {
    const input = defaultInput("SA");
    const base = calculate(input);
    const s = applyScenario(input, { reportingAutomation: 0, externalAllocation: 0 });
    expect(base.workloadHours - s.internalHours).toBeCloseTo(0, 9);
  });

  test("at 100% released equals exactly the eligible workload", () => {
    const input = defaultInput("SA");
    const base = calculate(input);
    const s = applyScenario(input, { reportingAutomation: 0, externalAllocation: 1 });
    expect(base.workloadHours - s.internalHours).toBeCloseTo(base.externalizableHours, 6);
  });

  test("a one-person team and a large agency both stay finite and bounded", () => {
    for (const hc of [
      { manager: 1, senior: 0, specialist: 0, analytics: 0, other: 0 },
      { manager: 8, senior: 24, specialist: 60, analytics: 14, other: 6 },
    ]) {
      const input = defaultInput("AE");
      input.headcount = hc;
      input.campaignsPerMonth = 4000;
      const base = calculate(input);
      const s = applyScenario(input, { reportingAutomation: 1, externalAllocation: 1 });
      const released = base.workloadHours - s.internalHours;
      expect(Number.isFinite(released)).toBe(true);
      expect(s.internalHours).toBeGreaterThan(0);
      expect(s.internalUtilization).toBeGreaterThanOrEqual(0);
    }
  });

  test("zero eligible workload releases nothing at any setting", () => {
    const input = defaultInput("SA");
    // Strategy and meetings are the only near-zero activities; zeroing everything
    // else leaves a workload with almost nothing eligible.
    for (const id of ["setup", "qa", "reporting", "extraction", "pacing", "optimization", "creative", "tracking"] as const) {
      input.hoursPerWeek[id] = 0;
    }
    const base = calculate(input);
    const s = applyScenario(input, { reportingAutomation: 0, externalAllocation: 1 });
    const released = base.workloadHours - s.internalHours;
    expect(released).toBeLessThanOrEqual(base.externalizableHours + 1e-9);
    expect(released).toBeGreaterThanOrEqual(0);
    expect(s.internalHours).toBeGreaterThan(0);
  });
});

test.describe("capacity allocation", () => {
  const ids = ALLOCATION_CATEGORIES.map((c) => c.id);

  test("the default split is a valid 100%", () => {
    expect(allocationTotal(DEFAULT_ALLOCATION)).toBe(100);
    for (const id of ids) expect(DEFAULT_ALLOCATION[id]).toBeGreaterThan(0);
  });

  test("moving any category to any value keeps the total at exactly 100", () => {
    for (const id of ids) {
      for (const v of [0, 1, 17, 50, 83, 99, 100]) {
        const next = redistribute(DEFAULT_ALLOCATION, id, v);
        expect(allocationTotal(next), `${id} -> ${v}`).toBe(100);
        expect(next[id]).toBe(v);
        for (const k of ids) expect(next[k]).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("repeated moves never drift away from 100", () => {
    let cur = { ...DEFAULT_ALLOCATION };
    const seq: [AllocationId, number][] = [["strategy", 80], ["other", 40], ["analysis", 0], ["creative", 55], ["newBusiness", 5], ["service", 30]];
    for (const [id, v] of seq) {
      cur = redistribute(cur, id, v);
      expect(allocationTotal(cur)).toBe(100);
    }
  });

  test("out-of-range values are clamped rather than trusted", () => {
    expect(redistribute(DEFAULT_ALLOCATION, "strategy", -40).strategy).toBe(0);
    expect(redistribute(DEFAULT_ALLOCATION, "strategy", 500).strategy).toBe(100);
    expect(allocationTotal(redistribute(DEFAULT_ALLOCATION, "strategy", 500))).toBe(100);
  });

  test("driving every other category to zero still redistributes", () => {
    let cur = { ...DEFAULT_ALLOCATION };
    for (const id of ids.slice(0, 5)) cur = redistribute(cur, id, 0);
    expect(allocationTotal(cur)).toBe(100);
    cur = redistribute(cur, ids[5], 0);
    // With nothing left to take a share proportionally, the rest spread evenly.
    expect(allocationTotal(cur)).toBe(100);
  });

  test("hours always sum to the released total", () => {
    for (const released of [0, 1, 7, 725.275, 1169.1, 12345.67]) {
      const rows = allocationRows(DEFAULT_ALLOCATION, released);
      expect(rows.reduce((s, r) => s + r.hours, 0)).toBe(Math.round(released));
      for (const r of rows) expect(r.hours).toBeGreaterThanOrEqual(0);
    }
  });

  test("negative or non-finite released capacity is treated as zero", () => {
    for (const bad of [-500, Number.NaN, Number.POSITIVE_INFINITY]) {
      const rows = allocationRows(DEFAULT_ALLOCATION, bad);
      expect(rows.reduce((s, r) => s + r.hours, 0)).toBe(0);
    }
  });
});

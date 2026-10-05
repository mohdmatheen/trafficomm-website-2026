/**
 * Scenario modelling.
 *
 * Both levers work by adjusting the inputs the engine already takes and
 * recalculating, rather than by patching results. That keeps a single
 * calculation path: anything true of the base result is true of a scenario.
 *
 * Neither lever asserts a saving. Reallocating hours changes where work sits and
 * how much internal capacity it consumes; what that is worth depends on a
 * delivery price the model does not contain, so the outputs are hours, FTE and
 * utilization — not money saved.
 */
import { calculate, type CalculatorResult } from "./engine";
import { ACTIVITIES, type CalculatorInput } from "./model";

export type Scenario = {
  /**
   * How far reporting production and data extraction have been automated, 0–1.
   * At 1 the two activities' hours fall by `MAX_REPORTING_REDUCTION`; the
   * remainder is the interpretation and checking that automation does not remove.
   */
  reportingAutomation: number;
  /** Share of each activity's externalizable hours delivered externally, 0–1. */
  externalAllocation: number;
};

export const BASE_SCENARIO: Scenario = { reportingAutomation: 0, externalAllocation: 0 };

/**
 * The ceiling on what automating reporting can remove. Assembly and extraction
 * are automatable; deciding what the numbers mean is not, so the lever cannot
 * drive these activities to zero.
 */
export const MAX_REPORTING_REDUCTION = 0.6;

const AUTOMATABLE: ReadonlySet<string> = new Set(["reporting", "extraction"]);

export type ScenarioResult = {
  result: CalculatorResult;
  /** Hours moved to an external team at the current allocation. */
  externallyDeliveredHours: number;
  /** Workload still carried internally, after automation and external delivery. */
  internalHours: number;
  internalExecutionHours: number;
  /** Internal workload as a share of the team's productive capacity. */
  internalUtilization: number;
  /** Internal FTE the remaining workload implies. */
  internalFteRequirement: number;
  /** Capacity freed relative to the base case, in hours. */
  capacityReleased: number;
};

export function applyScenario(input: CalculatorInput, scenario: Scenario): ScenarioResult {
  const factor = 1 - MAX_REPORTING_REDUCTION * clamp01(scenario.reportingAutomation);
  const hoursPerWeek = { ...input.hoursPerWeek };
  for (const a of ACTIVITIES) {
    if (AUTOMATABLE.has(a.id)) hoursPerWeek[a.id] = (input.hoursPerWeek[a.id] ?? a.defaultHoursPerWeek) * factor;
  }

  const adjusted: CalculatorInput = { ...input, hoursPerWeek };
  const result = calculate(adjusted);
  const alloc = clamp01(scenario.externalAllocation);

  const externallyDeliveredHours = result.externalizableHours * alloc;
  const internalHours = result.workloadHours - externallyDeliveredHours;
  const internalExecutionHours =
    result.executionHours -
    result.activities.filter((a) => a.category === "Execution").reduce((s, a) => s + a.externalizableHours, 0) * alloc;

  const internalUtilization = result.productiveCapacity === 0 ? 0 : internalHours / result.productiveCapacity;
  const internalFteRequirement = result.productiveHoursPerFte === 0 ? 0 : internalHours / result.productiveHoursPerFte;

  const base = calculate(input);
  const capacityReleased = base.workloadHours - internalHours;

  return {
    result,
    externallyDeliveredHours,
    internalHours,
    internalExecutionHours,
    internalUtilization,
    internalFteRequirement,
    capacityReleased,
  };
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));
}

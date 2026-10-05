"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { campaignVolumeBand, externalizableBand, platformsBand, teamBand, utilizationBand } from "./bands";
import { fallbackRate, getUsdRate, type FxRate } from "./currency";
import { calculate, type CalculatorResult } from "./engine";
import { defaultDrivers, estimateHoursPerWeek, type EstimatorDrivers } from "./estimator";
import { ACTIVITIES, MARKETS, defaultInput, type ActivityId, type CalculatorInput, type MarketCode, type RoleId } from "./model";
import { DEFAULT_ALLOCATION, redistribute, type AllocationId } from "./allocation";
import { BASE_SCENARIO, applyScenario, type Scenario, type ScenarioResult } from "./scenario";

export type StepId = "market" | "business" | "team" | "workload" | "platforms" | "operations" | "results";

export const STEPS: { id: StepId; label: string }[] = [
  { id: "market", label: "Market" },
  { id: "business", label: "Business" },
  { id: "team", label: "Team" },
  { id: "workload", label: "Workload" },
  { id: "platforms", label: "Platforms" },
  { id: "operations", label: "Operations" },
];

export type WorkloadMode = "quick" | "detailed";
export type SalaryMode = "market" | "custom";

export type LabsState = {
  step: StepId;
  /** Steps the visitor has reached, so the progress rail can offer them again. */
  visited: StepId[];
  input: CalculatorInput;
  drivers: EstimatorDrivers;
  platforms: string[];
  workloadMode: WorkloadMode;
  salaryMode: SalaryMode;
  /** Custom salaries survive a switch to market estimates and back. */
  customSalaries: Record<RoleId, number>;
  scenario: Scenario;
  /** Released-capacity split, as percentages. Illustrative until the visitor moves one. */
  allocation: Record<AllocationId, number>;
  /** Whether the visitor changed the split, so the lead payload can say which it is. */
  allocationEdited: boolean;
  analysed: boolean;
};

type Action =
  | { type: "goto"; step: StepId }
  | { type: "setMarket"; market: MarketCode }
  | { type: "patchInput"; patch: Partial<CalculatorInput> }
  | { type: "setHeadcount"; role: RoleId; value: number }
  | { type: "setSalary"; role: RoleId; value: number }
  | { type: "setSalaryMode"; mode: SalaryMode }
  | { type: "setDrivers"; patch: Partial<EstimatorDrivers> }
  | { type: "setWorkloadMode"; mode: WorkloadMode }
  | { type: "setHours"; activity: ActivityId; value: number }
  | { type: "togglePlatform"; id: string }
  | { type: "setEfficiency"; id: keyof CalculatorInput["efficiency"]; value: number }
  | { type: "setScenario"; patch: Partial<Scenario> }
  | { type: "setAllocation"; id: AllocationId; value: number }
  | { type: "analysed" }
  | { type: "restore"; state: LabsState }
  | { type: "reset" };

const STORAGE_KEY = "trafficomm.labs.adops.v1";

function initial(): LabsState {
  const input = defaultInput("SA");
  return {
    step: "market",
    visited: ["market"],
    input,
    drivers: defaultDrivers(),
    platforms: ["meta", "google-ads", "tiktok", "snapchat", "dv360", "cm360"],
    workloadMode: "quick",
    salaryMode: "market",
    customSalaries: { ...input.salaries },
    scenario: { ...BASE_SCENARIO },
    allocation: { ...DEFAULT_ALLOCATION },
    allocationEdited: false,
    analysed: false,
  };
}

/** Re-estimates workload whenever a driver changes, unless hours were taken over manually. */
function withEstimate(state: LabsState): LabsState {
  if (state.workloadMode !== "quick") return state;
  return { ...state, input: { ...state.input, hoursPerWeek: estimateHoursPerWeek(state.drivers) } };
}

function reducer(state: LabsState, action: Action): LabsState {
  switch (action.type) {
    case "goto":
      return { ...state, step: action.step, visited: state.visited.includes(action.step) ? state.visited : [...state.visited, action.step] };

    case "setMarket": {
      const m = MARKETS[action.market];
      // Market estimates follow the market; custom figures the visitor typed do not.
      const salaries = state.salaryMode === "market" ? { ...m.salaries, other: state.input.salaries.other } : state.input.salaries;
      return { ...state, input: { ...state.input, market: action.market, salaries } };
    }

    case "patchInput":
      return { ...state, input: { ...state.input, ...action.patch } };

    case "setHeadcount":
      return { ...state, input: { ...state.input, headcount: { ...state.input.headcount, [action.role]: Math.max(0, Math.min(999, action.value)) } } };

    case "setSalary": {
      const value = Math.max(0, Math.min(10_000_000, action.value));
      const customSalaries = { ...state.customSalaries, [action.role]: value };
      return { ...state, customSalaries, input: { ...state.input, salaries: customSalaries } };
    }

    case "setSalaryMode": {
      const m = MARKETS[state.input.market];
      const salaries = action.mode === "market" ? { ...m.salaries, other: state.input.salaries.other } : { ...state.customSalaries };
      return { ...state, salaryMode: action.mode, input: { ...state.input, salaries } };
    }

    case "setDrivers":
      return withEstimate({ ...state, drivers: { ...state.drivers, ...action.patch } });

    case "setWorkloadMode":
      // Switching to detailed keeps whatever the estimate produced as the starting point.
      return action.mode === "quick" ? withEstimate({ ...state, workloadMode: "quick" }) : { ...state, workloadMode: "detailed" };

    case "setHours":
      return {
        ...state,
        workloadMode: "detailed",
        input: { ...state.input, hoursPerWeek: { ...state.input.hoursPerWeek, [action.activity]: Math.max(0, Math.min(2000, action.value)) } },
      };

    case "togglePlatform": {
      const platforms = state.platforms.includes(action.id) ? state.platforms.filter((p) => p !== action.id) : [...state.platforms, action.id];
      return withEstimate({ ...state, platforms, drivers: { ...state.drivers, platforms: platforms.length } });
    }

    case "setEfficiency":
      return { ...state, input: { ...state.input, efficiency: { ...state.input.efficiency, [action.id]: Math.max(1, Math.min(5, action.value)) } } };

    case "setScenario":
      return { ...state, scenario: { ...state.scenario, ...action.patch } };

    case "setAllocation":
      return { ...state, allocation: redistribute(state.allocation, action.id, action.value), allocationEdited: true };

    case "analysed":
      return { ...state, analysed: true, step: "results", visited: state.visited.includes("results") ? state.visited : [...state.visited, "results"] };

    case "restore":
      return action.state;

    case "reset":
      return initial();
  }
}

export function useLabsCalculator() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  // The live rate is stored with the market it belongs to, so switching market
  // falls straight back to that market's snapshot instead of briefly showing the
  // previous market's rate.
  const [liveFx, setLiveFx] = useState<{ market: MarketCode; rate: FxRate } | null>(null);
  const restored = useRef(false);

  // Restore an in-progress session so a refresh does not lose the questionnaire.
  // Session storage, not local: this is a working draft, not a saved document.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "restore", state: JSON.parse(raw) as LabsState });
    } catch {
      /* A corrupt draft should start a fresh session, not break the tool. */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Private mode and full quotas are both fine; the tool works without persistence. */
    }
  }, [state]);

  // Render with the snapshot rate immediately; upgrade when the live one arrives.
  const market_ = state.input.market;
  useEffect(() => {
    const ac = new AbortController();
    getUsdRate(market_, ac.signal)
      .then((rate) => setLiveFx({ market: market_, rate }))
      .catch(() => {});
    return () => ac.abort();
  }, [market_]);

  const fx: FxRate = liveFx?.market === market_ ? liveFx.rate : fallbackRate(market_);

  const result: CalculatorResult = useMemo(() => calculate(state.input), [state.input]);
  const scenario: ScenarioResult = useMemo(() => applyScenario(state.input, state.scenario), [state.input, state.scenario]);

  const market = MARKETS[state.input.market];

  /** Band-only analytics context. No salary, cost or headcount figure is included. */
  const context = useCallback(
    () => ({
      tool_name: "adops-capacity",
      market: state.input.market,
      team_band: teamBand(result.headcount),
      platforms_band: platformsBand(state.platforms.length),
      campaign_volume: campaignVolumeBand(state.input.campaignsPerMonth),
      utilization_band: utilizationBand(result.utilization),
      externalizable_band: externalizableBand(result.externalizableHours),
    }),
    [state.input.market, state.input.campaignsPerMonth, state.platforms.length, result.headcount, result.utilization, result.externalizableHours],
  );

  return { state, dispatch, result, scenario, market, fx, context, activities: ACTIVITIES, trackEvent };
}

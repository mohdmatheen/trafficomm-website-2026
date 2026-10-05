/**
 * Quick-estimate workload model.
 *
 * IMPORTANT — this is the one part of the calculator that is NOT in the
 * workbook. The workbook takes hours per activity as direct input (Inputs!C21:C30);
 * it contains no formula deriving them from campaign volume or client count.
 *
 * Asking an operations lead for ten hour-by-activity figures is the fastest way
 * to lose them, so this module interpolates those hours from business inputs
 * they can answer. It is anchored so that at the workbook's own default
 * scenario it returns the workbook's own default hours exactly — the estimate
 * passes through the signed-off point and scales away from it. Everything it
 * produces is labelled "Estimated" in the UI and is editable before analysis.
 *
 * Each activity scales on the driver that actually moves it, with secondary
 * drivers applied as mild multipliers. Scaling is damped (exponent < 1) because
 * operational work grows sub-linearly with volume: the tenth campaign of a month
 * costs less than the first.
 */
import { ACTIVITIES, type ActivityId } from "./model";

/** The workbook's default scenario — the point this estimator passes through. */
export const ESTIMATOR_BASELINE = {
  campaignsPerMonth: 150,
  activeClients: 25,
  marketsManaged: 5,
  creativesPerCampaign: 8,
  platforms: 6,
  /** 1 monthly → 5 daily/custom. Matches Inputs!E9's 1–5 reporting complexity scale. */
  reportingFrequency: 4,
  /** 1 monthly → 5 daily. */
  optimizationCadence: 4,
} as const;

export type EstimatorDrivers = {
  campaignsPerMonth: number;
  activeClients: number;
  marketsManaged: number;
  creativesPerCampaign: number;
  platforms: number;
  reportingFrequency: number;
  optimizationCadence: number;
};

export const defaultDrivers = (): EstimatorDrivers => ({ ...ESTIMATOR_BASELINE });

/** Damped ratio: 1 at baseline, growing sub-linearly either side of it. */
const ratio = (value: number, baseline: number, exponent: number) => {
  if (baseline <= 0) return 1;
  const v = Math.max(0, value);
  if (v === 0) return 0;
  return Math.pow(v / baseline, exponent);
};

/** A secondary driver nudges rather than drives: ±`weight` across the full range. */
const nudge = (value: number, baseline: number, weight: number) => {
  if (baseline <= 0) return 1;
  return 1 + ((Math.max(0, value) - baseline) / baseline) * weight;
};

type Rule = { primary: (d: EstimatorDrivers) => number; baseline: number; exponent: number; modifier?: (d: EstimatorDrivers) => number };

const RULES: Record<ActivityId, Rule> = {
  // Builds scale with campaign count, and each extra platform adds its own build model.
  setup: {
    primary: (d) => d.campaignsPerMonth, baseline: ESTIMATOR_BASELINE.campaignsPerMonth, exponent: 0.85,
    modifier: (d) => nudge(d.platforms, ESTIMATOR_BASELINE.platforms, 0.25),
  },
  // QA follows what was built, and deepens slightly with market count.
  qa: {
    primary: (d) => d.campaignsPerMonth, baseline: ESTIMATOR_BASELINE.campaignsPerMonth, exponent: 0.85,
    modifier: (d) => nudge(d.marketsManaged, ESTIMATOR_BASELINE.marketsManaged, 0.2),
  },
  // Reporting is a function of who receives it and how often.
  reporting: {
    primary: (d) => d.activeClients, baseline: ESTIMATOR_BASELINE.activeClients, exponent: 0.8,
    modifier: (d) => nudge(d.reportingFrequency, ESTIMATOR_BASELINE.reportingFrequency, 0.45),
  },
  extraction: {
    primary: (d) => d.activeClients, baseline: ESTIMATOR_BASELINE.activeClients, exponent: 0.75,
    modifier: (d) => nudge(d.platforms, ESTIMATOR_BASELINE.platforms, 0.35),
  },
  // Pacing is per live campaign, checked on a cadence.
  pacing: {
    primary: (d) => d.campaignsPerMonth, baseline: ESTIMATOR_BASELINE.campaignsPerMonth, exponent: 0.8,
    modifier: (d) => nudge(d.optimizationCadence, ESTIMATOR_BASELINE.optimizationCadence, 0.3),
  },
  optimization: {
    primary: (d) => d.campaignsPerMonth, baseline: ESTIMATOR_BASELINE.campaignsPerMonth, exponent: 0.8,
    modifier: (d) => nudge(d.optimizationCadence, ESTIMATOR_BASELINE.optimizationCadence, 0.5),
  },
  // Creative coordination tracks the number of assets moving through.
  creative: {
    primary: (d) => d.campaignsPerMonth * d.creativesPerCampaign,
    baseline: ESTIMATOR_BASELINE.campaignsPerMonth * ESTIMATOR_BASELINE.creativesPerCampaign, exponent: 0.7,
  },
  // Measurement work follows the number of platforms carrying signal.
  tracking: {
    primary: (d) => d.platforms, baseline: ESTIMATOR_BASELINE.platforms, exponent: 0.7,
    modifier: (d) => nudge(d.marketsManaged, ESTIMATOR_BASELINE.marketsManaged, 0.25),
  },
  // Strategy and meetings are per relationship, not per campaign.
  strategy: { primary: (d) => d.activeClients, baseline: ESTIMATOR_BASELINE.activeClients, exponent: 0.75 },
  meetings: {
    primary: (d) => d.activeClients, baseline: ESTIMATOR_BASELINE.activeClients, exponent: 0.7,
    modifier: (d) => nudge(d.marketsManaged, ESTIMATOR_BASELINE.marketsManaged, 0.15),
  },
};

/**
 * Returns estimated hours per week per activity. At `ESTIMATOR_BASELINE` this is
 * exactly the workbook's Inputs!C21:C30 — see tests/labs-engine.spec.ts.
 */
export function estimateHoursPerWeek(drivers: EstimatorDrivers): Record<ActivityId, number> {
  const out = {} as Record<ActivityId, number>;
  for (const a of ACTIVITIES) {
    const rule = RULES[a.id];
    const scale = ratio(rule.primary(drivers), rule.baseline, rule.exponent) * Math.max(0, rule.modifier?.(drivers) ?? 1);
    // One decimal: the estimate does not justify more, and whole hours would
    // round small teams to zero.
    out[a.id] = Math.round(a.defaultHoursPerWeek * scale * 10) / 10;
  }
  return out;
}

export const REPORTING_FREQUENCY_LABELS = ["Monthly", "Twice monthly", "Weekly", "Twice weekly", "Daily / on demand"];
export const OPTIMIZATION_CADENCE_LABELS = ["Monthly", "Twice monthly", "Weekly", "Twice weekly", "Daily"];

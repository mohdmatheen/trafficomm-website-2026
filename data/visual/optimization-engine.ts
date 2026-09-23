/**
 * Performance Marketing — optimization engine (Wave 1 visual).
 *
 * Signal labels mirror the approved levers in data/service-depth.ts; the
 * `examines` lists use only terminology already on the approved page
 * (capability groups, KPI targets and the workflow).
 *
 * The observation / option pairs are ILLUSTRATIVE PROCESS EXAMPLES — what a
 * performance operator would notice and propose. They are not Trafficomm
 * results, not client results and claim no improvement. No percentage, uplift
 * or saving appears anywhere in this file, by design.
 */
export type EngineSignal = {
  id: string;
  /** Matches an approved lever label. */
  label: string;
  /** What Trafficomm examines inside that signal. */
  examines: readonly string[];
  /** Illustrative observation the signal can surface. */
  observation: string;
  /** Illustrative option Trafficomm would put to your team. */
  option: string;
};

export const engineSignals: readonly EngineSignal[] = [
  {
    id: "audience",
    label: "Audience",
    examines: ["Audience strategy", "Segments", "Demographics", "Behaviour", "Reach", "Overlap"],
    observation: "Two segments overlapping on the same users",
    option: "Split the segments and exclude the overlap",
  },
  {
    id: "creative",
    label: "Creative",
    examines: ["Creative testing", "A/B testing", "Formats", "Variants", "Fatigue", "Response"],
    observation: "Frequency rising while response falls",
    option: "Refresh the format that is fatiguing",
  },
  {
    id: "channel",
    label: "Placement / channel",
    examines: ["Paid social", "Paid search", "Lead generation", "Placement mix"],
    observation: "One placement absorbing most of the impressions",
    option: "Cap the placement and redistribute",
  },
  {
    id: "budget",
    label: "Budget",
    examines: ["Budget allocation", "Pacing", "Campaign distribution", "Channel distribution"],
    observation: "Most of the budget sitting in one ad set",
    option: "Reallocate toward the sets that convert",
  },
  {
    id: "structure",
    label: "Campaign structure",
    examines: ["Campaign architecture", "Objective", "Segmentation", "Naming", "Consolidation"],
    observation: "One objective split across too many campaigns",
    option: "Consolidate and rename to a single convention",
  },
  {
    id: "conversion",
    label: "Conversion performance",
    examines: ["Campaign optimization", "Conversion tracking", "Signal quality", "Performance analysis"],
    observation: "Platform and analytics conversions disagree",
    option: "Validate the measurement layer before optimizing",
  },
] as const;

/** The centre of the engine: the metric every signal is read against. */
export const engineCore = {
  label: "Target KPI",
  example: "CPA",
  body: "The KPI your client is measured on.",
  allLabel: "All signals",
  allBody: "Examined together, not one metric at a time.",
} as const;

/** What enters the engine before any change is proposed. */
export const engineInlet = ["Historical data", "KPI definition", "Tracking check"] as const;

/** Shown when the engine rests on the converged state. */
export const convergedReadout = {
  examining: "All six signals, together",
  observation: "Cost per result drifting above target",
  option: "Candidate changes, in priority order",
} as const;

/** Where a proposed change goes. The third step is a person, every time. */
export const decisionChain = ["Observation", "Option", "Human decision", "Implement", "Measure again"] as const;

export const statusLine = "Recommended — implemented once your team agrees";

/** The boundary, restated inside the visual so it cannot be missed. */
export const autonomyNote = "Trafficomm analyses, identifies and recommends, and implements the changes your team agrees. Strategy, targets and client commitments stay with you.";

/**
 * The compact performance view in the page hero, and the small charts inside
 * the readout.
 *
 * ILLUSTRATIVE OPERATIONAL VALUES — what a performance operator looks at, not
 * Trafficomm or client results. Nothing here states an improvement, and every
 * surface that shows these values carries a visible "illustrative" label.
 */
export const heroBoard = {
  caption: "Illustrative performance view",
  kpis: [
    { label: "CPA", value: "$38.90", note: "Target $36.00" },
    { label: "ROAS", value: "3.2x", note: "Target 3.0x" },
    { label: "CTR", value: "1.8%", note: "" },
  ],
  /** Twelve periods; the tail drifts above target, which is what an operator would question. */
  trend: [36.1, 35.4, 36.8, 35.9, 36.4, 37.2, 36.6, 37.5, 38.1, 38.4, 39.2, 38.9],
  target: 36,
  trendNote: "CPA vs target · 12 periods",
  allocation: [
    { label: "Meta", value: 42 },
    { label: "Google", value: 31 },
    { label: "TikTok", value: 17 },
    { label: "Other", value: 10 },
  ],
  allocationNote: "Budget allocation",
} as const;

/** Creative states an operator reads before proposing a refresh. Illustrative. */
export const creativeStates = [
  { name: "Creative A", state: "Stable", level: 3 },
  { name: "Creative B", state: "Declining", level: 1 },
  { name: "Creative C", state: "In test", level: 2 },
] as const;

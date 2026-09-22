import type { PipelineStage } from "@/components/visual/SignalPipeline";

/**
 * Reporting & Insights prototype data.
 *
 * EVERY NUMBER HERE IS FICTIONAL UI SAMPLE DATA, used to show what a
 * Trafficomm report looks like and how it is read. It is never a Trafficomm
 * result, a client result or a case-study figure, and the interface labels
 * itself "Illustrative data" wherever it appears. Trafficomm does not sell
 * dashboard software; this represents the reporting workflow.
 */
export const reportingPipeline: readonly PipelineStage[] = [
  {
    label: "Platform data",
    summary: "Data is pulled from every platform in scope.",
    items: ["Ad platforms", "Ad servers", "Analytics"],
    owner: "client",
  },
  { label: "Raw data", summary: "Exports arrive in different shapes and time zones.", items: ["Exports", "Naming variants", "Time zones"] },
  { label: "Validation", summary: "Totals are checked and discrepancies explained." },
  { label: "Normalization", summary: "Everything is aligned so platforms compare honestly.", items: ["Consistent naming", "Consolidation", "Aligned periods"] },
  { label: "KPI analysis", summary: "Performance is read against the agreed targets.", items: ["Against targets", "Trends", "Exceptions"] },
  { label: "Commentary", summary: "What moved, and why — written by the operators.", items: ["What moved", "Why it moved"] },
  { label: "Recommendation", summary: "A specific next action, prioritized.", items: ["Next actions", "Priorities"] },
  { label: "Output", summary: "Delivered in your template, on the agreed cadence.", items: ["Your template", "Your brand", "Agreed cadence"], owner: "output" },
] as const;

export type DashboardView = { id: string; label: string; scope: string; kpis: { label: string; value: string; note: string }[]; breakdown: { label: string; value: number }[]; breakdownLabel: string };

/** Fictional sample values — neutral, with no dramatic swings that could read as a claim. */
export const dashboardViews: readonly DashboardView[] = [
  {
    id: "overview",
    label: "Overview",
    scope: "All platforms · period to date",
    kpis: [
      { label: "Spend", value: "$48.2K", note: "" },
      { label: "Sessions", value: "84.6K", note: "" },
      { label: "Conversions", value: "1,240", note: "" },
      { label: "CPA", value: "$38.90", note: "Target $36.00" },
      { label: "ROAS", value: "3.2x", note: "Target 3.0x" },
      { label: "CTR", value: "1.8%", note: "" },
    ],
    breakdownLabel: "Spend by platform",
    breakdown: [
      { label: "Meta", value: 34 },
      { label: "Google Ads", value: 28 },
      { label: "DV360", value: 19 },
      { label: "TikTok", value: 12 },
      { label: "Other", value: 7 },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    scope: "Meta · period to date",
    kpis: [
      { label: "Spend", value: "$16.4K", note: "" },
      { label: "Sessions", value: "31.2K", note: "" },
      { label: "Conversions", value: "486", note: "" },
      { label: "CPA", value: "$33.70", note: "" },
      { label: "ROAS", value: "3.4x", note: "" },
      { label: "CTR", value: "2.1%", note: "" },
    ],
    breakdownLabel: "Conversions by platform",
    breakdown: [
      { label: "Meta", value: 486 },
      { label: "Google Ads", value: 392 },
      { label: "DV360", value: 214 },
      { label: "TikTok", value: 148 },
    ],
  },
  {
    id: "market",
    label: "Market",
    scope: "Saudi Arabia · period to date",
    kpis: [
      { label: "Spend", value: "$21.6K", note: "" },
      { label: "Sessions", value: "38.4K", note: "" },
      { label: "Conversions", value: "560", note: "" },
      { label: "CPA", value: "$38.60", note: "" },
      { label: "ROAS", value: "3.1x", note: "" },
      { label: "CTR", value: "1.7%", note: "" },
    ],
    breakdownLabel: "Conversions by market",
    breakdown: [
      { label: "Saudi Arabia", value: 560 },
      { label: "UAE", value: 402 },
      { label: "Qatar", value: 168 },
      { label: "Kuwait", value: 110 },
    ],
  },
  {
    id: "campaign",
    label: "Campaign",
    scope: "Campaign B · period to date",
    kpis: [
      { label: "Spend", value: "$9.8K", note: "" },
      { label: "Sessions", value: "14.9K", note: "" },
      { label: "Conversions", value: "198", note: "" },
      { label: "CPA", value: "$49.50", note: "Above target" },
      { label: "ROAS", value: "2.4x", note: "Below target" },
      { label: "CTR", value: "1.2%", note: "" },
    ],
    breakdownLabel: "Conversions by campaign",
    breakdown: [
      { label: "Campaign A", value: 512 },
      { label: "Campaign B", value: 198 },
      { label: "Campaign C", value: 331 },
      { label: "Campaign D", value: 199 },
    ],
  },
] as const;

/** Illustrative 12-point CPA trend; the last points drift up, which is what the commentary picks up. */
export const cpaTrend = [36.1, 35.4, 36.8, 35.9, 36.4, 37.2, 36.6, 37.5, 38.1, 38.4, 39.2, 38.9] as const;

/** The reporting → analysis → insight moment, worked through on one illustrative exception. */
export const insightStory = {
  reporting: { question: "What happened?", headline: "CPA above target", detail: "$38.90 vs $36.00" },
  analysis: { question: "Why?", headline: "Campaign B", factors: ["Creative fatigue", "Frequency ↑", "CVR ↓", "Budget weighted to one ad set"] },
  insight: { question: "What next?", headline: "Three options, in priority order", actions: ["Review creative", "Reallocate budget", "Test variation"] },
} as const;

/** The recommendation is prepared by operators; acting on it is a person's call. */
export const decisionNote = "Human decision";

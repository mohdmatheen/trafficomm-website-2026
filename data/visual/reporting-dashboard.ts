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

export type DashboardView = { id: string; label: string; kpis: { label: string; value: string; note: string }[]; breakdown: { label: string; value: number }[]; breakdownLabel: string };

/** Fictional sample values — neutral, with no dramatic swings that could read as a claim. */
export const dashboardViews: readonly DashboardView[] = [
  {
    id: "overview",
    label: "Overview",
    kpis: [
      { label: "Spend", value: "$48.2K", note: "Period to date" },
      { label: "Sessions", value: "84.6K", note: "Period to date" },
      { label: "Conversions", value: "1,240", note: "Period to date" },
      { label: "CPA", value: "$38.90", note: "Against $36.00 target" },
      { label: "ROAS", value: "3.2x", note: "Against 3.0x target" },
      { label: "CTR", value: "1.8%", note: "All placements" },
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
    kpis: [
      { label: "Spend", value: "$16.4K", note: "Meta" },
      { label: "Sessions", value: "31.2K", note: "Meta" },
      { label: "Conversions", value: "486", note: "Meta" },
      { label: "CPA", value: "$33.70", note: "Meta" },
      { label: "ROAS", value: "3.4x", note: "Meta" },
      { label: "CTR", value: "2.1%", note: "Meta" },
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
    kpis: [
      { label: "Spend", value: "$21.6K", note: "Saudi Arabia" },
      { label: "Sessions", value: "38.4K", note: "Saudi Arabia" },
      { label: "Conversions", value: "560", note: "Saudi Arabia" },
      { label: "CPA", value: "$38.60", note: "Saudi Arabia" },
      { label: "ROAS", value: "3.1x", note: "Saudi Arabia" },
      { label: "CTR", value: "1.7%", note: "Saudi Arabia" },
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
    kpis: [
      { label: "Spend", value: "$9.8K", note: "Campaign B" },
      { label: "Sessions", value: "14.9K", note: "Campaign B" },
      { label: "Conversions", value: "198", note: "Campaign B" },
      { label: "CPA", value: "$49.50", note: "Above target" },
      { label: "ROAS", value: "2.4x", note: "Below target" },
      { label: "CTR", value: "1.2%", note: "Campaign B" },
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
  reporting: { question: "What happened?", headline: "CPA increased against target.", detail: "$38.90 against a $36.00 target, driven by one campaign." },
  analysis: { question: "Why?", headline: "Campaign B is carrying the increase.", factors: ["Creative fatigue", "Higher frequency", "Lower conversion rate", "Budget weighted to one ad set"] },
  insight: { question: "What next?", headline: "Three options, in priority order.", actions: ["Refresh the creative on Campaign B", "Reallocate budget toward Campaign A", "Test a new variation before scaling"] },
} as const;

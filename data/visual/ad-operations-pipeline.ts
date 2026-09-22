import type { PipelineStage } from "@/components/visual/SignalPipeline";

/**
 * Ad Operations campaign pipeline (visual storytelling prototype).
 *
 * Stage names and items come from the approved Ad Operations lifecycle in
 * data/service-pages/ad-operations.ts — this file only regroups them for the
 * animated pipeline, which shows one stage at a time instead of eight blocks
 * of text. No new claims, no campaign results.
 */
export const adOpsPipeline: readonly PipelineStage[] = [
  {
    label: "Brief",
    summary: "Your approved plan arrives as an executable brief.",
    items: ["Media plan review", "Campaign requirements", "Specs", "Assets", "Timelines"],
    owner: "client",
  },
  {
    label: "Build",
    summary: "Campaign architecture is assembled to your naming conventions.",
    items: ["Campaign setup", "Ad-server setup", "Platform setup", "Naming conventions"],
  },
  {
    label: "Traffic",
    summary: "Creatives, tags and destinations are trafficked into that structure.",
    items: ["Trafficking", "Creative assignment", "Tags", "Landing URLs", "Schedule"],
  },
  {
    label: "QA",
    summary: "Creatives and tags are audited against platform specs before launch.",
    items: ["Creative audit", "Third-party tags", "Tracking", "Ad-server validation"],
  },
  {
    label: "Validate",
    summary: "The build is checked independently of whoever built it.",
  },
  {
    label: "Approval",
    summary: "Trafficomm does not launch on its own.",
    owner: "client",
  },
  {
    label: "Launch",
    summary: "Go-live is executed and verified with the publisher.",
    items: ["Activation", "Publisher coordination", "Screenshots", "Initial delivery validation"],
  },
  {
    label: "Monitor",
    summary: "Delivery is watched in flight, so issues surface early.",
    items: ["Delivery", "Pacing", "Spend", "Discrepancies", "Creative status"],
    owner: "output",
  },
] as const;

/** Illustrative brief fields — a representation of an incoming campaign, not a client brief. */
export const briefFields = ["Objective", "Market", "Platform", "Budget", "Creative", "Tracking"] as const;

/**
 * The approved five QA gates, now shown inside the pipeline's QA and Validate
 * stages instead of a separate QA framework section. Nothing was dropped in the
 * move: these are the same gates and checks that section carried.
 */
export const qaGateGroups = [
  { code: "Gate 01", title: "Input QA", scope: "Structure", checks: ["Media plan", "Assets", "Specs"] },
  { code: "Gate 03", title: "Creative QA", scope: "Creative", checks: ["Creative", "URLs", "Tags", "Tracking"] },
] as const;

export const validateGateGroups = [
  { code: "Gate 02", title: "Build QA", scope: "Structure", checks: ["Campaign settings", "Budget", "Dates", "Targeting"] },
  { code: "Gate 04", title: "Launch QA", scope: "Launch readiness", checks: ["Delivery", "Screenshots", "Tracking validation"] },
  { code: "Gate 05", title: "Ongoing QA", scope: "In flight", checks: ["Pacing", "Discrepancies", "Performance signals"] },
] as const;

/** Independent campaign QA, run separately from the build (approved Build / Launch QA gates). */
export const campaignChecks = ["Naming", "Budget", "Audience", "Creative", "URL", "Tracking", "Placement", "Dates"] as const;

/** What trafficking maps onto what. Left object → right slot in the campaign structure. */
export const traffickingMap = [
  ["Creative", "Placement"],
  ["Landing URL", "Destination"],
  ["Third-party tag", "Tracking"],
  ["Flight dates", "Schedule"],
] as const;

/** In-flight monitoring signals. Status words only — no campaign results. */
export const monitorSignals = ["Delivery", "Spend", "Tracking", "Creative status"] as const;

/** Reporting cadence, delivered out of the monitoring stage. Same cadences as the approved reporting section. */
export const monitorCadence = [
  { label: "Daily", note: "Delivery, spend, pacing, issues" },
  { label: "Weekly", note: "Performance, trends, optimization" },
  { label: "Monthly", note: "KPI performance, analysis, recommendations" },
  { label: "End of campaign", note: "Results, learnings, next steps" },
] as const;

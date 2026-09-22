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

/** Creative and tag checks at the QA stage (from the approved Creative QA gate). */
export const creativeChecks = ["Specs", "File weight", "Landing URLs", "Third-party tags", "Click tracking", "Impression tracking"] as const;

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

import type { PipelineStage } from "@/components/visual/SignalPipeline";

/**
 * Measurement & Analytics signal journey (visual storytelling prototype).
 *
 * Stages mirror the approved measurement chain in data/service-depth.ts. The
 * illustrative event carries no personal data — only a name and non-identifying
 * parameters — and the destinations stage keeps the honest CAPI framing.
 */
export const measurementJourney: readonly PipelineStage[] = [
  {
    label: "User action",
    summary: "Someone completes an action worth measuring.",
    items: ["Conversion", "Key event"],
    owner: "client",
  },
  {
    label: "Data layer",
    summary: "The action becomes a structured event with parameters.",
    items: ["Event name", "Parameters"],
  },
  {
    label: "GTM",
    summary: "A trigger fires the tags that carry the event onward.",
    items: ["Trigger", "Tag", "Event"],
  },
  {
    label: "Destinations",
    summary: "The signal reaches analytics and the ad platforms.",
    items: ["GA4", "Platform signal", "Meta CAPI"],
  },
  {
    label: "Conversion",
    summary: "The event maps to the conversion platforms optimize toward.",
    items: ["Conversion definitions", "Platform mapping"],
  },
  {
    label: "Validation",
    summary: "Nothing is trusted until it is tested and reconciled.",
  },
  {
    label: "Reporting",
    summary: "Only validated signals reach reporting and optimization.",
    items: ["Reports", "Optimization signals"],
    owner: "output",
  },
] as const;

/** Illustrative event payload. Deliberately contains no personal data. */
export const illustrativeEvent = {
  name: "form_submit",
  params: ["market", "campaign", "source"],
} as const;

/** GTM concepts, in the order a marketer would read them. */
export const gtmParts = [
  { k: "Trigger", v: "form_submit fires" },
  { k: "Tag", v: "Send to GA4 & platform" },
  { k: "Event", v: "Named, with parameters" },
] as const;

/** Browser and server paths. CAPI complements the browser signal; it does not replace or restore it. */
export const destinationLanes = [
  { lane: "Browser signal", nodes: ["Tag fires in browser", "GA4 / platform"] },
  { lane: "Server signal", nodes: ["Server event", "Meta CAPI"] },
] as const;

export const validationChecks = ["Event fired", "Parameters present", "Destination received", "Conversion mapped"] as const;

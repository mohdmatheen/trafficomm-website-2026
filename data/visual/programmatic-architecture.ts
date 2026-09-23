/**
 * Programmatic Operations — delivery architecture (Wave 1 visual).
 *
 * A media system map rather than a funnel: every node sits in the lane that
 * owns it, so the diagram answers "where does Trafficomm participate, and
 * what does the trading desk keep" without a paragraph.
 *
 * Content comes from the approved Programmatic page (data/services.ts and the
 * programmatic entry in data/service-depth.ts). Only formats and inventory
 * types named there appear here — display, video, YouTube and PMP deals. No
 * delivery figures, no performance results.
 */
export type Lane = "agency" | "trafficomm" | "platform";

export type ArchNode = {
  id: string;
  label: string;
  lane: Lane;
  summary: string;
  items?: readonly string[];
  /** Official platform mark shown on the node. */
  platform?: string;
};

export const lanes: readonly { id: Lane; label: string; short: string }[] = [
  { id: "agency", label: "Agency / trading team", short: "Agency" },
  { id: "trafficomm", label: "Trafficomm operations", short: "Trafficomm" },
  { id: "platform", label: "Platforms & supply", short: "Platform" },
];

export const architecture: readonly ArchNode[] = [
  {
    id: "plan",
    label: "Media plan",
    lane: "agency",
    summary: "The approved plan, booking order and materials come from the trader or trading desk.",
    items: ["Approved plan", "Booking order", "Materials"],
  },
  {
    id: "dv360",
    label: "DV360 structure",
    lane: "trafficomm",
    platform: "dv360",
    summary: "Insertion orders and line items are structured in DV360 against the plan.",
    items: ["Campaign setup", "Insertion orders", "Line-item structure", "Targeting"],
  },
  {
    id: "inventory",
    label: "Inventory & deals",
    lane: "platform",
    summary: "What your traders bought has to transact the way it was booked.",
    items: ["PMP", "Display", "Video", "YouTube"],
  },
  {
    id: "cm360",
    label: "CM360 trafficking",
    lane: "trafficomm",
    platform: "cm360",
    summary: "Placements, creatives and tracking are trafficked in the ad server.",
    items: ["Placements", "Creatives", "Tracking"],
  },
  {
    id: "approval",
    label: "Creative approval",
    lane: "trafficomm",
    summary: "Approval status is tracked and issues are escalated with your agency team.",
    items: ["Approval status", "Tag issues", "Escalation"],
  },
  {
    id: "qa",
    label: "QA",
    lane: "trafficomm",
    summary: "The build is checked before anything spends — configuration, not creative taste.",
  },
  {
    id: "delivery",
    label: "Delivery",
    lane: "trafficomm",
    summary: "Pacing and delivery are monitored, and optimizations are applied per the trader's plan.",
    items: ["Pacing", "Delivery monitoring", "Optimization"],
  },
  {
    id: "reporting",
    label: "Reporting",
    lane: "trafficomm",
    summary: "Operational reporting on the agreed schedule, with completed requests logged where your team tracks them.",
    items: ["Operational reporting", "CRM / task tool updates"],
  },
] as const;

/** Programmatic QA is configuration QA: what was booked is what is live. */
export const programmaticChecks = ["Line items", "Targeting", "Creatives", "Tracking", "Deal configuration", "Flight dates", "Budget & pacing"] as const;

/** DV360 object hierarchy, shown when the structure node is selected. */
export const dv360Structure = [
  { level: "Campaign", note: "One per plan" },
  { level: "Insertion order", note: "Budget & flight" },
  { level: "Line item", note: "Targeting & bidding" },
] as const;

/** Inventory paths actually named on the approved page. */
export const inventoryRoutes = [
  { format: "Display & video", path: ["DV360", "PMP deal", "Publisher placement"] },
  { format: "YouTube", path: ["DV360", "YouTube inventory", "Placement"] },
] as const;

export const inventoryNote =
  "Inventory, deal strategy and buying decisions stay with your traders. Trafficomm checks the deal configuration and troubleshoots deals that do not transact as expected.";

/** Operational states a campaign moves through. Illustrative: one state is shown as current. */
export const deliveryStates = ["Setup", "Ready", "Live", "Delivering", "Check", "Reporting"] as const;
export const deliveryStateExample = "Delivering";

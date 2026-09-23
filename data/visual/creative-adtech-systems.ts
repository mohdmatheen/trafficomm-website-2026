/**
 * Creative & AdTech — two connected operational systems (Wave 1 visual).
 *
 * Track A is creative technology, track B is publisher / ad-tech operations,
 * and the bridge between them is trafficking and ad serving. The picture
 * exists to make one point: the creative does not exist in isolation — it
 * becomes a tag that a publisher's ad server has to carry.
 *
 * Every capability named here appears on the approved Creative & AdTech page
 * (data/services.ts and the creative-adtech entry in data/service-depth.ts).
 * The display formats and the ad-server panel are ILLUSTRATIVE EXAMPLES of
 * standard advertising formats and configuration — no client creative, no
 * proprietary Trafficomm software, no performance figures.
 */
export type SystemTrack = "creative" | "bridge" | "adtech";

export type SystemNode = {
  id: string;
  label: string;
  track: SystemTrack;
  summary: string;
  items?: readonly string[];
};

/** Nodes in operating order: produce the creative, hand it to the ad server, deliver it. */
export const systemNodes: readonly SystemNode[] = [
  {
    id: "asset",
    label: "Asset",
    track: "creative",
    summary: "Objectives, brand guidelines, formats and placements are agreed, and the source assets arrive.",
    items: ["Brief", "Objectives", "Formats", "Placements"],
  },
  {
    id: "spec",
    label: "Spec check",
    track: "creative",
    summary: "Every execution is measured against the publisher and platform specification before it is built.",
    items: ["Dimensions", "File weight", "Format", "Duration"],
  },
  {
    id: "build",
    label: "Build",
    track: "creative",
    summary: "Production in the format the placement calls for — by a creative director, designers and developers who work in advertising formats.",
    items: ["Static creative", "Video creative", "Rich media", "HTML5", "Celtra", "Bonzai", "Creative development"],
  },
  {
    id: "creative-qa",
    label: "Creative QA",
    track: "creative",
    summary: "Specs, weight, interactions and tracking are checked before anything is delivered.",
  },
  {
    id: "tag",
    label: "Tag",
    track: "creative",
    summary: "The execution leaves creative production as a tag an ad server can carry.",
    items: ["Third-party tags", "Creative auditing", "Click URL", "Tracking"],
  },
  {
    id: "adserver",
    label: "Trafficking · Ad serving",
    track: "bridge",
    summary: "Where the two systems meet: the creative tag is assigned to the placement it was built for.",
    items: ["Google Ad Manager", "Ad-server integration", "Creative assignment", "CM360"],
  },
  {
    id: "inventory",
    label: "Inventory",
    track: "adtech",
    summary: "An inventory framework for publishers, networks and ad-tech companies — the structure that decides whether inventory can earn.",
    items: ["Advertising inventory architecture", "Publisher monetization"],
  },
  {
    id: "placement",
    label: "Placement & tag",
    track: "adtech",
    summary: "Placements and ad tags are defined against that inventory structure.",
    items: ["Placements", "Ad tags", "Sizes"],
  },
  {
    id: "configuration",
    label: "Configuration",
    track: "adtech",
    summary: "Campaigns, line items and creative assignment are configured in the ad server.",
    items: ["Campaign management", "Line items", "Creative assignment"],
  },
  {
    id: "delivery",
    label: "Delivery",
    track: "adtech",
    summary: "The creative serves into the placement it was built for.",
    items: ["Ad serving", "Delivery"],
  },
  {
    id: "reporting",
    label: "Reporting",
    track: "adtech",
    summary: "Inventory, delivery and billing reporting, automated where it can be.",
    items: ["Inventory reporting", "Billing reporting", "Campaign reporting"],
  },
] as const;

/** Creative QA gate. Passing it is what "ready to traffic" means. */
export const creativeChecks = ["Dimensions", "File weight", "Format", "Click URL", "Tracking", "Naming", "Version", "Interactions"] as const;
export const readyState = "Ready to traffic";

/** Standard display formats, drawn as abstract frames. Examples of specifications, not client work. */
export const displayFormats = [
  { size: "300 × 250", w: 300, h: 250 },
  { size: "728 × 90", w: 728, h: 90 },
  { size: "300 × 600", w: 300, h: 600 },
  { size: "970 × 250", w: 970, h: 250 },
] as const;

/** Abstract ad-server view. Fictional rows: not a Trafficomm product and not client data. */
export const adServerRows = [
  { placement: "Homepage — top", creative: "970 × 250", tag: "Third-party", status: "Live" },
  { placement: "Article — inline", creative: "300 × 600", tag: "Hosted", status: "Ready" },
] as const;

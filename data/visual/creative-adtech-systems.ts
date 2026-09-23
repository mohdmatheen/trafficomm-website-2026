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
export type SystemTrack = "creative" | "publisher" | "bridge" | "output";

export type SystemNode = {
  id: string;
  label: string;
  track: SystemTrack;
  summary: string;
  items?: readonly string[];
  /** The stage this one feeds. Both inputs feed the ad server. */
  feeds?: string;
};

/**
 * Nodes in operating order. Creative production and publisher setup are two
 * parallel inputs; both have to be finished before trafficking can assign a
 * creative to a placement, and delivery and reporting come out of that.
 */
export const systemNodes: readonly SystemNode[] = [
  {
    id: "asset",
    feeds: "spec",
    label: "Asset",
    track: "creative",
    summary: "Objectives, brand guidelines, formats and placements are agreed, and the source assets arrive.",
    items: ["Brief", "Objectives", "Formats", "Placements"],
  },
  {
    id: "spec",
    feeds: "build",
    label: "Spec check",
    track: "creative",
    summary: "Every execution is measured against the publisher and platform specification before it is built.",
    items: ["Dimensions", "File weight", "Format", "Duration"],
  },
  {
    id: "build",
    feeds: "creative-qa",
    label: "Build",
    track: "creative",
    summary: "Production in the format the placement calls for — by a creative director, designers and developers who work in advertising formats.",
    items: ["Creative development", "HTML5", "Celtra", "Bonzai"],
  },
  {
    id: "creative-qa",
    feeds: "tag",
    label: "Creative QA",
    track: "creative",
    summary: "Specs, weight, interactions and tracking are checked before anything is delivered.",
  },
  {
    id: "tag",
    feeds: "adserver",
    label: "Tag",
    track: "creative",
    summary: "The execution leaves creative production as a tag an ad server can carry.",
    items: ["Third-party tags", "Creative auditing", "Click URL", "Tracking"],
  },
  {
    id: "inventory",
    feeds: "placement",
    label: "Inventory",
    track: "publisher",
    summary: "An inventory framework for publishers, networks and ad-tech companies — the structure that decides whether inventory can earn.",
    items: ["Advertising inventory architecture", "Publisher monetization"],
  },
  {
    id: "placement",
    feeds: "configuration",
    label: "Placement & tag",
    track: "publisher",
    summary: "Placements and ad tags are defined against that inventory structure.",
    items: ["Placements", "Ad tags", "Sizes"],
  },
  {
    id: "configuration",
    feeds: "adserver",
    label: "Configuration",
    track: "publisher",
    summary: "Campaigns, line items and creative assignment are configured in the ad server.",
    items: ["Campaign management", "Line items", "Creative assignment"],
  },
  {
    id: "adserver",
    feeds: "delivery",
    label: "Trafficking · Ad serving",
    track: "bridge",
    summary: "Where the two systems meet: the creative tag is assigned to the placement it was built for.",
    items: ["Google Ad Manager", "Ad-server integration", "Creative assignment", "CM360"],
  },
  {
    id: "delivery",
    feeds: "reporting",
    label: "Delivery",
    track: "output",
    summary: "The creative serves into the placement it was built for.",
    items: ["Ad serving", "Delivery"],
  },
  {
    id: "reporting",
    label: "Reporting",
    track: "output",
    summary: "Inventory, delivery and billing reporting, automated where it can be.",
    items: ["Inventory reporting", "Billing reporting", "Campaign reporting"],
  },
] as const;

/** Creative QA gate. Passing it is what "ready to traffic" means. */
export const creativeChecks = ["Dimensions", "File weight", "Format", "Click URL", "Tracking", "Naming", "Version", "Interactions"] as const;
export const readyState = "Ready to traffic";

/**
 * Standard advertising formats, drawn as abstract frames: a block for the
 * image, two for the message, one for the call to action. Specifications, not
 * client creative — nothing here reproduces anyone's advertising.
 */
export const creativeFormats = [
  { size: "300 × 250", w: 300, h: 250 },
  { size: "728 × 90", w: 728, h: 90 },
  { size: "160 × 600", w: 160, h: 600 },
  { size: "970 × 250", w: 970, h: 250 },
  { size: "Responsive", w: 480, h: 300 },
  { size: "Video 16:9", w: 640, h: 360 },
  { size: "Social 1:1", w: 600, h: 600 },
  { size: "Social 9:16", w: 540, h: 960 },
] as const;

/**
 * The creative QA gate as a specification sheet. Values are illustrative
 * examples of what is checked, shown against a single illustrative execution.
 */
export const creativeSpecSheet = [
  { field: "Dimensions", value: "300 × 250" },
  { field: "File weight", value: "Within spec" },
  { field: "Format", value: "HTML5" },
  { field: "Click URL", value: "Present" },
  { field: "Tracking", value: "Impression + click" },
  { field: "Naming", value: "To convention" },
  { field: "Version", value: "Latest" },
  { field: "Interactions", value: "Verified" },
] as const;

/** Abstract publisher inventory structure. No real publisher, section or placement. */
export const inventoryTree = [
  { level: 0, label: "Publisher", note: "Ad-server account" },
  { level: 1, label: "Section", note: "Homepage" },
  { level: 2, label: "Placement", note: "Top" },
  { level: 2, label: "Placement", note: "Inline" },
  { level: 1, label: "Section", note: "Article" },
  { level: 2, label: "Placement", note: "Sidebar" },
] as const;

/** Abstract ad-server view. Fictional rows: not a Trafficomm product and not client data. */
export const adServerRows = [
  { placement: "Homepage — top", creative: "970 × 250", tag: "Third-party", status: "Live" },
  { placement: "Article — inline", creative: "300 × 600", tag: "Hosted", status: "Ready" },
] as const;

/**
 * Creative format explorer data.
 *
 * Every group here is a format specification Trafficomm's approved Creative &
 * AdTech content already covers: standard IAB display, social placements,
 * video cuts, HTML5 builds and rich media in Celtra and Bonzai. The specimens
 * are abstract frames drawn to the real aspect ratio — no client creative, no
 * production volumes, no capability that is not already documented.
 *
 * Deliberately absent: dynamic creative / feed-driven production and
 * market-language adaptation. Nothing on the site documents either, so
 * neither is shown.
 */
export type Specimen = { size: string; w: number; h: number };

export type FormatGroup = {
  id: string;
  label: string;
  note: string;
  specimens?: readonly Specimen[];
  /** HTML5 only: the storyboard and the checks a package has to pass. */
  frames?: readonly string[];
  checks?: readonly string[];
  /** Rich media only: an abstract interactive execution. */
  interactive?: boolean;
};

export const formatGroups: readonly FormatGroup[] = [
  {
    id: "display",
    label: "Display",
    note: "Standard IAB sizes, built to each publisher's specification.",
    specimens: [
      { size: "300 × 250", w: 300, h: 250 },
      { size: "728 × 90", w: 728, h: 90 },
      { size: "160 × 600", w: 160, h: 600 },
      { size: "300 × 600", w: 300, h: 600 },
      { size: "320 × 50", w: 320, h: 50 },
    ],
  },
  {
    id: "social",
    label: "Social",
    note: "Canvases cut for paid social placements.",
    specimens: [
      { size: "1:1", w: 1080, h: 1080 },
      { size: "4:5", w: 1080, h: 1350 },
      { size: "9:16", w: 1080, h: 1920 },
    ],
  },
  {
    id: "video",
    label: "Video",
    note: "One edit, cut to the placement it runs in.",
    specimens: [
      { size: "16:9", w: 1920, h: 1080 },
      { size: "1:1", w: 1080, h: 1080 },
      { size: "9:16", w: 1080, h: 1920 },
    ],
  },
  {
    id: "html5",
    label: "HTML5",
    note: "Animated builds delivered as an HTML5 package the ad server can carry.",
    frames: ["Frame 01", "Frame 02", "Frame 03", "CTA"],
    checks: ["Dimensions", "File weight", "clickTag", "Backup image", "Tracking", "Platform spec"],
  },
  {
    id: "rich-media",
    label: "Rich media",
    note: "Interactive mobile executions built in Celtra and Bonzai.",
    interactive: true,
    specimens: [{ size: "Mobile", w: 1080, h: 1920 }],
  },
];

/** One master becomes the set of formats a plan actually needs. */
export const masterToFormats = ["300 × 250", "728 × 90", "160 × 600", "1:1", "9:16"] as const;

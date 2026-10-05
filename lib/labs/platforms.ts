/**
 * Platforms offered in the complexity step.
 *
 * Names only — the calculator never renders a platform's logo, so there is no
 * mark to distort and no implication of a partnership. The list mirrors the
 * platforms the site already documents operational experience on.
 */
export type LabsPlatform = { id: string; name: string; group: "Social" | "Search" | "Programmatic" | "Ad serving" | "Retail" };

export const LABS_PLATFORMS: LabsPlatform[] = [
  { id: "meta", name: "Meta", group: "Social" },
  { id: "tiktok", name: "TikTok", group: "Social" },
  { id: "snapchat", name: "Snapchat", group: "Social" },
  { id: "linkedin", name: "LinkedIn", group: "Social" },
  { id: "x", name: "X", group: "Social" },
  { id: "google-ads", name: "Google Ads", group: "Search" },
  { id: "youtube", name: "YouTube", group: "Search" },
  { id: "microsoft", name: "Microsoft Advertising", group: "Search" },
  { id: "dv360", name: "DV360", group: "Programmatic" },
  { id: "cm360", name: "CM360", group: "Ad serving" },
  { id: "amazon-ads", name: "Amazon Ads", group: "Retail" },
];

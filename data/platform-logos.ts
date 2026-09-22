/**
 * Platform marks, stored locally in /public/platforms.
 *
 * Every mark is displayed inside an identical light chip, so each brand's
 * official light-background variant is used as supplied — no recoloring.
 * `box` is the optical display size (px) inside a 56px chip: wide wordmarks
 * get more width, compact symbols less, so perceived weight is balanced.
 *
 * Marks indicate platform experience only. They do not imply partnership,
 * certification or endorsement.
 */
export type PlatformLogo = {
  src: string;
  alt: string;
  box: { w: number; h: number };
  source: string;
  note?: string;
};

export const platformLogos: Record<string, PlatformLogo> = {
  meta: {
    src: "/platforms/meta.svg",
    alt: "Meta",
    box: { w: 34, h: 24 },
    source: "https://www.meta.com (official site header lockup)",
    note: "Cropped to the Meta symbol; colors unchanged.",
  },
  "google-ads": {
    src: "/platforms/google-ads.svg",
    alt: "Google Ads",
    box: { w: 28, h: 28 },
    source: "https://www.gstatic.com/images/branding/productlogos/ads/v5/192px.svg",
  },
  tiktok: {
    src: "/platforms/tiktok.svg",
    alt: "TikTok",
    box: { w: 24, h: 24 },
    source: "Simple Icons (CC0) — official TikTok domains were unreachable from the build network",
    note: "PLACEHOLDER SOURCE: replace with the monochrome icon from TikTok's official brand portal.",
  },
  snapchat: {
    src: "/platforms/snapchat.svg",
    alt: "Snapchat",
    box: { w: 27, h: 27 },
    source: "https://snap.com/en-US/brand-guidelines (BLACK_SNAPCHAT_LOGO.svg)",
    note: "Cropped from the official lockup to the Ghost mark.",
  },
  x: {
    src: "/platforms/x.svg",
    alt: "X",
    box: { w: 22, h: 22 },
    source: "https://about.x.com/en/who-we-are/brand-toolkit (x-logo.zip)",
    note: "Black variant, matching logo-black.png in the official kit.",
  },
  linkedin: {
    src: "/platforms/linkedin.png",
    alt: "LinkedIn",
    box: { w: 26, h: 24 },
    source: "https://brand.linkedin.com/downloads (in-logo.zip, InBug-Black.png)",
  },
  dv360: {
    src: "/platforms/dv360.svg",
    alt: "Display & Video 360",
    box: { w: 28, h: 28 },
    source: "https://www.gstatic.com/images/branding/productlogos/display_and_video_360/v1/192px.svg",
  },
  cm360: {
    src: "/platforms/cm360.svg",
    alt: "Campaign Manager 360",
    box: { w: 28, h: 28 },
    source: "https://www.gstatic.com/images/branding/productlogos/campaign_manager/v6/192px.svg",
  },
  "search-ads-360": {
    src: "/platforms/search-ads-360.svg",
    alt: "Search Ads 360",
    box: { w: 27, h: 27 },
    source: "https://www.gstatic.com/images/branding/productlogos/search_ads_360/v5/192px.svg",
  },
  "amazon-ads": {
    src: "/platforms/amazon-ads.png",
    alt: "Amazon Ads",
    box: { w: 44, h: 16 },
    source: "https://advertising.amazon.com (official header logo, Amazon_Ads_Horizontal_SquidInk.png)",
  },
};

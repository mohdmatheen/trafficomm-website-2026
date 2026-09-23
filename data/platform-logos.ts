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
 *
 * Every mark here was taken from the owner's own site or brand resources and
 * is stored locally, never hotlinked. Two platforms in the ecosystem carry no
 * entry on purpose, because their owners' published terms do not permit a
 * third party to display the logo without written permission:
 *
 *   Microsoft Advertising — Microsoft's Trademark and Brand Guidelines state
 *     that its logos and product icons "can never be used without an express
 *     license", while permitting the wordmark in text. So the wordmark is the
 *     compliant treatment, and `PlatformMark` renders it as type.
 *   ChatGPT / OpenAI — OpenAI's Design Guidelines list using the logo "without
 *     permission" among the Don'ts and route logo requests to
 *     partnercomms@openai.com. Until that permission exists, type only.
 *
 * Neither is a missing file. Do not "fix" them by sourcing a mark elsewhere.
 *
 * Trademark and brand usage across every mark here remains a pre-launch legal
 * and brand review item.
 */
export type PlatformLogo = {
  src: string;
  alt: string;
  box: { w: number; h: number };
  source: string;
  note?: string;
  /**
   * Compact size (px) for inline "logo + name" use. Symbol marks share one
   * ~16px optical area; wordmarks are sized wider and stand in for the name.
   */
  inline: { w: number; h: number; wordmark?: boolean };
  /**
   * Size (px, in the hero diagram's own coordinate space) for the homepage
   * ecosystem nodes, where the mark has to be recognisable at a glance.
   *
   * These are normalised by optical weight, not by arithmetic: a square symbol
   * and a wide wordmark that look equally heavy carry very different numbers.
   * `wordmark` marks stand in for the name, so they get the pill's full width.
   */
  hero: { w: number; h: number; wordmark?: boolean };
  /**
   * The owner's guidelines permit a one-colour (monochrome) version of this
   * mark. Such marks sit neutral by default and reveal their supplied colours
   * on hover / focus / selection. Marks without this flag (Google product
   * logos) are always shown exactly as supplied. Black-variant assets (X,
   * Snapchat, LinkedIn, TikTok placeholder, Amazon Ads) are already neutral.
   */
  mono?: boolean;
};

export const platformLogos: Record<string, PlatformLogo> = {
  meta: {
    src: "/platforms/meta.svg",
    alt: "Meta",
    box: { w: 34, h: 24 },
    inline: { w: 26, h: 18 },
    hero: { w: 40, h: 28 },
    mono: true,
    source: "https://www.meta.com (official site header lockup)",
    note: "Cropped to the Meta symbol; colors unchanged.",
  },
  "google-ads": {
    src: "/platforms/google-ads.svg",
    alt: "Google Ads",
    box: { w: 28, h: 28 },
    inline: { w: 22, h: 22 },
    hero: { w: 30, h: 30 },
    source: "https://www.gstatic.com/images/branding/productlogos/ads/v5/192px.svg",
  },
  tiktok: {
    src: "/platforms/tiktok.svg",
    alt: "TikTok",
    box: { w: 23, h: 25 },
    inline: { w: 18, h: 20 },
    hero: { w: 27, h: 30 },
    source: "https://sf16-website.neutral.ttwstatic.com/obj/tiktok_web_static/tiktok/web/tiktok_web_pages/build/_assets/logo-dark-d62c3812fbf2f687daa9.svg (TikTok's own static CDN, as served to www.tiktok.com)",
    note: "Official full-colour note mark. Replaced the earlier Simple Icons placeholder; geometry and colours unchanged, metadata stripped.",
  },
  snapchat: {
    src: "/platforms/snapchat.svg",
    alt: "Snapchat",
    box: { w: 27, h: 27 },
    inline: { w: 22, h: 22 },
    hero: { w: 30, h: 30 },
    source: "https://snap.com/en-US/brand-guidelines (BLACK_SNAPCHAT_LOGO.svg)",
    note: "Cropped from the official lockup to the Ghost mark.",
  },
  x: {
    src: "/platforms/x.svg",
    alt: "X",
    box: { w: 22, h: 22 },
    inline: { w: 18, h: 18 },
    // The X mark is the name. Repeating "X" beside it read like a typo.
    hero: { w: 26, h: 26, wordmark: true },
    source: "https://about.x.com/en/who-we-are/brand-toolkit (x-logo.zip)",
    note: "Black variant, matching logo-black.png in the official kit.",
  },
  linkedin: {
    src: "/platforms/linkedin.png",
    alt: "LinkedIn",
    box: { w: 26, h: 24 },
    inline: { w: 20, h: 18 },
    hero: { w: 29, h: 27 },
    source: "https://brand.linkedin.com/downloads (in-logo.zip, InBug-Black.png)",
  },
  dv360: {
    src: "/platforms/dv360.svg",
    alt: "Display & Video 360",
    box: { w: 28, h: 28 },
    inline: { w: 22, h: 22 },
    hero: { w: 30, h: 30 },
    source: "https://www.gstatic.com/images/branding/productlogos/display_and_video_360/v1/192px.svg",
  },
  cm360: {
    src: "/platforms/cm360.svg",
    alt: "Campaign Manager 360",
    box: { w: 28, h: 28 },
    inline: { w: 22, h: 22 },
    hero: { w: 30, h: 30 },
    source: "https://www.gstatic.com/images/branding/productlogos/campaign_manager/v6/192px.svg",
  },
  "search-ads-360": {
    src: "/platforms/search-ads-360.svg",
    alt: "Search Ads 360",
    box: { w: 27, h: 27 },
    inline: { w: 22, h: 22 },
    hero: { w: 29, h: 29 },
    source: "https://www.gstatic.com/images/branding/productlogos/search_ads_360/v5/192px.svg",
  },
  "amazon-ads": {
    src: "/platforms/amazon-ads.png",
    alt: "Amazon Ads",
    box: { w: 44, h: 16 },
    inline: { w: 76, h: 19, wordmark: true },
    hero: { w: 92, h: 24, wordmark: true },
    source: "https://advertising.amazon.com (official header logo, Amazon_Ads_Horizontal_SquidInk.png)",
  },
  noon: {
    src: "/platforms/noon.svg",
    alt: "noon",
    box: { w: 42, h: 12 },
    inline: { w: 62, h: 17, wordmark: true },
    hero: { w: 78, h: 21, wordmark: true },
    source: "https://login.noon.partners/en (noon's own partner portal, header wordmark)",
    note: "Official one-colour wordmark as supplied (#090909); geometry and colour unchanged.",
  },
  talabat: {
    src: "/platforms/talabat.svg",
    alt: "talabat",
    box: { w: 46, h: 16 },
    inline: { w: 64, h: 22, wordmark: true },
    hero: { w: 78, h: 26, wordmark: true },
    source: "https://www.talabat.com/assets/images/remix-logo.svg (talabat.com header lockup)",
    note: "Official orange lockup as supplied; geometry and colours unchanged, metadata stripped.",
  },
};

/**
 * Whether an official mark exists that Trafficomm may display. False means the
 * owner's published terms require permission we do not have, so the UI shows
 * the platform's name as type instead — see the note above.
 */
export const hasPlatformMark = (slug: string) => slug in platformLogos;

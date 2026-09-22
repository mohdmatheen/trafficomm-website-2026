/** Pages under regression coverage. */
export const pages = [
  { name: "home", path: "/" },
  { name: "ad-operations", path: "/services/ad-operations" },
  { name: "performance-marketing", path: "/services/performance-marketing" },
  { name: "programmatic", path: "/services/programmatic" },
  { name: "measurement", path: "/services/measurement" },
  { name: "reporting", path: "/services/reporting" },
  { name: "creative-adtech", path: "/services/creative-adtech" },
  { name: "media-agencies", path: "/solutions/media-agencies" },
  { name: "white-label", path: "/solutions/white-label-ad-operations" },
  { name: "publishers-adtech", path: "/solutions/publishers-adtech" },
  { name: "case-studies", path: "/case-studies" },
  { name: "case-mena", path: "/case-studies/mena-agency-ad-operations" },
  { name: "how-we-work", path: "/how-we-work" },
  { name: "about", path: "/about" },
  { name: "insights", path: "/insights" },
  { name: "platforms", path: "/platforms" },
  { name: "platform-dv360", path: "/platforms/dv360" },
  { name: "contact", path: "/contact" },
] as const;

/** Scroll the whole page so lazy images and viewport-triggered content load. */
export async function scrollThrough(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

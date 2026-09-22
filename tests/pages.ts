/** Pages under regression coverage. */
export const pages = [
  { name: "home", path: "/" },
  { name: "ad-operations", path: "/services/ad-operations" },
  { name: "performance-marketing", path: "/services/performance-marketing" },
  { name: "programmatic", path: "/services/programmatic" },
  { name: "measurement", path: "/services/measurement" },
  { name: "reporting", path: "/services/reporting" },
  { name: "creative-adtech", path: "/services/creative-adtech" },
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

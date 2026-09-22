import { expect, test } from "@playwright/test";
import { pages, scrollThrough } from "./pages";

/**
 * Screenshot regression. Runs with reduced motion so every visualization is
 * in its deterministic resting state. Pages are captured in clipped segments
 * (Chromium full-page captures degrade past ~16k px).
 * Baselines live in tests/__screenshots__ (git-ignored; regenerate locally
 * with `npm run test:visual:update`).
 */
test.use({ reducedMotion: "reduce" });

const SEGMENT = 3000;

for (const p of pages) {
  test(`visual: ${p.name}`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: "networkidle" });
    await scrollThrough(page);
    await page.waitForLoadState("networkidle");
    const { width, height } = await page.evaluate(() => ({ width: document.documentElement.clientWidth, height: document.documentElement.scrollHeight }));
    for (let y = 0, i = 0; y < height; y += SEGMENT, i++) {
      await expect(page).toHaveScreenshot(`${p.name}-${String(i).padStart(2, "0")}.png`, {
        fullPage: true,
        clip: { x: 0, y, width, height: Math.min(SEGMENT, height - y) },
      });
    }
  });
}

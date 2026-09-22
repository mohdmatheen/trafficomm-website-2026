import { expect, test } from "@playwright/test";
import { pages, scrollThrough } from "./pages";

/** Structural and runtime health for every page at every width (normal motion). */
for (const p of pages) {
  test(`quality: ${p.name}`, async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") problems.push(`${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));

    const res = await page.goto(p.path, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    await scrollThrough(page);
    await page.waitForLoadState("networkidle");

    const report = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll("h1").length,
      heroes: document.querySelectorAll("main h1").length,
      lastIsFooter: [...document.body.children].filter((e) => !["SCRIPT", "NEXT-ROUTE-ANNOUNCER"].includes(e.tagName)).pop()?.tagName === "FOOTER",
      brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      dom: document.getElementsByTagName("*").length,
    }));

    expect(problems, "console errors / warnings").toEqual([]);
    expect(report.overflow, "horizontal overflow (px)").toBeLessThanOrEqual(0);
    expect(report.h1).toBe(1);
    expect(report.lastIsFooter, "page ends with the footer").toBe(true);
    expect(report.brokenImages).toEqual([]);
    expect(report.dom, "DOM element budget").toBeLessThan(2500);
  });
}

import { expect, test } from "@playwright/test";

const desktop = (w: number) => w >= 1024;

test.describe("homepage interactions", () => {
  test("capability explorer switches workflow (click + keyboard) or opens accordion", async ({ page, viewport }) => {
    await page.goto("/");
    if (desktop(viewport!.width)) {
      const tab = page.getByRole("tab", { name: /Programmatic Operations/ });
      await tab.click();
      await expect(page.getByRole("tabpanel").filter({ hasText: "Operating workflow" })).toContainText("PROG");
      await tab.press("ArrowDown");
      await expect(page.getByRole("tab", { name: /Measurement & Analytics/ })).toHaveAttribute("aria-selected", "true");
    } else {
      const btn = page.getByRole("button", { name: /Performance Marketing/ }).first();
      await btn.click();
      await expect(btn).toHaveAttribute("aria-expanded", "true");
    }
  });

  test("platform ecosystem responds to keyboard / tap", async ({ page, viewport }) => {
    await page.goto("/");
    if (desktop(viewport!.width)) {
      const meta = page.getByRole("tab", { name: "Meta" });
      await meta.focus();
      await meta.press("ArrowRight");
      await expect(page.getByRole("tab", { name: "Google Ads" })).toHaveAttribute("aria-selected", "true");
    } else {
      const dv = page.getByRole("button", { name: /DV360/ });
      await dv.click();
      await expect(dv).toHaveAttribute("aria-expanded", "true");
    }
  });

  test("operating engine pins on desktop only", async ({ page, viewport }) => {
    await page.goto("/");
    await page.locator("#engine-title").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const pinned = await page.locator(".pin-spacer").count();
    expect(pinned > 0).toBe(desktop(viewport!.width));
  });

  test("mobile menu opens and closes with Escape", async ({ page, viewport }) => {
    test.skip(viewport!.width >= 1280, "desktop navigation is always visible");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Site menu" })).toHaveCount(0);
  });
});

test.describe("ad operations lifecycle", () => {
  test("click selects a stage independently of scroll", async ({ page, viewport }) => {
    test.skip(!desktop(viewport!.width), "desktop rail");
    await page.goto("/services/ad-operations");
    const stage = page.getByRole("tab", { name: /Campaign QA/ });
    await stage.click();
    await expect(stage).toHaveAttribute("aria-selected", "true");
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(400);
    await expect(stage).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no pinning, static final states", async ({ page }) => {
    await page.goto("/");
    await page.locator("#engine-title").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    // Revealed content is visible without scrolling into view.
    const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length);
    expect(hidden).toBe(0);
  });
});

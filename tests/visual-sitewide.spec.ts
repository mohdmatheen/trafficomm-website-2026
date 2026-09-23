import { expect, test, type Page } from "@playwright/test";

/**
 * Site-wide visual storytelling pass: the service and solution mega-menus,
 * the homepage service explorer, the creative format explorer, evidence-led
 * case cards and the platform object chains.
 *
 * These assert what the visuals promise — that the formats are drawn to their
 * real proportions, that illustrative work is labelled, that nothing claims an
 * outcome — not pixel positions.
 */

const desktopNav = (w: number) => w >= 1280;

test.describe("services mega-menu", () => {
  test("shows all six capabilities with a miniature of each", async ({ page, viewport }) => {
    test.skip(!desktopNav(viewport!.width), "desktop navigation");
    await page.goto("/case-studies");
    await page.getByRole("button", { name: "Services" }).click();
    const panel = page.locator("nav[aria-label=Primary] div[id]").filter({ hasText: "All services" }).first();
    for (const name of ["Ad Operations", "Performance Marketing", "Programmatic Operations", "Measurement & Analytics", "Reporting & Insights", "Creative & AdTech"]) {
      await expect(panel.getByRole("link", { name: new RegExp(name.replace(/&/g, "&")) }).first()).toBeVisible();
    }
    // Each link carries a decorative glyph — never a second announcement of the name.
    const hidden = await panel.locator("[aria-hidden=true]").count();
    expect(hidden).toBeGreaterThanOrEqual(6);
  });

  test("closes with Escape and is reachable from the keyboard", async ({ page, viewport }) => {
    test.skip(!desktopNav(viewport!.width), "desktop navigation");
    await page.goto("/case-studies");
    const trigger = page.getByRole("button", { name: "Services" });
    await trigger.focus();
    await trigger.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("solutions read as organisational models, not services", async ({ page, viewport }) => {
    test.skip(!desktopNav(viewport!.width), "desktop navigation");
    await page.goto("/case-studies");
    await page.getByRole("button", { name: "Solutions" }).click();
    const panel = page.locator("nav[aria-label=Primary] div[id]").filter({ hasText: "All solutions" }).first();
    for (const name of ["For Media Agencies", "For Performance Agencies", "For Brands", "For Publishers & AdTech", "White-Label Ad Operations"]) {
      await expect(panel.getByRole("link", { name: new RegExp(name) }).first()).toBeVisible();
    }
  });

  test("mobile navigation lists the same capabilities with 44px targets", async ({ page, viewport }) => {
    test.skip(desktopNav(viewport!.width), "mobile navigation");
    await page.goto("/case-studies");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await dialog.getByRole("button", { name: "Services" }).click();
    const link = dialog.getByRole("link", { name: "Ad Operations" });
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("homepage service explorer", () => {
  const explorer = (page: Page) => page.locator("section[aria-labelledby=services-title]");

  test("six capabilities, each with its own operating model", async ({ page }) => {
    await page.goto("/");
    const tabs = explorer(page).getByRole("tab");
    await expect(tabs).toHaveCount(6);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await expect(explorer(page).getByRole("tabpanel")).toContainText("Brief");

    await tabs.nth(2).click();
    await expect(explorer(page).getByRole("tabpanel")).toContainText("DV360");
    await expect(explorer(page).getByRole("tabpanel").getByRole("link", { name: /Programmatic Operations/ })).toHaveAttribute("href", "/services/programmatic");
  });

  test("arrow keys move between capabilities", async ({ page }) => {
    await page.goto("/");
    const tabs = explorer(page).getByRole("tab");
    await tabs.first().click();
    await tabs.first().press("ArrowDown");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  });

  test("capability targets are at least 44px", async ({ page }) => {
    await page.goto("/");
    const box = await explorer(page).getByRole("tab").first().boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("creative format explorer", () => {
  const panel = (page: Page) => page.locator("section[aria-labelledby=fmt-title] [role=tabpanel]");

  test("formats are drawn to their real proportions", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    const fig = panel(page).locator("figure").filter({ hasText: "728 × 90" }).locator("div").first();
    const box = await fig.boundingBox();
    expect(box!.width / box!.height).toBeGreaterThan(6);

    const square = panel(page).locator("figure").filter({ hasText: "160 × 600" }).locator("div").first();
    const sb = await square.boundingBox();
    expect(sb!.height / sb!.width).toBeGreaterThan(3);
  });

  test("every group is labelled illustrative and none is invented", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    const section = page.locator("section[aria-labelledby=fmt-title]");
    await expect(section.getByText("Illustrative creative specimens", { exact: true })).toBeVisible();
    for (const g of ["Display", "Social", "Video", "HTML5", "Rich media"]) {
      await expect(section.getByRole("tab", { name: g })).toBeVisible();
    }
    // Dynamic creative is not documented anywhere on the site, so it is not offered.
    await expect(section.getByRole("tab", { name: "Dynamic" })).toHaveCount(0);
  });

  test("HTML5 shows the storyboard and the package checks", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    await page.locator("section[aria-labelledby=fmt-title]").getByRole("tab", { name: "HTML5" }).click();
    await expect(panel(page)).toContainText("Frame 01");
    await expect(panel(page)).toContainText("clickTag");
    await expect(panel(page)).toContainText("Backup image");
  });

  test("rich media names the platforms Trafficomm actually builds in", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    await page.locator("section[aria-labelledby=fmt-title]").getByRole("tab", { name: "Rich media" }).click();
    await expect(panel(page)).toContainText("Celtra and Bonzai");
  });
});

test.describe("evidence and objects", () => {
  test("case cards lead with a documented figure", async ({ page }) => {
    await page.goto("/case-studies");
    const first = page.getByRole("link", { name: /From 4 Specialists/ }).first();
    await expect(first).toContainText("4 → ~30");
    await expect(first).toContainText("Historical team scale");
    // The figure is never presented as current headcount.
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/~30 (today|now|current)/i);
  });

  test("platform pages show the platform's own objects", async ({ page }) => {
    await page.goto("/platforms/meta");
    const ops = page.locator("section[aria-labelledby=ops-title]");
    await expect(ops).toContainText("Meta objects");
    for (const o of ["Campaign", "Ad set", "Ad", "Pixel / CAPI"]) {
      await expect(ops.getByText(o, { exact: true }).first()).toBeVisible();
    }
    await page.goto("/platforms/dv360");
    await expect(page.locator("section[aria-labelledby=ops-title]")).toContainText("Insertion order");
    // Platforms whose object model is not stated on the site carry no chain.
    await page.goto("/platforms/amazon-ads");
    await expect(page.locator("section[aria-labelledby=ops-title]")).not.toContainText("objects");
  });

  test("solution pages show where Trafficomm sits", async ({ page }) => {
    await page.goto("/solutions/white-label-ad-operations");
    const model = page.locator("section[aria-labelledby=model-title]");
    await expect(model.getByText("Where Trafficomm sits", { exact: true })).toBeVisible();
    await expect(model).toContainText("Your agency");
    await expect(model).toContainText("Your brand in front, Trafficomm behind it");
  });
});

test.describe("site-wide safety", () => {
  const pages = ["/", "/case-studies", "/services/creative-adtech", "/solutions/media-agencies", "/platforms/meta"];

  test("no page invents an outcome", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p);
      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(/\b(uplift|increased?|improved?|reduced?|saved)\b[^.]{0,20}\b\d+\s?%/i);
      expect(text).not.toMatch(/\b\d+\s?% (increase|uplift|improvement|reduction|saving)/i);
    }
  });

  test("no horizontal overflow on the changed pages", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p);
      const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(over, p).toBe(false);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the explorers are fully usable with motion off", async ({ page }) => {
    await page.goto("/");
    const tabs = page.locator("section[aria-labelledby=services-title]").getByRole("tab");
    await tabs.nth(5).click();
    await expect(page.locator("section[aria-labelledby=services-title]").getByRole("tabpanel")).toContainText("Creative & AdTech");

    await page.goto("/services/creative-adtech");
    await expect(page.locator("section[aria-labelledby=fmt-title] [role=tabpanel]")).toContainText("Standard IAB sizes");
  });
});

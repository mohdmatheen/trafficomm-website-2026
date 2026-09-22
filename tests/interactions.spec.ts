import { expect, test } from "@playwright/test";

const desktop = (w: number) => w >= 1024;

test.describe("homepage interactions", () => {
  test("capability explorer switches workflow (click + keyboard) or opens accordion", async ({ page, viewport }) => {
    await page.goto("/");
    if (desktop(viewport!.width)) {
      const tab = page.getByRole("tab", { name: /Programmatic Operations/ });
      await tab.click();
      await expect(page.getByRole("tabpanel").filter({ hasText: "Operating workflow" })).toContainText("DV360 structure");
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
      const dv = page.locator("button[aria-expanded]").filter({ hasText: "DV360" });
      await dv.click();
      await expect(dv).toHaveAttribute("aria-expanded", "true");
    }
  });

  test("hero ecosystem: logo + name nodes trace a path (hover/keyboard) or tap list on mobile", async ({ page, viewport }) => {
    await page.goto("/");
    const hero = page.locator("section[aria-labelledby=hero-title]");
    if (viewport!.width >= 640) {
      const meta = hero.getByRole("button", { name: /^Meta: trace its signal/ });
      await expect(meta).toBeVisible();
      // Every platform node carries its official mark and a text name.
      await expect(hero.locator("svg[role=group] g[role=button] image")).toHaveCount(11); // 10 marks + Meta's neutral layer
      await meta.focus();
      await expect(meta.locator("rect").first()).toHaveAttribute("stroke", "#ea3e3a");
      await expect(hero.locator(".sm\\:hidden")).toBeHidden();
    } else {
      await expect(hero.locator("svg[role=group]")).toBeHidden();
      const btn = hero.getByRole("button", { name: "DV360", exact: true });
      const box = await btn.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      await btn.click();
      await expect(btn).toHaveAttribute("aria-pressed", "true");
      await expect(hero.getByText("DV360 → Trafficomm operations layer")).toBeVisible();
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

test.describe("conversion & content", () => {
  test("honeypot is not visible or focusable", async ({ page }) => {
    await page.goto("/contact");
    const hp = page.locator("#contact-website");
    const box = await hp.evaluate((el) => {
      const r = el.parentElement!.getBoundingClientRect();
      return { area: r.width * r.height, opacity: getComputedStyle(el.parentElement!).opacity, inert: el.parentElement!.inert, tab: (el as HTMLInputElement).tabIndex };
    });
    expect(box.area).toBeLessThanOrEqual(1);
    expect(box.opacity).toBe("0");
    expect(box.inert).toBe(true);
    expect(box.tab).toBe(-1);
    // Not exposed to assistive technology.
    await expect(page.getByRole("textbox", { name: /leave this field/i })).toHaveCount(0);
    await expect(page.getByText("Your enquiry and operational information are treated confidentially.")).toBeVisible();
    await expect(page.getByText("Client identity withheld")).toHaveCount(0);
  });

  test("Performance Lab lists only non-empty formats", async ({ page }) => {
    await page.goto("/insights");
    const counts = await page.getByRole("list", { name: "Content formats" }).locator("li span").allTextContents();
    expect(counts.length).toBeGreaterThan(0);
    for (const c of counts) expect(Number(c)).toBeGreaterThan(0);
  });

  test("no internal module labels or current-headcount phrasing", async ({ page }) => {
    for (const path of ["/services", "/services/programmatic", "/case-studies/mena-agency-ad-operations", "/"]) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(/\bMOD \d|Functions\s*\d|Today · ~30|~30 today/i);
    }
  });
});

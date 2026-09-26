import { expect, test } from "@playwright/test";

const desktop = (w: number) => w >= 1024;

test.describe("homepage interactions", () => {
  /**
   * The homepage capability explorer now shows each service's supplied
   * illustration instead of a miniature built from stage labels, so the panel
   * no longer contains words like "Plan". The guarantee under test is
   * unchanged: selecting a capability changes the panel to that capability,
   * and the keyboard moves between capabilities. What the panel must carry is
   * the service's own caption, its summary and a link to its page.
   */
  test("service explorer switches capability (click + keyboard)", async ({ page }) => {
    await page.goto("/");
    const explorer = page.locator("section[aria-labelledby=services-title]");
    const tab = explorer.getByRole("tab", { name: /Programmatic Operations/ });
    await tab.click();
    const panel = explorer.getByRole("tabpanel");
    await expect(panel).toContainText("DV360");
    await expect(panel).toContainText("Bid, scan inventory, win the impression");
    await expect(panel.locator("img")).toHaveAttribute("src", "/illustrations/services/programmatic.svg");
    await expect(panel.getByRole("link", { name: /Programmatic Operations/ })).toHaveAttribute("href", "/services/programmatic");
    await tab.press("ArrowDown");
    await expect(explorer.getByRole("tab", { name: /Measurement & Analytics/ })).toHaveAttribute("aria-selected", "true");
  });

  // The platform network moved off the homepage with the rest of the Platforms
  // surface; it still ships on /platforms, which is where it is now exercised.
  test("platform ecosystem responds to keyboard / tap", async ({ page, viewport }) => {
    await page.goto("/platforms");
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
      // Every platform we may legitimately show a mark for carries it. Microsoft
      // Advertising and ChatGPT carry none — their owners require permission we
      // do not have — so they are named in type instead (see platform-logos.ts).
      await expect(hero.locator("svg[role=group] g[role=button] image")).toHaveCount(13); // 12 marks + Meta's neutral layer
      for (const named of ["Microsoft Advertising", "ChatGPT"]) {
        await expect(hero.getByRole("button", { name: new RegExp(`^${named}: trace its signal`) })).toBeVisible();
      }
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

  // The operating engine left the homepage in the final pass — the service pages and the
  // homepage service explorer already carry the lifecycle — and now lives on /services.
  // Same component, same guarantee: it pins on desktop and never on a phone.
  test("operating engine pins on desktop only", async ({ page, viewport }) => {
    await page.goto("/services");
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
  // The scroll-linked lifecycle explorer was replaced by the campaign pipeline
  // (visual storytelling prototype). Same guarantee, new component: a stage the
  // visitor selects stays selected, and scrolling never moves it for them.
  test("selecting a stage pins it against scroll and the auto sequence", async ({ page, viewport }) => {
    test.skip(!desktop(viewport!.width), "desktop rail");
    await page.goto("/services/ad-operations");
    const stage = page.locator("div.hidden.lg\\:block ol[role=tablist]").first().getByRole("tab", { name: /Validate/ });
    await stage.click();
    await expect(stage).toHaveAttribute("aria-selected", "true");
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(2200);
    await expect(stage).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no pinning, static final states", async ({ page }) => {
    // Pinning is checked where the engine now lives; the reveal check stays on the homepage.
    await page.goto("/services");
    await page.locator("#engine-title").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await page.goto("/");
    await page.waitForTimeout(400);
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

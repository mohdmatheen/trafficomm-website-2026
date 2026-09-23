import { expect, test, type Page } from "@playwright/test";

/**
 * Pre-launch pass: the header descriptor, an open-ended platform ecosystem,
 * distinguishable solution glyphs, the honest team metric, and the simplified
 * assessment form.
 *
 * These protect commitments that are easy to undo by accident — a platform
 * count creeping back into a heading, the team figure losing its qualifier, a
 * qualification field returning to the form.
 */

const desktopNav = (w: number) => w >= 1280;

test.describe("header", () => {
  test("the wordmark carries a positioning descriptor without announcing it twice", async ({ page, viewport }) => {
    await page.goto("/");
    const home = page.locator("header").getByRole("link", { name: "Trafficomm — home" });
    await expect(home).toBeVisible();
    // The descriptor is visible from 420px up; below that the bar keeps the mark alone.
    const descriptor = home.getByText("Performance Operations Partner", { exact: true });
    await expect(descriptor).toHaveCount(1);
    if (viewport!.width >= 420) await expect(descriptor).toBeVisible();
    else await expect(descriptor).toBeHidden();
  });

  test("the descriptor does not push the bar taller or wider", async ({ page }) => {
    await page.goto("/");
    const bar = page.locator("header .container-site").first();
    const box = await bar.boundingBox();
    expect(box!.height).toBeLessThanOrEqual(74);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});

test.describe("platform ecosystem is open-ended", () => {
  const surfaces = ["/", "/platforms", "/platforms/meta", "/services/programmatic", "/contact"];

  test("no page fixes the number of platforms", async ({ page }) => {
    for (const path of surfaces) {
      await page.goto(path);
      const text = await page.locator("body").innerText();
      expect(text, path).not.toMatch(/\b(ten|10)[\s-]+platforms\b/i);
    }
  });

  test("the homepage ring holds the whole ecosystem, marked or lettered", async ({ page, viewport }) => {
    await page.goto("/");
    const section = page.locator("section[aria-labelledby=platforms-title]");
    for (const name of ["Meta", "Amazon Ads", "Microsoft Advertising", "Noon", "Talabat", "ChatGPT"]) {
      await expect(section.getByText(name, { exact: true }).first(), name).toBeVisible();
    }
    await expect(section).toContainText("Across major advertising, commerce and delivery platforms");
    await expect(section).toContainText("not an exhaustive list");
    // Desktop nodes are tabs; the mobile composition is a disclosure list.
    if (viewport!.width >= 1024) await expect(section.getByRole("tab")).toHaveCount(14);
  });

  test("platforms without a documented page are named, never linked to one", async ({ page }) => {
    await page.goto("/platforms");
    for (const slug of ["chatgpt", "noon", "talabat", "microsoft-advertising"]) {
      await expect(page.locator(`a[href="/platforms/${slug}"]`), slug).toHaveCount(0);
    }
    await expect(page.getByText("Also operated", { exact: true })).toBeVisible();
    await expect(page.getByText("Microsoft Advertising (Bing)", { exact: true }).first()).toBeVisible();
    // A page that does not exist must not be reachable.
    expect((await page.request.get("/platforms/chatgpt")).status()).toBe(404);
  });

  test("Bing is shown as recognition only, never as the current product name", async ({ page }) => {
    await page.goto("/platforms");
    const text = await page.locator("main").innerText();
    expect(text).toContain("Microsoft Advertising");
    // "Bing" only ever appears inside the bracketed recognition form.
    for (const m of text.matchAll(/Bing/g)) {
      expect(text.slice(Math.max(0, m.index! - 24), m.index! + 5)).toContain("Microsoft Advertising (");
    }
  });

  test("no platform is claimed as a partnership or certification", async ({ page }) => {
    for (const path of ["/", "/platforms"]) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      expect(text, path).not.toMatch(/\b(official|certified|preferred|authoriz(ed|ing))\s+(partner|reseller|agency)\b/i);
      expect(text, path).toContain("do not imply partnership, certification or endorsement");
    }
  });
});

test.describe("solutions are visually distinguishable", () => {
  test("the five menu glyphs are five different shapes", async ({ page, viewport }) => {
    test.skip(!desktopNav(viewport!.width), "desktop navigation");
    await page.goto("/case-studies");
    await page.getByRole("button", { name: "Solutions" }).click();
    const panel = page.locator("nav[aria-label=Primary] div[id]").filter({ hasText: "All solutions" }).first();
    // A glyph's structure — its element shape, not its text — is its identity.
    // The menu wraps each glyph in a sizing span, so the glyph root is one level in.
    const shapes = await panel.locator("li a > span > span[aria-hidden=true]").evaluateAll((els) =>
      els.map((el) => [...el.querySelectorAll("*")].map((n) => `${n.tagName}:${(n as HTMLElement).className}`).join("|")),
    );
    expect(shapes).toHaveLength(5);
    expect(new Set(shapes).size, "every solution glyph is distinct").toBe(5);
  });

  test("each solution page states where Trafficomm sits, in its own words", async ({ page }) => {
    const captions: Record<string, string> = {
      "media-agencies": "Agency → Trafficomm operations → platforms",
      "performance-agencies": "Strategy → Trafficomm execution → client KPI → back again",
      brands: "Brand team, extended by Trafficomm → ad platforms",
      "publishers-adtech": "Inventory → Trafficomm operations → ad server",
      "white-label-ad-operations": "Your brand in front, Trafficomm behind it",
    };
    for (const [slug, caption] of Object.entries(captions)) {
      await page.goto(`/solutions/${slug}`);
      await expect(page.locator("section[aria-labelledby=model-title]"), slug).toContainText(caption);
    }
  });
});

test.describe("the team figure stays historical", () => {
  test("70+ never appears without its qualifier", async ({ page }) => {
    for (const path of ["/", "/about", "/services/ad-operations"]) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      if (!text.includes("70+")) continue;
      expect(text, path).toContain("Peak historical team size");
      expect(text, path).not.toMatch(/70\+\s*(current|today|employees on)/i);
      expect(text, path).not.toMatch(/currently 70\+|70\+ current employees/i);
    }
  });

  test("no structured data turns the figure into a headcount", async ({ page }) => {
    await page.goto("/about");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const b of blocks) {
      expect(b).not.toContain("numberOfEmployees");
      expect(b).not.toContain("employee");
    }
  });
});

test.describe("assessment form", () => {
  const form = (page: Page) => page.locator("form").first();

  test("asks five things and nothing else", async ({ page }) => {
    await page.goto("/contact");
    for (const label of ["Name", "Company", "Work email", "Campaign volume (per month)", "Biggest operational challenge"]) {
      // Optional fields carry a hint inside the label, so the accessible name is a superset.
      await expect(form(page).getByLabel(new RegExp(`^${label.replace(/[()]/g, "\\$&")}`)), label).toBeVisible();
    }
    // The qualification chip grids are gone — not hidden, gone.
    await expect(form(page).getByRole("group")).toHaveCount(0);
    await expect(form(page).getByRole("checkbox")).toHaveCount(0);
    await expect(page.getByText("Market(s)", { exact: true })).toHaveCount(0);
    // The honeypot is the only remaining input beyond the five fields.
    const named = await form(page).locator("input, select, textarea").count();
    expect(named).toBe(6);
  });

  test("validates, and the server accepts the simplified payload", async ({ page }) => {
    await page.goto("/contact");
    await form(page).getByRole("button", { name: /Request an Operations Assessment/ }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Select your monthly campaign volume.")).toBeVisible();

    const res = await page.request.post("/api/assessment", {
      data: { name: "Ada Lovelace", company: "Analytical Engines", email: "ada@engines.co", volume: "25–50", challenge: "QA bottlenecks", intent: "assessment" },
    });
    // Accepted (200) when a delivery webhook is configured; without one a
    // production build refuses loudly (503) rather than dropping the lead. What
    // must never happen is a validation failure over the removed fields.
    expect([200, 503]).toContain(res.status());
    expect((await res.json()).errors).toBeUndefined();
  });

  test("a submission with no market or platform values passes validation", async ({ page }) => {
    await page.goto("/contact");
    const res = await page.request.post("/api/assessment", {
      data: { name: "Ada Lovelace", company: "Analytical Engines", email: "ada@engines.co", volume: "250+", intent: "call" },
    });
    expect(res.status()).not.toBe(422);
    expect((await res.json()).errors).toBeUndefined();
  });

  test("the honeypot still absorbs bots silently", async ({ page }) => {
    await page.goto("/contact");
    const res = await page.request.post("/api/assessment", {
      data: { name: "Bot", company: "Bots", email: "bot@bots.co", volume: "250+", website: "http://spam", intent: "assessment" },
    });
    expect(res.status()).toBe(200);
    // Accepted, but never forwarded.
    expect((await res.json()).delivered).toBeUndefined();
  });
});

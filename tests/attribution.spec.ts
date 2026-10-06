import { expect, test, type Page } from "@playwright/test";
import { sanitizeAttribution, STORAGE_KEY, type Attribution } from "../lib/attribution";

/**
 * First-touch attribution.
 *
 * The behaviour under test is the one the old implementation got wrong: a
 * campaign click that lands on one page and converts on another. Reading UTMs
 * from the URL at submit time passed every test that landed and converted on the
 * same page, and lost the campaign for every real visitor who read something
 * first.
 *
 * Pinned to one project: what a visit remembers does not depend on how wide the
 * window is, and the responsive behaviour of these pages is already covered.
 */

const LANDING = "/ad-operations-outsourcing?utm_source=linkedin&utm_medium=paid_social&utm_campaign=uae-adops-q4&utm_content=carousel-a&li_fat_id=AbC-123_xyz";

const stored = (page: Page) =>
  page.evaluate((key) => {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  }, STORAGE_KEY);

test.describe("first touch survives navigation", () => {
  test("a LinkedIn-style landing URL is still attached after browsing to /contact", async ({ page }) => {
    await page.goto(LANDING);
    const atLanding = await stored(page);
    expect(atLanding?.utm?.campaign).toBe("uae-adops-q4");
    expect(atLanding?.landingPath).toBe("/ad-operations-outsourcing");
    expect(atLanding?.liFatId).toBe("AbC-123_xyz");

    // Two hops with no campaign parameters anywhere — the case that used to lose it.
    await page.goto("/insights/uae-digital-advertising-operations");
    await page.goto("/contact");

    const atConversion = await stored(page);
    expect(atConversion?.utm?.source).toBe("linkedin");
    expect(atConversion?.utm?.medium).toBe("paid_social");
    expect(atConversion?.utm?.campaign).toBe("uae-adops-q4");
    expect(atConversion?.utm?.content).toBe("carousel-a");
    expect(atConversion?.liFatId).toBe("AbC-123_xyz");
    // Still the page they arrived on, not the page they converted on.
    expect(atConversion?.landingPath).toBe("/ad-operations-outsourcing");
    expect(atConversion?.firstTouchAt).toBe(atLanding?.firstTouchAt);
  });

  test("a later page cannot overwrite the first touch", async ({ page }) => {
    await page.goto(LANDING);
    const first = await stored(page);
    // A second campaign parameter set mid-visit must not rewrite the attribution.
    await page.goto("/contact?utm_source=google&utm_campaign=something-else");
    const after = await stored(page);
    expect(after?.utm?.source).toBe("linkedin");
    expect(after?.utm?.campaign).toBe("uae-adops-q4");
    expect(after?.firstTouchAt).toBe(first?.firstTouchAt);
  });

  test("an organic visit stores no campaign and invents no click id", async ({ page }) => {
    await page.goto("/contact");
    const a = await stored(page);
    expect(a).not.toBeNull();
    expect(a?.utm, "no UTMs were present, so none may be recorded").toBeUndefined();
    expect(a?.liFatId, "li_fat_id must never be fabricated").toBeUndefined();
    expect(a?.landingPath).toBe("/contact");
  });

  test("a li_fat_id arriving later in the visit is added without rewriting the campaign", async ({ page }) => {
    await page.goto("/contact?utm_source=newsletter");
    await page.goto("/?li_fat_id=LateClick99");
    const a = await stored(page);
    expect(a?.utm?.source, "the original campaign stands").toBe("newsletter");
    expect(a?.landingPath).toBe("/contact");
    expect(a?.liFatId, "but the click id is real and worth keeping").toBe("LateClick99");
  });

  test("the attribution never reaches the dataLayer", async ({ page }) => {
    await page.goto(LANDING);
    await page.waitForTimeout(400);
    const dl = await page.evaluate(() => JSON.stringify((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []));
    expect(dl).not.toContain("uae-adops-q4");
    expect(dl).not.toContain("AbC-123_xyz");
    expect(dl).not.toContain("utm_");
  });
});

test.describe("the assessment form attaches first touch", () => {
  test("the submitted payload carries the landing campaign, not the conversion URL", async ({ page }) => {
    await page.goto(LANDING);
    await page.goto("/contact");

    let body: Record<string, unknown> | null = null;
    await page.route("**/api/assessment", async (route) => {
      body = JSON.parse(route.request().postData() ?? "{}");
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, delivered: true }) });
    });

    const form = page.locator("form").filter({ has: page.locator('select[data-field="volume"], select') }).first();
    await form.locator('input[data-field="name"], #af-name, [id$="-name"]').first().fill("Sara Haddad");
    await form.locator('[id$="-company"]').first().fill("Meridian Media");
    await form.locator('[id$="-email"]').first().fill("sara@meridian-media.ae");
    await form.locator("select").first().selectOption({ index: 1 });
    await form.getByRole("button", { name: /Request an Operations Assessment/i }).click();
    await page.waitForTimeout(900);

    expect(body, "the form must have submitted").not.toBeNull();
    const attribution = (body as unknown as { attribution?: Attribution }).attribution;
    expect(attribution?.utm?.campaign).toBe("uae-adops-q4");
    expect(attribution?.liFatId).toBe("AbC-123_xyz");
    expect(attribution?.landingPath).toBe("/ad-operations-outsourcing");
    // `path` is still the page the form was on — the two answer different questions.
    expect((body as unknown as { context?: { path?: string } }).context?.path).toBe("/contact");
  });
});

test.describe("server-side sanitisation", () => {
  test("keeps what is legitimate", () => {
    const a = sanitizeAttribution({
      utm: { source: "linkedin", campaign: "uae-adops-q4", nonsense: "x" },
      referrer: "https://www.linkedin.com/feed/",
      landingPath: "/ad-operations-outsourcing",
      firstTouchAt: "2026-10-05T10:00:00.000Z",
      liFatId: "AbC-123_xyz",
    });
    expect(a.utm).toEqual({ source: "linkedin", campaign: "uae-adops-q4" });
    expect(a.referrer).toBe("https://www.linkedin.com/feed/");
    expect(a.landingPath).toBe("/ad-operations-outsourcing");
    expect(a.liFatId).toBe("AbC-123_xyz");
  });

  test("drops what is not", () => {
    const a = sanitizeAttribution({
      // Not a site-relative path — an absolute URL here would let a submission
      // put an arbitrary link in a notification email.
      landingPath: "https://evil.example/pwn",
      referrer: "javascript:alert(1)",
      liFatId: "has spaces and ; semicolons",
      firstTouchAt: "not a date",
      utm: { source: "line\nbreak" },
    });
    expect(a.landingPath).toBeUndefined();
    expect(a.referrer).toBeUndefined();
    expect(a.liFatId).toBeUndefined();
    expect(a.firstTouchAt).toBeUndefined();
    expect(a.utm?.source).toBe("line break");
  });

  test("a non-object is not an error", () => {
    expect(sanitizeAttribution(null)).toEqual({});
    expect(sanitizeAttribution("nope")).toEqual({});
    expect(sanitizeAttribution(42)).toEqual({});
  });

  test("values are bounded", () => {
    const a = sanitizeAttribution({ utm: { campaign: "x".repeat(5000) } });
    expect(a.utm!.campaign!.length).toBeLessThanOrEqual(300);
  });
});

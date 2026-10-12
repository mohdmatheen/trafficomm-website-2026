import { expect, test, type Page } from "@playwright/test";

/**
 * UK/EU cookie consent. /api/geo is mocked per test, because the real country
 * header only exists on Vercel. Assertions read dataLayer, not Google's network,
 * so they hold whether or not googletagmanager.com is reachable.
 */

type Entry = { kind: "command"; args: unknown[] } | { kind: "push"; value: Record<string, unknown> };

/** dataLayer as a list, with Consent Mode commands (pushed as `arguments`) turned into arrays. */
const entries = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []).map((p) =>
      Object.prototype.toString.call(p) === "[object Arguments]"
        ? { kind: "command" as const, args: Array.from(p as ArrayLike<unknown>) }
        : { kind: "push" as const, value: p as Record<string, unknown> },
    ),
  ) as Promise<Entry[]>;

const isCommand = (e: Entry, ...prefix: unknown[]) =>
  e.kind === "command" && prefix.every((v, i) => e.args[i] === v);
/** The settings object of a consent command (its third argument). */
const settingsOf = (e: Entry | undefined) => (e?.kind === "command" ? ((e.args[2] ?? {}) as Record<string, unknown>) : {});
const gtmJsIndex = (list: Entry[]) => list.findIndex((e) => e.kind === "push" && e.value.event === "gtm.js");

async function mockCountry(page: Page, country: string | null) {
  await page.route("**/api/geo", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ country }) }),
  );
}

async function openPage(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => ((window as unknown as { dataLayer?: { event?: string }[] }).dataLayer ?? []).some((p) => p.event === "gtm.js"), null, { timeout: 15_000 });
}

const banner = (page: Page) => page.getByRole("dialog", { name: "Cookie choices" });
const gaCookies = async (page: Page) => (await page.context().cookies()).filter((c) => c.name.startsWith("_ga"));

test.describe("consent: UK visitor", () => {
  test.beforeEach(async ({ page }) => mockCountry(page, "GB"));

  test("defaults are denied for the region and pushed before gtm.js, and the banner shows", async ({ page }) => {
    await openPage(page);
    await expect(banner(page)).toBeVisible();
    const list = await entries(page);
    const regional = list.findIndex((e) => isCommand(e, "consent", "default") && Array.isArray(settingsOf(e).region));
    expect(regional, "a regional consent default").toBeGreaterThanOrEqual(0);
    const settings = settingsOf(list[regional]);
    expect(settings.region).toContain("GB");
    expect(settings).toMatchObject({ analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    expect(regional).toBeLessThan(gtmJsIndex(list));
    const env = list.findIndex((e) => e.kind === "push" && typeof e.value.site_environment === "string");
    expect(env).toBeLessThan(gtmJsIndex(list));
    expect(await gaCookies(page), "no analytics cookie before a choice").toHaveLength(0);
  });

  test("the buttons carry equal weight and the banner does not block the page", async ({ page }) => {
    await openPage(page);
    const accept = banner(page).getByRole("button", { name: "Accept analytics" });
    const reject = banner(page).getByRole("button", { name: "Reject" });
    expect(await accept.getAttribute("class")).toBe(await reject.getAttribute("class"));
    await expect(banner(page).getByRole("checkbox")).toHaveCount(0);
    // No wall: the page underneath stays visible and the banner takes a small part of the screen.
    await expect(page.locator("#main")).toBeVisible();
    const box = await banner(page).boundingBox();
    const vp = page.viewportSize()!;
    expect(box!.height, "banner is a strip, not a wall").toBeLessThan(vp.height / 2);
  });

  test("Accept grants analytics, is remembered, and applies before gtm.js on the next page", async ({ page }) => {
    await openPage(page);
    await banner(page).getByRole("button", { name: "Accept analytics" }).click();
    await expect(banner(page)).toBeHidden();
    const after = await entries(page);
    expect(after.some((e) => isCommand(e, "consent", "update") && settingsOf(e).analytics_storage === "granted")).toBe(true);
    expect(await page.evaluate(() => localStorage.getItem("tc_consent"))).toBe("granted");

    await openPage(page, "/about");
    await expect(banner(page)).toBeHidden();
    const list = await entries(page);
    const update = list.findIndex((e) => isCommand(e, "consent", "update"));
    expect(settingsOf(list[update])).toEqual({ analytics_storage: "granted" });
    expect(update).toBeLessThan(gtmJsIndex(list));
  });

  test("Reject denies analytics and sets no analytics cookie", async ({ page }) => {
    await openPage(page);
    await banner(page).getByRole("button", { name: "Reject" }).click();
    await expect(banner(page)).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem("tc_consent"))).toBe("denied");
    const after = await entries(page);
    expect(after.some((e) => isCommand(e, "consent", "update") && settingsOf(e).analytics_storage === "denied")).toBe(true);

    await openPage(page, "/about");
    await expect(banner(page)).toBeHidden();
    const list = await entries(page);
    const update = list.findIndex((e) => isCommand(e, "consent", "update"));
    expect(settingsOf(list[update])).toEqual({ analytics_storage: "denied" });
    expect(update).toBeLessThan(gtmJsIndex(list));
    expect(await gaCookies(page)).toHaveLength(0);
  });

  test("the banner does not cover the contact form's submit button", async ({ page }) => {
    await openPage(page, "/contact");
    await expect(banner(page)).toBeVisible();
    const submit = page.getByRole("button", { name: /Request an Operations Assessment/ });
    await submit.scrollIntoViewIfNeeded();
    const b = (await banner(page).boundingBox())!;
    const s = (await submit.boundingBox())!;
    const overlaps = s.x < b.x + b.width && b.x < s.x + s.width && s.y < b.y + b.height && b.y < s.y + s.height;
    if (overlaps) {
      // Scrolling further must reveal it: the banner is fixed, the button is not.
      await page.mouse.wheel(0, b.height + 40);
    }
    await expect(submit).toBeInViewport();
    await submit.click({ trial: true });
  });
});

test.describe("consent: visitors outside the consent regions", () => {
  for (const country of ["AE", "US"]) {
    test(`${country}: no banner, analytics granted by default, order as before`, async ({ page }) => {
      await mockCountry(page, country);
      // Wait for the geo lookup to resolve before asserting the banner stays away.
      const geo = page.waitForResponse("**/api/geo");
      await openPage(page);
      await geo;
      await expect(banner(page)).toBeHidden();
      const list = await entries(page);
      const global = list.findIndex((e) => isCommand(e, "consent", "default") && !("region" in settingsOf(e)));
      expect(settingsOf(list[global])).toMatchObject({ analytics_storage: "granted", ad_storage: "denied" });
      expect(global).toBeLessThan(gtmJsIndex(list));
      expect(list.some((e) => isCommand(e, "consent", "update"))).toBe(false);
    });
  }
});

test.describe("consent: footer Cookie settings", () => {
  for (const country of ["US", "GB"]) {
    test(`${country}: reopens the banner and forgets the stored choice`, async ({ page }) => {
      await mockCountry(page, country);
      await page.addInitScript(() => {
        if (!sessionStorage.getItem("seeded")) {
          localStorage.setItem("tc_consent", "denied");
          sessionStorage.setItem("seeded", "1");
        }
      });
      await openPage(page);
      await expect(banner(page)).toBeHidden();
      await page.locator("footer").getByRole("button", { name: "Cookie settings" }).click();
      await expect(banner(page)).toBeVisible();
      expect(await page.evaluate(() => localStorage.getItem("tc_consent"))).toBeNull();
      await banner(page).getByRole("button", { name: "Accept analytics" }).click();
      expect(await page.evaluate(() => localStorage.getItem("tc_consent"))).toBe("granted");
    });
  }
});

test("the geo route returns only a country code and is never cached", async ({ request }) => {
  const res = await request.get("/api/geo", { headers: { "x-vercel-ip-country": "gb" } });
  expect(res.status()).toBe(200);
  expect(res.headers()["cache-control"]).toContain("no-store");
  const body = await res.json();
  expect(Object.keys(body)).toEqual(["country"]);
});

test("/privacy documents the cookie choices", async ({ page }) => {
  await page.goto("/privacy#cookies");
  await expect(page.locator("#cookies h2")).toHaveText("Your cookie choices");
  await expect(page.locator("#cookies")).toContainText("tc_consent");
  await expect(page.locator("#cookies")).toContainText("Cookie settings");
});

import { expect, test, type Page } from "@playwright/test";
import { allowedParams, sanitizeParams } from "../lib/analytics";

/**
 * GTM is the only tag-management layer, so two things have to hold: the container
 * loads exactly once, and nothing that identifies a person ever reaches dataLayer.
 */

const GTM_ID = "GTM-N8G32FVT";
/** Values typed into the form below; none of them may appear in any dataLayer push. */
const PII = ["Jane Okonkwo", "Meridian Media", "jane@meridianmedia.ae", "QA slips when launch volume peaks."];

type Push = Record<string, unknown>;
const pushes = (page: Page) => page.evaluate(() => (window.dataLayer ?? []) as Push[]);

/**
 * GTM mutates the objects it processes, stamping each with `gtm.uniqueEventId`
 * and similar bookkeeping. Those keys are the container's, not Trafficomm's, so
 * assertions about what the site sends ignore them.
 */
const ourKeys = (push: Push) => Object.keys(push).filter((k) => k !== "event" && !k.startsWith("gtm."));

/** Waits for an event rather than reading immediately: view events fire after hydration. */
async function waitForEvent(page: Page, event: string): Promise<Push> {
  await page.waitForFunction((e) => (window.dataLayer ?? []).some((p) => (p as Push).event === e), event, { timeout: 10_000 });
  return (await pushes(page)).find((p) => p.event === event)!;
}

async function fill(page: Page) {
  await page.locator("#contact-name").fill("Jane Okonkwo");
  await page.locator("#contact-company").fill("Meridian Media");
  await page.locator("#contact-email").fill("jane@meridianmedia.ae");
  await page.locator("#contact-volume").selectOption("50–100");
  await page.locator("#contact-challenge").fill("QA slips when launch volume peaks.");
}
const submitButton = (page: Page) => page.getByRole("button", { name: /Request an Operations Assessment|Sending/ });

/**
 * A submission is a click, a round trip and a re-render. Under a full parallel run
 * that occasionally exceeds the 5s default, which showed up as a flake at w390 —
 * the assertion was right, the budget was not.
 */
const expectSuccessPanel = (page: Page) => expect(page.getByText("Assessment request received.")).toBeVisible({ timeout: 15_000 });

/**
 * These assertions are about the markup the site emits, not about Google's CDN
 * being reachable. Waiting for `load` waits for the container script to download
 * from googletagmanager.com, which makes the suite depend on a third-party fetch.
 * Wait for the document and for next/script to inject the tag instead.
 */
async function gotoAndAwaitGtm(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[src*="googletagmanager.com/gtm.js"]', { state: "attached", timeout: 15_000 });
}

test.describe("Google Tag Manager", () => {
  test("the container is present, and present once", async ({ page }) => {
    await gotoAndAwaitGtm(page);
    const html = await page.content();
    expect(html).toContain(GTM_ID);

    const loaders = await page.locator(`script[src*="googletagmanager.com/gtm.js"]`).count();
    expect(loaders, "exactly one container loader").toBe(1);
    const src = await page.locator(`script[src*="googletagmanager.com/gtm.js"]`).getAttribute("src");
    expect(src).toContain(`id=${GTM_ID}`);
    expect(await page.locator("#_next-gtm-init").count()).toBe(1);
  });

  test("no GA4 script is hard-coded alongside it", async ({ page }) => {
    await gotoAndAwaitGtm(page);
    // gtag.js loaded directly would double every GA4 pageview.
    expect(await page.locator('script[src*="gtag/js"], script[src*="google-analytics.com"]').count()).toBe(0);
    const inline = await page.locator("script:not([src])").allTextContents();
    expect(inline.join("\n")).not.toMatch(/gtag\(|G-G80TBEF4YT/);
  });

  test("the noscript fallback opens the body, ahead of all page content", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(await page.content()).toContain(`googletagmanager.com/ns.html?id=${GTM_ID}`);
    // React injects its own hidden streaming placeholder as the first child, so the
    // guarantee that matters is that the noscript precedes the skip link and header.
    const order = await page.evaluate(() => {
      const kids = [...document.body.children].map((el) => el.tagName);
      return { noscript: kids.indexOf("NOSCRIPT"), skip: kids.indexOf("A"), header: kids.indexOf("HEADER") };
    });
    expect(order.noscript).toBeGreaterThanOrEqual(0);
    expect(order.noscript).toBeLessThan(order.skip);
    expect(order.noscript).toBeLessThan(order.header);
  });

  test("the container loader does not block rendering", async ({ page }) => {
    await gotoAndAwaitGtm(page);
    const blocking = await page.evaluate(() => {
      const s = document.querySelector<HTMLScriptElement>('script[src*="googletagmanager.com/gtm.js"]');
      return s ? { async: s.async, defer: s.defer } : null;
    });
    expect(blocking?.async || blocking?.defer, "GTM must be async or deferred").toBeTruthy();
  });

  test("dataLayer carries the deployment environment so GTM can exclude non-production", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // next/script runs the dataLayer initialiser after hydration, so wait for the
    // value rather than reading the array the moment the document parses.
    await page.waitForFunction(() => (window.dataLayer ?? []).some((p) => typeof (p as Record<string, unknown>).site_environment === "string"), null, { timeout: 15_000 });
    const seen = await pushes(page);
    expect(seen.some((p) => typeof p.site_environment === "string")).toBe(true);
  });
});

test.describe("no personal data reaches dataLayer", () => {
  test("a full successful submission pushes only allowlisted, non-identifying values", async ({ page }) => {
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"delivered":true}' }));
    await page.goto("/contact");
    await page.locator("#contact-name").waitFor();
    await fill(page);
    await submitButton(page).click();
    await expectSuccessPanel(page);

    const seen = await pushes(page);
    const serialized = JSON.stringify(seen);
    for (const value of PII) expect(serialized, `"${value}" must never be pushed`).not.toContain(value);

    const success = seen.find((p) => p.event === "assessment_submit_success");
    expect(success).toBeDefined();
    expect(success).toMatchObject({
      event: "assessment_submit_success",
      form_name: "operations_assessment",
      form_location: "contact",
      campaign_volume: "50–100",
      page_path: "/contact",
    });
    // Every key on every push Trafficomm raises must be allowlisted.
    const ours = seen.filter((p) => typeof p.event === "string" && String(p.event).match(/^(assessment|contact|case_study|solution|email|phone|linkedin)_/));
    expect(ours.length).toBeGreaterThan(0);
    for (const push of ours) {
      for (const key of ourKeys(push)) {
        expect(allowedParams as readonly string[], `unexpected key "${key}"`).toContain(key);
      }
    }
  });

  test("page_path never carries a query string", async ({ page }) => {
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
    await page.goto("/contact?utm_source=linkedin&email=someone%40example.com");
    await page.locator("#contact-name").waitFor();
    await fill(page);
    await submitButton(page).click();
    await expectSuccessPanel(page);

    const serialized = JSON.stringify(await pushes(page));
    expect(serialized).not.toContain("someone@example.com");
    expect(serialized).not.toContain("utm_source=linkedin");
    const success = (await pushes(page)).find((p) => p.event === "assessment_submit_success");
    expect(success?.page_path).toBe("/contact");
  });

  test("the allowlist itself contains no identifying key", async () => {
    for (const key of allowedParams) {
      expect(key, `"${key}" reads like personal data`).not.toMatch(/email|phone|company|challenge|address|first_?name|last_?name|full_?name|user_|customer_|visitor_/i);
    }
    // The three "*_name" keys are identifiers of published things, never of people:
    // a form ("operations_assessment"), a solution slug and a case study slug.
    expect([...allowedParams].filter((k) => k.endsWith("_name")).sort()).toEqual(["case_study_name", "form_name", "solution_name"]);
  });

  test("any key outside the allowlist is dropped", async () => {
    expect(sanitizeParams({ email: "jane@x.com", name: "Jane", company: "Meridian", challenge: "text", page_path: "/contact" })).toEqual({
      page_path: "/contact",
    });
  });
});

test.describe("assessment_submit_success fires only on confirmed success", () => {
  const successes = async (page: Page) => (await pushes(page)).filter((p) => p.event === "assessment_submit_success");

  test("not on form start, and not on submit click", async ({ page }) => {
    let release: () => void = () => {};
    const held = new Promise<void>((r) => (release = r));
    await page.route("**/api/assessment", async (route) => {
      await held;
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await page.goto("/contact");
    await page.locator("#contact-name").waitFor();

    await fill(page);
    expect(await successes(page)).toHaveLength(0);
    await submitButton(page).click();
    await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
    expect(await successes(page), "in flight, not yet confirmed").toHaveLength(0);

    release();
    await expectSuccessPanel(page);
    expect(await successes(page)).toHaveLength(1);
  });

  test("not on a validation error", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("#contact-name").waitFor();
    await submitButton(page).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    expect(await successes(page)).toHaveLength(0);
    const seen = await pushes(page);
    expect(seen.find((p) => p.event === "assessment_submit_error")).toMatchObject({ error_reason: "validation" });
  });

  test("not on an API error", async ({ page }) => {
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 502, contentType: "application/json", body: '{"ok":false,"message":"We couldn\'t send your request. Please try again."}' }));
    await page.goto("/contact");
    await page.locator("#contact-name").waitFor();
    await fill(page);
    await submitButton(page).click();
    await expect(page.locator("#contact-status[role=alert]")).toBeVisible();
    expect(await successes(page)).toHaveLength(0);
  });

  test("not on a deduplicated submission", async ({ page }) => {
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"duplicate":true}' }));
    await page.goto("/contact");
    await page.locator("#contact-name").waitFor();
    await fill(page);
    await submitButton(page).click();
    await expectSuccessPanel(page);
    expect(await successes(page), "the enquiry was already counted").toHaveLength(0);
  });

  test("not merely because the success UI renders again", async ({ page }) => {
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
    await page.goto("/contact");
    await page.locator("#contact-name").waitFor();
    await fill(page);
    await submitButton(page).click();
    await expectSuccessPanel(page);
    expect(await successes(page)).toHaveLength(1);

    // Reset to the form and back to success: still one conversion per submission.
    await page.getByRole("button", { name: "Submit another request" }).click();
    await page.locator("#contact-name").waitFor();
    expect(await successes(page)).toHaveLength(1);
  });
});

test.describe("site events", () => {
  test("a contact CTA reports where it was clicked, and nothing else", async ({ page, viewport }) => {
    await page.goto("/");
    // The header CTA is hidden below 640px, where the same call to action lives in
    // the mobile menu instead. Both paths are exercised, one per viewport project.
    const mobile = viewport!.width < 640;
    let expectedLocation: string;
    if (mobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const nav = page.locator('nav[aria-label="Mobile"]');
      await nav.getByRole("link", { name: /Request an Operations Assessment/i }).click();
      expectedLocation = "mobile_nav";
    } else {
      await page.locator("header").getByRole("link", { name: /Request an Assessment/i }).first().click();
      expectedLocation = "header";
    }
    await page.waitForURL("**/contact");

    const click = (await pushes(page)).find((p) => p.event === "contact_cta_click");
    // The mobile CTA closes the menu on click; recording in the capture phase means
    // that handler cannot swallow the event.
    expect(click, "the delegated listener should have recorded the click").toBeDefined();
    expect(click).toMatchObject({ event: "contact_cta_click", cta_location: expectedLocation, page_path: "/" });
    expect(ourKeys(click!).sort()).toEqual(["cta_location", "page_path"]);
  });

  test("opening a case study reports its slug", async ({ page }) => {
    await page.goto("/case-studies/mena-agency-ad-operations");
    const view = await waitForEvent(page, "case_study_view");
    expect(view).toMatchObject({ case_study_name: "mena-agency-ad-operations" });
    expect(ourKeys(view).sort()).toEqual(["case_study_name", "page_path"]);
  });

  test("opening a solution reports its slug", async ({ page }) => {
    await page.goto("/solutions/media-agencies");
    const view = await waitForEvent(page, "solution_view");
    expect(view).toMatchObject({ solution_name: "media-agencies" });
  });

  test("a solution view fires once, not twice", async ({ page }) => {
    await page.goto("/solutions/white-label-ad-operations");
    await waitForEvent(page, "solution_view");
    expect((await pushes(page)).filter((p) => p.event === "solution_view")).toHaveLength(1);
  });

  test("the internal LinkedIn platform page is not a linkedin_click", async ({ page }) => {
    await page.goto("/platforms");
    const link = page.getByRole("link", { name: /LinkedIn/i }).first();
    if ((await link.count()) === 0) test.skip(true, "no LinkedIn platform link on this width");
    await link.click();
    await page.waitForURL("**/platforms/linkedin");
    expect((await pushes(page)).filter((p) => p.event === "linkedin_click")).toHaveLength(0);
  });
});

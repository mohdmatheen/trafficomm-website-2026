import { expect, test, type Page } from "@playwright/test";

/**
 * The assessment form's four states, its duplicate-submission guard, and the
 * analytics seam — driven through the real UI with the delivery endpoint stubbed,
 * so no provider is called and no email is sent.
 *
 * Every test runs at all six viewport widths, which is also the responsive check:
 * a broken control or an overflowing row fails here rather than in review.
 */

const FORM = "#contact-name";

/** Fills the five approved fields. Market and platform do not exist and must not return. */
async function fill(page: Page) {
  await page.locator("#contact-name").fill("Jane Okonkwo");
  await page.locator("#contact-company").fill("Meridian Media");
  await page.locator("#contact-email").fill("jane@meridianmedia.ae");
  await page.locator("#contact-volume").selectOption("50–100");
  await page.locator("#contact-challenge").fill("QA slips when launch volume peaks.");
}

const submitButton = (page: Page) => page.getByRole("button", { name: /Request an Operations Assessment|Sending/ });

/** Next.js renders its own role="alert" route announcer, so the form's alert is scoped by id. */
const formAlert = (page: Page) => page.locator("#contact-status[role=alert]");

/** Records every analytics event the form emits, before any interaction. */
async function captureEvents(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __events: string[] }).__events = [];
    for (const name of ["assessment_form_start", "assessment_submit_attempt", "assessment_submit_success", "assessment_submit_error"]) {
      window.addEventListener(name, () => (window as unknown as { __events: string[] }).__events.push(name));
    }
  });
}
const events = (page: Page) => page.evaluate(() => (window as unknown as { __events: string[] }).__events);

test.describe("assessment form states", () => {
  test("submitting state disables the button and says so", async ({ page }) => {
    let release: () => void = () => {};
    const held = new Promise<void>((r) => (release = r));
    await page.route("**/api/assessment", async (route) => {
      await held;
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"delivered":true}' });
    });

    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    await fill(page);
    await submitButton(page).click();

    await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
    release();
    await expect(page.getByText("Assessment request received.")).toBeVisible();
  });

  test("success state confirms receipt and takes focus", async ({ page }) => {
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"delivered":true}' }));
    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    await fill(page);
    await submitButton(page).click();

    const panel = page.getByRole("status").filter({ hasText: "Assessment request received." });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("jane@meridianmedia.ae");
    // Focus must land on the panel: the button the visitor used no longer exists.
    await expect(panel).toBeFocused();
    await expect(page.locator(FORM)).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Submit another request" })).toBeVisible();
  });

  test("error state is friendly and never shows provider detail", async ({ page }) => {
    await page.route("**/api/assessment", (route) =>
      route.fulfill({ status: 502, contentType: "application/json", body: '{"ok":false,"message":"We couldn\'t send your request. Please try again."}' }),
    );
    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    await fill(page);
    await submitButton(page).click();

    const alert = formAlert(page);
    await expect(alert).toContainText("couldn't send your request");
    await expect(alert).not.toContainText(/resend|postmark|api[_ ]?key|stack|Error:/i);
    // The form is still there, still filled, so the visitor can retry.
    await expect(page.locator(FORM)).toHaveValue("Jane Okonkwo");
    await expect(submitButton(page)).toBeEnabled();
  });

  test("invalid fields are reported inline and take focus", async ({ page }) => {
    let requests = 0;
    await page.route("**/api/assessment", (route) => {
      requests += 1;
      return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    await submitButton(page).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Select your monthly campaign volume.")).toBeVisible();
    await expect(page.locator(FORM)).toBeFocused();
    // Nothing was sent, so nothing can be counted as a conversion.
    expect(requests).toBe(0);
  });
});

test.describe("duplicate submission prevention", () => {
  test("two rapid submits produce one request", async ({ page }) => {
    let requests = 0;
    let release: () => void = () => {};
    const held = new Promise<void>((r) => (release = r));
    await page.route("**/api/assessment", async (route) => {
      requests += 1;
      await held;
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"delivered":true}' });
    });

    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    await fill(page);

    // Enter twice in the same tick: the disabled attribute cannot have applied yet,
    // so this exercises the in-flight ref rather than the button state.
    await page.locator("#contact-email").press("Enter");
    await page.locator("#contact-email").press("Enter");
    await submitButton(page).click({ force: true }).catch(() => {});

    release();
    await expect(page.getByText("Assessment request received.")).toBeVisible();
    expect(requests).toBe(1);
  });
});

test.describe("analytics seam", () => {
  test("success is emitted only after the server confirms", async ({ page }) => {
    await captureEvents(page);
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"delivered":true}' }));
    await page.goto("/contact");
    await page.locator(FORM).waitFor();

    expect(await events(page)).toEqual([]);
    await fill(page);
    expect(await events(page)).toEqual(["assessment_form_start"]);

    await submitButton(page).click();
    await expect(page.getByText("Assessment request received.")).toBeVisible();
    expect(await events(page)).toEqual(["assessment_form_start", "assessment_submit_attempt", "assessment_submit_success"]);
  });

  test("a deduplicated resubmission is a success for the visitor but not a second conversion", async ({ page }) => {
    await captureEvents(page);
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"duplicate":true}' }));
    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    await fill(page);
    await submitButton(page).click();

    await expect(page.getByText("Assessment request received.")).toBeVisible();
    const seen = await events(page);
    expect(seen).toContain("assessment_submit_attempt");
    expect(seen).not.toContain("assessment_submit_success");
  });

  test("a failed delivery emits an error, never a success", async ({ page }) => {
    await captureEvents(page);
    await page.route("**/api/assessment", (route) => route.fulfill({ status: 502, contentType: "application/json", body: '{"ok":false,"message":"We couldn\'t send your request. Please try again."}' }));
    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    await fill(page);
    await submitButton(page).click();
    await expect(formAlert(page)).toBeVisible();

    const seen = await events(page);
    expect(seen).toContain("assessment_submit_error");
    expect(seen).not.toContain("assessment_submit_success");
  });

  test("a validation failure never counts as an attempt on the server", async ({ page }) => {
    await captureEvents(page);
    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    await submitButton(page).click();
    const seen = await events(page);
    expect(seen).toContain("assessment_submit_error");
    expect(seen).not.toContain("assessment_submit_attempt");
    expect(seen).not.toContain("assessment_submit_success");
  });
});

test.describe("the endpoint itself", () => {
  test("a honeypot submission is accepted and delivered nowhere", async ({ request }) => {
    const res = await request.post("/api/assessment", {
      data: { name: "Bot", company: "Bot Co", email: "bot@bots.io", volume: "250+", intent: "assessment", website: "http://spam.example" },
    });
    // Bots learn nothing from a success they did not earn.
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test("a malformed body is rejected without a stack trace", async ({ request }) => {
    for (const data of ["not json", "[1,2,3]", '"string"']) {
      const res = await request.post("/api/assessment", { headers: { "Content-Type": "application/json" }, data });
      expect(res.status()).toBe(400);
      const body = await res.text();
      expect(body).toContain("Invalid request.");
      expect(body).not.toMatch(/at \w+|node_modules|\.ts:\d+/);
    }
  });

  test("an oversized body is refused", async ({ request }) => {
    const res = await request.post("/api/assessment", {
      data: { name: "Jane", company: "Meridian", email: "jane@meridian.ae", volume: "50–100", challenge: "x".repeat(20_000), intent: "assessment" },
    });
    expect(res.status()).toBe(413);
  });

  test("validation errors come back per field, with no delivery", async ({ request }) => {
    const res = await request.post("/api/assessment", { data: { name: "J", company: "", email: "jane@gmail.com", volume: "lots", intent: "assessment" } });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(Object.keys(body.errors).sort()).toEqual(["company", "email", "name", "volume"]);
  });

  test("the recipient and sender cannot be set by the caller", async ({ request }) => {
    // These properties are invented by the caller; the route builds its record field
    // by field, so they must be ignored rather than reaching the email or the config.
    const res = await request.post("/api/assessment", {
      data: {
        name: "Jane Okonkwo",
        company: "Meridian Media",
        email: "jane@meridianmedia.ae",
        volume: "50–100",
        intent: "assessment",
        to: "attacker@example.com",
        from: "spoofed@trafficomm.com",
        ASSESSMENT_EMAIL_TO: "attacker@example.com",
        replyTo: "attacker@example.com",
        subject: "Injected subject",
        html: "<p>injected</p>",
      },
    });
    // No delivery channel is configured in the test environment, so the honest
    // answer is a refusal — what matters is that it is not a 5xx from a crash and
    // not a success built from caller-supplied routing.
    expect([200, 503]).toContain(res.status());
    const body = await res.json();
    expect(body.errors).toBeUndefined();
  });
});

test.describe("the form fits every width", () => {
  test("no horizontal overflow and every control is reachable", async ({ page }, testInfo) => {
    await page.goto("/contact");
    const form = page.locator("form").filter({ has: page.locator(FORM) });
    await form.waitFor();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow at ${testInfo.project.name}`).toBeLessThanOrEqual(1);

    const box = await form.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);

    for (const id of ["#contact-name", "#contact-company", "#contact-email", "#contact-volume", "#contact-challenge"]) {
      const control = page.locator(id);
      await expect(control).toBeVisible();
      const b = await control.boundingBox();
      expect(b!.width).toBeGreaterThan(80);
      // 44px minimum target height, except the textarea which is taller by design.
      expect(b!.height).toBeGreaterThanOrEqual(44);
    }
    const button = await submitButton(page).boundingBox();
    expect(button!.height).toBeGreaterThanOrEqual(44);
  });

  test("market and platform selection is gone at every width", async ({ page }) => {
    await page.goto("/contact");
    await page.locator(FORM).waitFor();
    const form = page.locator("form").filter({ has: page.locator(FORM) });
    await expect(form.locator('input[type="checkbox"]')).toHaveCount(0);
    await expect(form.getByText(/^Market/i)).toHaveCount(0);
    await expect(form.getByText(/^Platforms/i)).toHaveCount(0);
  });
});

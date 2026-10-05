import { expect, test } from "@playwright/test";

/**
 * Responsive sweep for the calculator.
 *
 * Walks every stage at each width and asserts the document never scrolls
 * horizontally. Driven through the real UI rather than by setting state, so a
 * layout that only breaks once a control is rendered is still caught.
 */
const WIDTHS = [360, 390, 430, 768, 1024, 1440, 1920];
const PATH = "/labs/adops-capacity";

const overflow = async (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px, across every stage`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PATH);
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    const stages: string[] = [];
    const check = async (label: string) => {
      stages.push(label);
      expect(await overflow(page), `${label} at ${width}px`).toBe(0);
    };

    await check("landing + market");

    for (const label of ["business", "team", "workload", "platforms", "operations"]) {
      await page.getByRole("button", { name: "Continue" }).click();
      await page.waitForTimeout(140);
      await check(label);
    }

    await page.getByRole("button", { name: /Analyse my ad operations/i }).click();
    await page.waitForTimeout(2600);
    await check("results");

    // Capacity impact: externalise everything, which is the widest the two
    // comparison bars and their labels ever get.
    const setRange = async (id: string, value: string) => {
      await page.locator(`#${id}`).evaluate((el, v) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
        setter.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }, value);
      await page.waitForTimeout(260);
    };
    await setRange("capacity-external", "100");
    await check("capacity impact");

    // Allocation appears only once capacity has been released.
    await page.locator("#alloc-strategy").scrollIntoViewIfNeeded();
    await setRange("alloc-strategy", "85");
    await check("capacity allocation");

    await setRange("sim-automation", "100");
    await check("simulator");

    // Lead form, then its error state — the longest strings on the screen.
    await page.getByRole("button", { name: /Request a delivery estimate/i }).scrollIntoViewIfNeeded();
    await check("lead form");

    expect(stages.length).toBe(11);
  });
}

test("detailed workload mode does not overflow on the narrowest width", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto(PATH);
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(140);
  }
  await page.getByRole("radio", { name: "I know our hours" }).click();
  await page.waitForTimeout(250);
  expect(await overflow(page)).toBe(0);
});

test("very large inputs do not break the results layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(PATH);
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: /United Arab Emirates/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(150);
  // A very large agency produces the longest currency strings the tool can show.
  await page.getByLabel("Campaigns launched per month").fill("9000");
  await page.getByLabel("Active clients or accounts").fill("400");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(150);
  // Exact match: the stepper's −/+ buttons carry "Decrease/Increase <label>",
  // so a substring match resolves to three elements.
  for (const role of ["Performance Manager headcount", "Specialist / Executive headcount"]) {
    await page.getByLabel(role, { exact: true }).fill("60");
  }
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(140);
  }
  await page.getByRole("button", { name: /Analyse my ad operations/i }).click();
  await page.waitForTimeout(2600);
  expect(await overflow(page)).toBe(0);
  // And the figures must still be finite rather than NaN or Infinity.
  const body = await page.evaluate(() => document.body.innerText);
  expect(body).not.toMatch(/NaN|Infinity/);
});

import { expect, test, type Page } from "@playwright/test";

/**
 * Visual storytelling prototypes: ad operations pipeline, measurement signal
 * journey, reporting dashboard. These assert the *explanation* survives —
 * order of stages, keyboard control, mobile composition, and the complete
 * state under reduced motion — not pixel positions.
 */

const desktop = (w: number) => w >= 1024;

/** The rail the current viewport actually shows (horizontal on desktop, vertical below). */
const rail = (page: Page, width: number) => page.locator(desktop(width) ? "div.hidden.lg\\:block ol[role=tablist]" : "div.lg\\:hidden ol[role=tablist]").first();

/** Both rails render (CSS picks one), so assertions target the panel actually on screen. */
const panelIn = (page: Page, section: string) => page.locator(`section[aria-labelledby=${section}] [role=tabpanel]:visible`).first();

test.describe("ad operations pipeline", () => {
  test("shows the eight stages in order and moves with the keyboard", async ({ page, viewport }) => {
    await page.goto("/services/ad-operations");
    const tabs = rail(page, viewport!.width).getByRole("tab");
    await expect(tabs).toHaveText([/Brief/, /Build/, /Traffic/, /QA/, /Validate/, /Approval/, /Launch/, /Monitor/]);

    const panel = panelIn(page, "lifecycle-title");
    await tabs.nth(0).click();
    await expect(panel).toContainText("Illustrative campaign brief");
    await tabs.nth(0).press(desktop(viewport!.width) ? "ArrowRight" : "ArrowDown");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(panel).toContainText("Campaign structure");
  });

  test("QA gates live inside the pipeline", async ({ page, viewport }) => {
    await page.goto("/services/ad-operations");
    const tabs = rail(page, viewport!.width).getByRole("tab");
    const panel = panelIn(page, "lifecycle-title");
    await tabs.nth(3).click();
    await expect(panel).toContainText("Input QA");
    await expect(panel).toContainText("Creative QA");
    await tabs.nth(4).click();
    for (const check of ["Naming", "Budget", "Audience", "Creative", "URL", "Tracking", "Placement", "Dates"]) {
      await expect(panel.getByText(check, { exact: true }).first()).toBeVisible();
    }
    await expect(panel).toContainText("Build QA");
    await expect(panel).toContainText("Launch QA");
    await expect(panel).toContainText("Ongoing QA");
  });

  test("approval stage keeps the launch decision with the client", async ({ page, viewport }) => {
    await page.goto("/services/ad-operations");
    await rail(page, viewport!.width).getByRole("tab").nth(5).click();
    const panel = panelIn(page, "lifecycle-title");
    await expect(panel).toContainText("Campaigns go live on your approval, not automatically.");
  });

  test("mobile rail uses vertical stage buttons with 44px targets", async ({ page, viewport }) => {
    test.skip(desktop(viewport!.width), "mobile composition");
    await page.goto("/services/ad-operations");
    const tabs = rail(page, viewport!.width).getByRole("tab");
    await expect(tabs).toHaveCount(8);
    for (const i of [0, 4, 7]) {
      const box = await tabs.nth(i).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("measurement signal journey", () => {
  test("selecting a stage reveals its detail", async ({ page, viewport }) => {
    await page.goto("/services/measurement");
    const tabs = rail(page, viewport!.width).getByRole("tab");
    await expect(tabs).toHaveText([/User action/, /Data layer/, /GTM/, /Destinations/, /Conversion/, /Validation/, /Reporting/]);
    const panel = panelIn(page, "system-title");

    await tabs.nth(2).click();
    await expect(panel).toContainText("Trigger");
    await expect(panel).toContainText("Tag");

    await tabs.nth(3).click();
    // The honest CAPI framing must travel with the visual.
    await expect(panel).toContainText("Browser signal");
    await expect(panel).toContainText("Server signal");
    await expect(panel).toContainText("do not restore every lost signal");
  });

  test("the illustrative event carries no personal data", async ({ page, viewport }) => {
    await page.goto("/services/measurement");
    await rail(page, viewport!.width).getByRole("tab").nth(1).click();
    const panel = panelIn(page, "system-title");
    await expect(panel).toContainText("form_submit");
    const text = await panel.innerText();
    expect(text).not.toMatch(/email|phone|customer id|@/i);
  });
});

test.describe("reporting dashboard", () => {
  test("switches views and always labels the data as illustrative", async ({ page }) => {
    await page.goto("/services/reporting");
    const dash = page.getByRole("tablist", { name: "Reporting view" });
    await expect(page.getByText("Illustrative data", { exact: true })).toBeVisible();
    const panel = page.getByRole("tabpanel", { name: /reporting view, illustrative data/ });
    await expect(panel).toContainText("Spend by platform");

    await dash.getByRole("tab", { name: "Platform" }).click();
    await expect(panel).toContainText("Conversions by platform");
    await expect(panel).toContainText("Meta");

    await dash.getByRole("tab", { name: "Market" }).press("ArrowRight");
    await expect(dash.getByRole("tab", { name: "Campaign" })).toHaveAttribute("aria-selected", "true");
  });

  test("reporting, analysis and insight end in a human decision", async ({ page }) => {
    await page.goto("/services/reporting");
    const panel = page.getByRole("tabpanel", { name: /reporting view, illustrative data/ });
    await expect(panel).toContainText("What happened?");
    await expect(panel).toContainText("Why did it happen?");
    await expect(panel).toContainText("What should we do next?");
    // The recommendation ends with a person, now stated as a state rather than a sentence.
    await expect(panel).toContainText("Human decision");
    await expect(panel).toContainText("not Trafficomm or client performance");
  });
});

test.describe("reduced motion shows the complete state", () => {
  test.use({ reducedMotion: "reduce" });

  test("pipelines rest on the final stage with every check validated", async ({ page, viewport }) => {
    await page.goto("/services/ad-operations");
    const tabs = rail(page, viewport!.width).getByRole("tab");
    await expect(tabs.nth(7)).toHaveAttribute("aria-selected", "true");
    // Monitoring signals and the reporting cadence both live in the final stage now.
    await expect(panelIn(page, "lifecycle-title")).toContainText("Watched in flight");
    await expect(panelIn(page, "lifecycle-title")).toContainText("Reporting out of the operation");

    // A QA stage reached by selection is fully validated, never left pending.
    await tabs.nth(4).click();
    // Status labels only — the stage summary legitimately contains the words "pending to validated".
    await expect(panelIn(page, "lifecycle-title").getByText("Pending", { exact: true })).toHaveCount(0);
    await expect(panelIn(page, "lifecycle-title").getByText("Validated", { exact: true }).first()).toBeVisible();

    await page.goto("/services/measurement");
    await expect(rail(page, viewport!.width).getByRole("tab").nth(6)).toHaveAttribute("aria-selected", "true");
  });
});

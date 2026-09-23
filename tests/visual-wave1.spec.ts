import { expect, test, type Page } from "@playwright/test";

/**
 * Wave 1 service visuals: the performance optimization engine, the
 * programmatic delivery architecture, and the connected creative / adtech
 * systems.
 *
 * These assert the explanation survives — the stages, the ownership, the
 * qualifications and the human decision — not pixel positions. Every page
 * renders both a desktop and a compact composition, so assertions target
 * whichever one the viewport actually shows.
 */

const desktop = (w: number) => w >= 1024;
const system = (page: Page) => page.locator("section[aria-labelledby=system-title]");
const tabs = (page: Page) => system(page).locator("[role=tab]:visible");
/** Text inside whichever composition the viewport shows. */
const shown = (page: Page, text: string) => system(page).getByText(text, { exact: true }).locator("visible=true").first();
const panel = (page: Page) => system(page).locator("[role=tabpanel]:visible").first();
/** Selecting a stage pins it, which also stops the entry sequence — deterministic for assertions. */
const pick = async (page: Page, name: string | RegExp) => {
  await tabs(page)
    .filter({ hasText: name })
    .first()
    .click();
};

test.describe("performance optimization engine", () => {
  test("six signals and the objective they are read against", async ({ page }) => {
    await page.goto("/services/performance-marketing");
    await expect(tabs(page)).toHaveCount(7);
    for (const s of ["Audience", "Creative", "Placement / channel", "Budget", "Campaign structure", "Conversion performance"]) {
      await expect(tabs(page).filter({ hasText: s }).first()).toBeVisible();
    }
    // The KPI targets stay on the page, not only in the readout.
    for (const k of ["CPL", "CPA", "CPV", "VTR", "ROAS"]) {
      await expect(shown(page, k)).toBeVisible();
    }
  });

  test("selecting a signal changes what the engine reports", async ({ page }) => {
    await page.goto("/services/performance-marketing");
    await pick(page, "Creative");
    await expect(panel(page)).toContainText("Frequency rising while response falls");
    await expect(panel(page)).toContainText("Refresh the format that is fatiguing");

    await pick(page, "Budget");
    await expect(panel(page)).toContainText("Most of the budget sitting in one ad set");
    // Illustrative process data is labelled wherever it appears.
    await expect(system(page).getByText("Illustrative data", { exact: true })).toBeVisible();
  });

  test("every recommendation ends with a person", async ({ page }) => {
    await page.goto("/services/performance-marketing");
    await pick(page, "Audience");
    await expect(panel(page)).toContainText("Human decision");
    await expect(panel(page)).toContainText("Recommended — implemented once your team agrees");
    await expect(panel(page)).toContainText("Strategy, targets and client commitments stay with you.");
  });

  test("the approved qualification travels with the visual", async ({ page }) => {
    await page.goto("/services/performance-marketing");
    await expect(system(page)).toContainText("No result is promised in advance.");
    // The evidence loop is still named in full.
    for (const s of ["Historical data", "Hypothesis", "Test", "Measure", "Reallocate", "Learn", "Scale"]) {
      await expect(shown(page, s)).toBeVisible();
    }
  });

  test("arrow keys move between signals", async ({ page, viewport }) => {
    await page.goto("/services/performance-marketing");
    await pick(page, "Audience");
    await tabs(page).filter({ hasText: "Audience" }).first().press(desktop(viewport!.width) ? "ArrowRight" : "ArrowDown");
    await expect(tabs(page).filter({ hasText: "Creative" }).first()).toHaveAttribute("aria-selected", "true");
  });

  test("mobile signal targets are at least 44px", async ({ page, viewport }) => {
    test.skip(desktop(viewport!.width), "mobile composition");
    await page.goto("/services/performance-marketing");
    const n = await tabs(page).count();
    for (const i of [0, Math.floor(n / 2), n - 1]) {
      const box = await tabs(page).nth(i).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("programmatic delivery architecture", () => {
  test("eight stages in order, each in an ownership lane", async ({ page }) => {
    await page.goto("/services/programmatic");
    await expect(tabs(page)).toHaveText([/Media plan/, /DV360/, /Inventory & deals/, /CM360/, /Creative approval/, /QA/, /Delivery/, /Reporting/]);
    // Ownership is stated for whichever stage is selected, in every composition.
    for (const [stage, lane] of [
      ["Media plan", "Agency / trading team"],
      ["Inventory & deals", "Platforms & supply"],
      ["QA", "Trafficomm operations"],
    ] as const) {
      await pick(page, stage);
      await expect(panel(page)).toContainText(lane);
    }
  });

  test("inventory keeps buying decisions with the trader", async ({ page }) => {
    await page.goto("/services/programmatic");
    await pick(page, "Inventory & deals");
    await expect(panel(page)).toContainText("PMP deal");
    await expect(panel(page)).toContainText("Inventory, deal strategy and buying decisions stay with your traders.");
  });

  test("QA checks the configuration against the booking", async ({ page }) => {
    await page.goto("/services/programmatic");
    await pick(page, "QA");
    for (const c of ["Line items", "Targeting", "Creatives", "Tracking", "Deal configuration", "Flight dates", "Budget & pacing"]) {
      await expect(panel(page).getByText(c, { exact: true }).first()).toBeVisible();
    }
  });

  test("delivery shows operational state without inventing results", async ({ page }) => {
    await page.goto("/services/programmatic");
    await pick(page, "Delivery");
    await expect(panel(page)).toContainText("Delivering");
    await expect(panel(page)).toContainText("No delivery or performance figures are shown.");
  });
});

test.describe("connected creative and adtech systems", () => {
  test("two tracks joined by ad serving", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    await expect(system(page).getByRole("heading", { name: "Creative technology", exact: true })).toBeVisible();
    await expect(system(page).getByRole("heading", { name: "Publisher / AdTech operations", exact: true })).toBeVisible();
    await expect(tabs(page)).toHaveCount(11);
    await pick(page, "Trafficking · Ad serving");
    await expect(panel(page)).toContainText("Where the two systems meet");
    await expect(panel(page)).toContainText("Google Ad Manager");
  });

  test("the creative passes a QA gate before it can be trafficked", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    await pick(page, "Creative QA");
    for (const c of ["Dimensions", "File weight", "Click URL", "Tracking", "Naming"]) {
      await expect(panel(page).getByText(c, { exact: true }).first()).toBeVisible();
    }
    await expect(panel(page)).toContainText("Ready to traffic");
    // Every row of the sheet passes; none is left pending.
    await expect(panel(page).getByText("Pass", { exact: true })).toHaveCount(8);
    await expect(panel(page).getByText("Pending", { exact: true })).toHaveCount(0);
  });

  test("format frames and the ad-server view are labelled as examples", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    await pick(page, "Spec check");
    // The specimen set grew and the frame is now labelled "abstract specimens" rather than
    // "illustrative examples" — same promise, new wording, so the assertion follows it.
    await expect(panel(page)).toContainText("300 × 250");
    await expect(panel(page)).toContainText("728 × 90");
    await expect(panel(page)).toContainText("abstract specimens");

    await pick(page, "Configuration");
    await expect(panel(page)).toContainText("Illustrative interface");
    await expect(panel(page)).toContainText("this is not a Trafficomm product");
  });
});

test.describe("wave 1 pages keep their scope and their claims", () => {
  const paths = ["/services/performance-marketing", "/services/programmatic", "/services/creative-adtech"];

  test("what Trafficomm handles stays in the markup", async ({ page }) => {
    for (const path of paths) {
      await page.goto(path);
      await expect(system(page).getByRole("heading", { name: "What Trafficomm handles" })).toBeVisible();
    }
    // Spot-check terminology that used to live in the capabilities grid.
    await page.goto("/services/performance-marketing");
    for (const t of ["Paid social", "Paid search", "Lead generation", "Campaign architecture"]) {
      await expect(shown(page, t)).toBeVisible();
    }
    await page.goto("/services/creative-adtech");
    for (const t of ["Celtra", "Bonzai", "Google Ad Manager", "Advertising inventory architecture"]) {
      await expect(shown(page, t)).toBeVisible();
    }
  });

  test("no invented performance outcomes", async ({ page }) => {
    for (const path of paths) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(/\b(uplift|increased?|improved?|reduced?|saved)\b[^.]{0,20}\b\d+\s?%/i);
      expect(text).not.toMatch(/\b\d+\s?% (increase|uplift|improvement|reduction|saving)/i);
    }
  });
});

test.describe("reduced motion shows the complete state", () => {
  test.use({ reducedMotion: "reduce" });

  test("each visual rests on its finished state", async ({ page }) => {
    await page.goto("/services/performance-marketing");
    await expect(panel(page)).toContainText("All six signals, together");

    await page.goto("/services/programmatic");
    await expect(tabs(page).nth(7)).toHaveAttribute("aria-selected", "true");
    await expect(panel(page)).toContainText("Operational reporting");

    await page.goto("/services/creative-adtech");
    await expect(tabs(page).nth(10)).toHaveAttribute("aria-selected", "true");
    // The creative QA gate became a specification sheet: the equivalent guarantee is that
    // every check reads as passed, with nothing left pending.
    await pick(page, "Creative QA");
    await expect(panel(page).getByText("Pending", { exact: true })).toHaveCount(0);
    await expect(panel(page).getByText("Pass", { exact: true }).first()).toBeVisible();
  });
});

test.describe("refinement: the pages show their subject, not another diagram", () => {
  test("the performance hero is an operational view, labelled illustrative", async ({ page }) => {
    await page.goto("/services/performance-marketing");
    const hero = page.locator("main section").first();
    await expect(hero.getByText("Illustrative performance view", { exact: true })).toBeVisible();
    await expect(hero.getByText("CPA", { exact: true }).first()).toBeVisible();
    await expect(hero.getByText("Budget allocation", { exact: true })).toBeVisible();
    // Percentages are an allocation split, never a claimed gain.
    await expect(hero).toContainText("42%");
  });

  test("the readout carries the evidence behind each signal", async ({ page }) => {
    await page.goto("/services/performance-marketing");
    // Default view: the trend the observation is about.
    await expect(panel(page)).toContainText("CPA vs target");
    await expect(panel(page)).toContainText("Target $36.00");

    await pick(page, "Budget");
    await expect(panel(page)).toContainText("Budget allocation · illustrative");
    await expect(panel(page)).toContainText("Meta");
    await expect(panel(page)).toContainText("42%");

    await pick(page, "Creative");
    await expect(panel(page)).toContainText("Creative status · illustrative");
    await expect(panel(page)).toContainText("Declining");
  });

  test("the creative hero shows formats, not stock imagery", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    const hero = page.locator("main section").first();
    await expect(hero.getByText("300 × 250", { exact: true })).toBeVisible();
    await expect(hero.getByText("Abstract format specimens — not client creative", { exact: true })).toBeVisible();
    // The specimens are CSS frames, not pictures — the only images in the hero are platform marks.
    await expect(hero.locator("figure img")).toHaveCount(0);
  });

  test("creative and publisher work are parallel inputs to ad serving", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    await pick(page, "Tag");
    await expect(panel(page)).toContainText("Feeds · Trafficking · Ad serving");
    await pick(page, "Configuration");
    await expect(panel(page)).toContainText("Feeds · Trafficking · Ad serving");
    await pick(page, "Delivery");
    await expect(panel(page)).toContainText("Out of the ad server");
  });

  test("publisher inventory is shown as a structure", async ({ page }) => {
    await page.goto("/services/creative-adtech");
    await pick(page, "Inventory");
    await expect(panel(page)).toContainText("Abstract inventory structure");
    await expect(panel(page).getByText("Placement", { exact: true }).first()).toBeVisible();
  });

  test("programmatic states where the object is and what is next", async ({ page }) => {
    await page.goto("/services/programmatic");
    await pick(page, "Media plan");
    await expect(panel(page)).toContainText("Media object here");
    await expect(panel(page)).toContainText("Next · DV360 structure");
    await expect(panel(page)).toContainText("Trafficomm never publishes a client");
    await pick(page, "Reporting");
    await expect(panel(page)).toContainText("End of the operation");
  });

  test("the rest of the route stays visible as context", async ({ page, viewport }) => {
    test.skip(viewport!.width < 1024, "desktop route");
    await page.goto("/services/programmatic");
    await pick(page, "Media plan");
    const faintest = await page
      .locator("section[aria-labelledby=system-title] svg path")
      .evaluateAll((els) => Math.min(...els.map((e) => Number(getComputedStyle(e).opacity))));
    // Future stages are quieter than the travelled route, but never close to invisible.
    expect(faintest).toBeGreaterThanOrEqual(0.4);
  });

  test("ownership and what changes are one band", async ({ page }) => {
    for (const path of ["/services/performance-marketing", "/services/programmatic", "/services/creative-adtech"]) {
      await page.goto(path);
      const band = page.locator("section[aria-labelledby=own-title]");
      await expect(band.getByText("Trafficomm handles", { exact: true })).toBeVisible();
      await expect(band.getByText("What changes operationally", { exact: true })).toBeVisible();
      // The outcomes survived the merge.
      await expect(band.getByRole("heading", { level: 3 })).not.toHaveCount(0);
      await expect(page.getByRole("heading", { name: "What changes for your team" })).toHaveCount(0);
    }
  });

  test("no page invents a performance outcome", async ({ page }) => {
    for (const path of ["/services/performance-marketing", "/services/programmatic", "/services/creative-adtech"]) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(/\b(uplift|increased?|improved?|reduced?|saved)\b[^.]{0,20}\b\d+\s?%/i);
      expect(text).not.toMatch(/\b\d+\s?% (increase|uplift|improvement|reduction|saving)/i);
    }
  });
});

test.describe("refinement: resting state is the start of the story", () => {
  test("the sequence settles on an entry or overview stage", async ({ page, viewport }) => {
    test.skip(viewport!.width !== 1440, "one width is enough for a timing-sensitive check");
    test.setTimeout(90_000);
    await page.goto("/services/programmatic");
    await page.locator("section[aria-labelledby=system-title]").scrollIntoViewIfNeeded();
    // Eight stages at 1.4s, plus the settle step.
    await page.waitForTimeout(14000);
    await expect(tabs(page).nth(0)).toHaveAttribute("aria-selected", "true");

    await page.goto("/services/creative-adtech");
    await page.locator("section[aria-labelledby=system-title]").scrollIntoViewIfNeeded();
    await page.waitForTimeout(18000);
    // Eleven stages, resting on the ad server where the two systems meet.
    await expect(tabs(page).nth(8)).toHaveAttribute("aria-selected", "true");
  });
});

import { expect, test } from "@playwright/test";

const PATH = "/labs/adops-capacity";

async function fresh(page: import("@playwright/test").Page, width = 1440) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(PATH);
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
}

async function toResults(page: import("@playwright/test").Page) {
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(130);
  }
  await page.getByRole("button", { name: /Analyse my ad operations/i }).click();
  await page.waitForTimeout(2600);
}

test.describe("Labs accessibility", () => {
  test("the whole journey is reachable by keyboard alone", async ({ page }) => {
    await fresh(page);
    // Tab to the market cards and select with the keyboard, never the mouse.
    const saudi = page.getByRole("button", { name: /Saudi Arabia/ });
    await saudi.focus();
    await page.keyboard.press("Enter");
    expect(await saudi.getAttribute("aria-pressed")).toBe("true");

    for (let i = 0; i < 5; i++) {
      const cont = page.getByRole("button", { name: "Continue" });
      await cont.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(130);
    }
    const analyse = page.getByRole("button", { name: /Analyse my ad operations/i });
    await analyse.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2600);
    await expect(page.locator("#results-headline")).toBeVisible();
  });

  test("every interactive control has an accessible name", async ({ page }) => {
    await fresh(page);
    await toResults(page);
    const unnamed = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll("button, input, select, textarea, a[href]")];
      return nodes
        .filter((el) => {
          const he = el as HTMLElement;
          if (he.offsetParent === null && he.getAttribute("type") !== "hidden") return false; // not rendered
          const name =
            he.getAttribute("aria-label") ||
            (he.getAttribute("aria-labelledby") && document.getElementById(he.getAttribute("aria-labelledby")!)?.textContent) ||
            (he.id && document.querySelector(`label[for="${CSS.escape(he.id)}"]`)?.textContent) ||
            he.closest("label")?.textContent ||
            he.textContent;
          return !name || !name.trim();
        })
        .map((el) => el.tagName + "." + (el.getAttribute("class") || "").slice(0, 40));
    });
    expect(unnamed).toEqual([]);
  });

  test("focus is moved to the new step rather than left behind", async ({ page }) => {
    await fresh(page);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(250);
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-live"));
    expect(focused).toBe("polite");
  });

  test("the progress rail exposes the current step", async ({ page }) => {
    await fresh(page);
    const nav = page.getByRole("navigation", { name: "Calculator progress" });
    await expect(nav).toBeVisible();
    await expect(nav.locator('[aria-current="step"]')).toHaveCount(1);
    // Steps not yet reached must not be offered.
    expect(await nav.locator("button[disabled]").count()).toBeGreaterThan(0);
  });

  test("charts carry a text equivalent, not colour alone", async ({ page }) => {
    await fresh(page);
    await toResults(page);
    // Each bar chart ships a table of the same figures.
    expect(await page.locator(".sr-only table").count()).toBeGreaterThanOrEqual(2);
    // The stacked bar is described, and the dial has a label with its value.
    await expect(page.getByRole("img", { name: /Operational efficiency score: \d+ out of 100/ })).toBeVisible();
    // Every chart row shows its own value as text beside the bar.
    const firstRow = page.locator("figure ul li").first();
    await expect(firstRow).toContainText(/hrs/);
  });

  test("form errors are announced and tied to their field", async ({ page }) => {
    await fresh(page);
    await toResults(page);
    await page.getByRole("button", { name: /Request a delivery estimate/i }).click();
    await page.waitForTimeout(600);
    const nameField = page.getByLabel("Name", { exact: true });
    await expect(nameField).toHaveAttribute("aria-invalid", "true");
    const describedBy = await nameField.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText(/Enter your name/);
    // Scoped to the form: Next ships its own empty route announcer with role="alert".
    await expect(page.locator("form").getByRole("alert")).toBeVisible();
  });

  test("the tool's own touch targets are at least 44px on the narrowest width", async ({ page }) => {
    await fresh(page, 360);
    // Scoped to the calculator. The shared header, footer and skip link are the
    // site's existing chrome and out of scope here; inline text links are exempt
    // from WCAG 2.2 target sizing in any case.
    const small = await page.evaluate(() => {
      const root = document.querySelector("nav[aria-label='Calculator progress']")?.closest("div");
      if (!root) return [{ t: "calculator root not found", h: 0 }];
      return [...root.querySelectorAll("button, input, [role=radio], [role=tab]")]
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .map((el) => ({ t: el.textContent?.trim().slice(0, 24) || el.getAttribute("aria-label") || el.tagName, h: Math.round(el.getBoundingClientRect().height) }))
        .filter((o) => o.h > 0 && o.h < 44);
    });
    expect(small).toEqual([]);
  });

  test("the results and lead form keep 44px targets on the narrowest width", async ({ page }) => {
    await fresh(page, 360);
    await toResults(page);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll("form button, form input")]
        .filter((el) => {
          const he = el as HTMLElement;
          // Off-screen, aria-hidden and untabbable elements are not targets: the
          // honeypot is positioned off-canvas precisely so no human reaches it.
          if (he.offsetParent === null) return false;
          if (he.closest("[aria-hidden='true']")) return false;
          if (he.getAttribute("tabindex") === "-1") return false;
          return true;
        })
        .map((el) => ({ t: el.textContent?.trim().slice(0, 24) || (el as HTMLInputElement).name || el.tagName, h: Math.round(el.getBoundingClientRect().height) }))
        .filter((o) => o.h > 0 && o.h < 44),
    );
    expect(small).toEqual([]);
  });

  test("reduced motion skips the analysis transition instead of animating it", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await fresh(page);
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Continue" }).click();
      await page.waitForTimeout(120);
    }
    await page.getByRole("button", { name: /Analyse my ad operations/i }).click();
    // Without motion the results are immediate; the staged transition is skipped.
    await expect(page.locator("#results-headline")).toBeVisible({ timeout: 900 });
  });

  test("one h1, and headings descend without skipping a level", async ({ page }) => {
    await fresh(page);
    await toResults(page);
    const levels = await page.evaluate(() =>
      [...document.querySelectorAll("h1,h2,h3,h4")].filter((h) => (h as HTMLElement).offsetParent !== null).map((h) => Number(h.tagName[1])),
    );
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  });
});

test.describe("printable report", () => {
  test("is absent on screen and the only thing visible in print", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PATH);
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Continue" }).click();
      await page.waitForTimeout(130);
    }
    await page.getByRole("button", { name: /Analyse my ad operations/i }).click();
    await page.waitForTimeout(2600);

    // Hidden on screen.
    expect(await page.locator(".labs-report").evaluate((el) => getComputedStyle(el).display)).toBe("none");

    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.body.classList.add("labs-printing"));
    const state = await page.evaluate(() => {
      const report = document.querySelector(".labs-report") as HTMLElement;
      const header = document.querySelector("header") as HTMLElement;
      const form = document.querySelector("form") as HTMLElement;
      return {
        report: getComputedStyle(report).visibility,
        header: header ? getComputedStyle(header).visibility : "absent",
        form: form ? getComputedStyle(form).visibility : "absent",
        text: report.innerText,
      };
    });
    expect(state.report).toBe("visible");
    expect(state.header).toBe("hidden");
    expect(state.form).toBe("hidden");

    // Client-presentable: branding, date, figures, assumptions — and no internal scoring.
    // The brand line is uppercased by CSS, so innerText returns it that way.
    expect(state.text).toMatch(/trafficomm labs/i);
    expect(state.text).toContain("AdOps Capacity Analysis");
    // Section headings are uppercased by CSS too.
    expect(state.text).toMatch(/methodology and assumptions/i);
    expect(state.text).toMatch(/externalizable workload/i);
    expect(state.text).toMatch(/cost of execution/i);
    expect(state.text).toMatch(/SAR/);
    expect(state.text).toMatch(/USD/);
    expect(state.text).not.toMatch(/lead score/i);
    expect(state.text).not.toMatch(/Priority|classification/i);
  });
});

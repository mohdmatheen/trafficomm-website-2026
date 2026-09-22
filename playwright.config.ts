import { defineConfig } from "@playwright/test";

/**
 * QA suite (development only — never shipped).
 * Runs against a production build: `npm run build` first, or use `npm run test:e2e`.
 * Uses the locally installed Chrome (no browser download required).
 */
const PORT = 3300;
// Point the suite at another server (e.g. a baseline build) with BASE_URL; otherwise a local production server is started.
const external = process.env.BASE_URL;

const widths = [
  { name: "w1440", width: 1440, height: 900 },
  { name: "w1280", width: 1280, height: 800 },
  { name: "w1024", width: 1024, height: 768 },
  { name: "w768", width: 768, height: 1024 },
  { name: "w430", width: 430, height: 932, touch: true },
  { name: "w390", width: 390, height: 844, touch: true },
];

export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  outputDir: "./test-results",
  fullyParallel: true,
  workers: 4,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" } },
  use: {
    baseURL: external ?? `http://localhost:${PORT}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: widths.map((w) => ({
    name: w.name,
    use: { viewport: { width: w.width, height: w.height }, hasTouch: Boolean(w.touch), isMobile: Boolean(w.touch) },
  })),
  webServer: external
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});

import { expect, test, type Page } from "@playwright/test";
import { PRODUCTION_ORIGIN, resolveSiteUrl } from "../data/site";
import { aliasRedirectIsSafe, hostRedirects, CANONICAL_HOST, PRODUCTION_ALIAS } from "../lib/host-redirects";

/**
 * Production shipped every canonical, og:url, robots.txt Host and all 37 sitemap
 * URLs pointing at trafficomm-website-2026.vercel.app, because NEXT_PUBLIC_SITE_URL
 * was never set in Vercel and the fallback was the deployment alias. Nothing in the
 * suite noticed. These assertions exist so that class of mistake cannot ship again.
 */

test.describe("canonical origin resolution", () => {
  test("the production domain is the www apex", async () => {
    expect(PRODUCTION_ORIGIN).toBe("https://www.trafficomm.com");
  });

  test("an indexable deployment canonicalises to the production domain, never to a Vercel alias", async () => {
    expect(resolveSiteUrl({ SITE_INDEXABLE: "true", VERCEL_URL: "trafficomm-website-2026.vercel.app" })).toBe(PRODUCTION_ORIGIN);
    expect(resolveSiteUrl({ SITE_INDEXABLE: "true", VERCEL_BRANCH_URL: "anything.vercel.app" })).toBe(PRODUCTION_ORIGIN);
  });

  test("a preview canonicalises to itself, so it can never claim the production URL", async () => {
    const preview = resolveSiteUrl({ VERCEL_BRANCH_URL: "branch-xyz.vercel.app" });
    expect(preview).toBe("https://branch-xyz.vercel.app");
    expect(preview).not.toContain("trafficomm.com");
  });

  test("an explicit override still wins, and a trailing slash is stripped", async () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://example.com/", SITE_INDEXABLE: "true" })).toBe("https://example.com");
  });

  test("local development stays on localhost", async () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
});

test.describe("the alias redirect cannot loop", () => {
  /**
   * Production returned 308 to itself on every path — ERR_TOO_MANY_REDIRECTS — because
   * the rule matched on VERCEL_PROJECT_PRODUCTION_URL, which Vercel sets to the custom
   * production domain, not the vercel.app alias. The rule became
   * "www.trafficomm.com -> www.trafficomm.com".
   */
  test("the alias and the canonical host are different hosts", async () => {
    expect(aliasRedirectIsSafe, "a host redirect to the same host is an infinite loop").toBe(true);
  });

  test("no redirect rule sends a host to itself", async () => {
    for (const rule of hostRedirects(true)) {
      const sourceHost = rule.has.find((h) => h.type === "host")?.value;
      const destinationHost = new URL(rule.destination.replace("/:path*", "")).host;
      expect(destinationHost, `rule for ${sourceHost} redirects to itself`).not.toBe(sourceHost);
    }
  });

  test("the canonical production host is never a redirect source", async () => {
    const canonicalHost = new URL(PRODUCTION_ORIGIN).host;
    expect(CANONICAL_HOST).toBe(canonicalHost);
    for (const rule of hostRedirects(true)) {
      const sourceHost = rule.has.find((h) => h.type === "host")?.value;
      expect(sourceHost, `${canonicalHost} must serve the site, never redirect`).not.toBe(canonicalHost);
    }
  });

  test("the alias redirect preserves the path and targets the canonical host", async () => {
    const [rule] = hostRedirects(true);
    expect(rule.has[0].value).toBe(PRODUCTION_ALIAS);
    expect(rule.destination).toBe(`https://${CANONICAL_HOST}/:path*`);
    expect(rule.source).toBe("/:path*");
  });

  test("a non-indexable deployment emits no host redirect, so previews are untouched", async () => {
    expect(hostRedirects(false)).toEqual([]);
  });
});

test.describe("sitemap", () => {
  const locs = async (page: Page) => {
    const xml = await (await page.request.get("/sitemap.xml")).text();
    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  };

  test("every entry shares one origin and none is a Vercel alias", async ({ page }) => {
    const urls = await locs(page);
    expect(urls.length).toBeGreaterThan(30);
    const origins = new Set(urls.map((u) => new URL(u).origin));
    expect(origins.size, `mixed origins: ${[...origins].join(", ")}`).toBe(1);
    for (const u of urls) expect(u).not.toContain("vercel.app");
  });

  test("no duplicates, no API routes, no query strings, no fragments", async ({ page }) => {
    const urls = await locs(page);
    expect(new Set(urls).size, "duplicate sitemap entries").toBe(urls.length);
    for (const u of urls) {
      expect(u).not.toContain("/api/");
      expect(u).not.toContain("?");
      expect(u).not.toContain("#");
    }
  });

  test("every listed URL is reachable and not a redirect", async ({ page }) => {
    const urls = await locs(page);
    // Relative paths, so Playwright resolves against the server under test rather
    // than the origin baked into the sitemap at build time. Fetched in batches: 37
    // cold server renders one after another starves the other tests of the server.
    const paths = urls.map((u) => new URL(u).pathname || "/");
    for (let i = 0; i < paths.length; i += 6) {
      const batch = paths.slice(i, i + 6);
      const results = await Promise.all(batch.map((p) => page.request.get(p, { maxRedirects: 0 })));
      results.forEach((res, k) => {
        expect(res.status(), `${batch[k]} should be 200, not ${res.status()}`).toBe(200);
      });
    }
  });
});

test.describe("robots", () => {
  test("a non-indexable build disallows everything", async ({ page }) => {
    // The suite builds without SITE_INDEXABLE, which is the preview posture.
    const body = await (await page.request.get("/robots.txt")).text();
    expect(body).toMatch(/User-Agent: \*\s*\nDisallow: \//);
    expect(body).not.toContain("Sitemap:");
  });

  test("the noindex header is present on a non-indexable build", async ({ page }) => {
    const res = await page.request.get("/");
    expect(res.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });
});

test.describe("page metadata", () => {
  const pages = ["/", "/services", "/solutions", "/platforms", "/case-studies", "/how-we-work", "/insights", "/about", "/contact"];

  test("each page has one canonical, one title, one description and one h1", async ({ page }) => {
    const seen = { titles: new Set<string>(), descriptions: new Set<string>() };
    for (const path of pages) {
      await page.goto(path);
      await expect(page.locator("link[rel=canonical]")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      const title = await page.title();
      const description = await page.locator('meta[name=description]').getAttribute("content");
      expect(title, `${path} title`).toBeTruthy();
      expect(description, `${path} description`).toBeTruthy();
      expect(seen.titles.has(title), `duplicate title on ${path}`).toBe(false);
      expect(seen.descriptions.has(description!), `duplicate description on ${path}`).toBe(false);
      seen.titles.add(title);
      seen.descriptions.add(description!);
    }
  });

  test("no page leaks a Vercel or localhost URL into a canonical or Open Graph tag", async ({ page }) => {
    for (const path of ["/", "/services/ad-operations", "/case-studies/mena-agency-ad-operations"]) {
      await page.goto(path);
      const canonical = await page.locator("link[rel=canonical]").getAttribute("href");
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
      for (const value of [canonical, ogUrl]) {
        expect(value, `${path}`).toBeTruthy();
        expect(value, `${path} must not canonicalise to a Vercel alias`).not.toContain("vercel.app");
      }
      expect(canonical).toBe(ogUrl);
    }
  });

  test("an Open Graph image is declared and renders", async ({ page }) => {
    await page.goto("/");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toBeTruthy();
    expect(await page.locator('meta[name="twitter:card"]').getAttribute("content")).toBe("summary_large_image");
    const res = await page.request.get(new URL(og!).pathname + new URL(og!).search);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });

  test("every page carries the Open Graph image, not just the homepage", async ({ page }) => {
    // Declaring openGraph in buildMetadata replaces the resolved parent object, so
    // the file-based image silently vanished everywhere except "/" until it was set
    // explicitly. Checking only the homepage is what let that through.
    for (const path of ["/", "/about", "/services", "/contact", "/ad-operations-outsourcing", "/services/ad-operations"]) {
      await page.goto(path);
      const og = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(og, `${path} has no og:image`).toBeTruthy();
      expect(og).toContain("/opengraph-image");
    }
  });
});

test.describe("structured data", () => {
  const schemas = async (page: Page) =>
    (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));

  test("the Organization entity is valid and claims nothing it cannot support", async ({ page }) => {
    await page.goto("/");
    const all = (await schemas(page)).flat();
    const org = all.find((s) => s["@type"] === "Organization");
    expect(org).toBeDefined();
    expect(org.name).toBe("Trafficomm");
    expect(org.foundingDate).toBe("2015");
    expect(org.url).toBe(org["@id"].replace("/#organization", ""));
    // Nothing invented: no ratings, reviews, awards or unverified profiles.
    for (const forbidden of ["aggregateRating", "review", "award", "hasCredential"]) {
      expect(org[forbidden], `Organization must not claim ${forbidden}`).toBeUndefined();
    }
    // Documented market experience is still stated, but as knowsAbout rather
    // than areaServed: a closed six-country areaServed would claim Trafficomm
    // serves those markets and no others, which is not the case.
    expect(org.areaServed, "areaServed would assert a closed service territory").toBeUndefined();
    expect(org.knowsAbout).toContain("Saudi Arabia");
    expect(org.knowsAbout).toContain("Australia");
  });

  test("every JSON-LD block on key pages parses", async ({ page }) => {
    for (const path of ["/", "/services/ad-operations", "/solutions/media-agencies", "/case-studies/mena-agency-ad-operations"]) {
      await page.goto(path);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length, `${path} has no structured data`).toBeGreaterThan(0);
      for (const b of blocks) expect(() => JSON.parse(b), `${path} has invalid JSON-LD`).not.toThrow();
    }
  });

  test("service pages carry Service schema and a breadcrumb trail", async ({ page }) => {
    await page.goto("/services/ad-operations");
    const all = (await schemas(page)).flat();
    expect(all.find((s) => s["@type"] === "Service")).toBeDefined();
    const crumbs = all.find((s) => s["@type"] === "BreadcrumbList");
    expect(crumbs).toBeDefined();
    expect(crumbs.itemListElement.length).toBeGreaterThan(1);
  });
});

import { expect, test } from "@playwright/test";
import { allowlist, isAllowed, mintLoginToken, mintSessionToken, verify } from "../lib/auth/session";

/**
 * Dashboard access control.
 *
 * The HTTP tests run against the built site, which the suite starts without
 * `ADMIN_AUTH_SECRET` or `ADMIN_ALLOWED_EMAILS` — the unconfigured posture. That
 * is deliberately the most important case to pin: a deployment that forgot to
 * set the secret must deny everyone, not admit everyone.
 *
 * The token tests set the environment directly, because the signing logic is
 * pure and testing it through a browser would prove less, more slowly.
 *
 * Pinned to one project: access control does not vary by viewport width, and
 * repeating it six times only lengthens the run.
 */

test.describe("unconfigured deployments deny access", () => {
  test("the lead list is not reachable without a session", async ({ page }) => {
    const res = await page.goto("/admin/leads");
    // Either redirected to sign-in or refused; never the lead table.
    expect(page.url()).toContain("/admin/login");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("table")).toHaveCount(0);
  });

  test("the status endpoint refuses an unauthenticated request", async ({ request }) => {
    const res = await request.post("/api/admin/leads/00000000-0000-4000-8000-000000000000/status", {
      data: { status: "QUALIFIED" },
      failOnStatusCode: false,
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test("an unauthenticated request cannot learn whether a lead exists", async ({ request }) => {
    const real = await request.post("/api/admin/leads/11111111-1111-4111-8111-111111111111/status", { data: { status: "QUALIFIED" }, failOnStatusCode: false });
    const fake = await request.post("/api/admin/leads/22222222-2222-4222-8222-222222222222/status", { data: { status: "QUALIFIED" }, failOnStatusCode: false });
    // Authorisation is checked before the id is, so both answer identically.
    expect(real.status()).toBe(fake.status());
    expect(await real.text()).toBe(await fake.text());
  });

  test("a forged session cookie is rejected", async ({ request }) => {
    const res = await request.post("/api/admin/leads/00000000-0000-4000-8000-000000000000/status", {
      data: { status: "QUALIFIED" },
      headers: { Cookie: "tc_admin=eyJmYWtlIjoxfQ.not-a-real-signature" },
      failOnStatusCode: false,
    });
    expect(res.status()).toBe(401);
  });

  test("sign-in answers uniformly whether or not an address is authorised", async ({ request }) => {
    const a = await request.post("/api/admin/login", { data: { email: "someone@trafficomm.com" }, failOnStatusCode: false });
    const b = await request.post("/api/admin/login", { data: { email: "attacker@example.com" }, failOnStatusCode: false });
    expect(a.status()).toBe(b.status());
    expect(await a.text()).toBe(await b.text());
  });

  test("admin pages are noindex on every deployment", async ({ page }) => {
    await page.goto("/admin/login");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toContain("noindex");
    expect(robots).toContain("nofollow");
  });

  test("nothing on the public site links to the dashboard", async ({ page }) => {
    for (const path of ["/", "/contact"]) {
      await page.goto(path);
      await expect(page.locator('a[href^="/admin"]')).toHaveCount(0);
    }
  });

  test("the admin route is absent from the sitemap", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).not.toContain("/admin");
  });
});

test.describe("token verification", () => {
  const withEnv = <T,>(secret: string, emails: string, fn: () => T): T => {
    const s = process.env.ADMIN_AUTH_SECRET;
    const e = process.env.ADMIN_ALLOWED_EMAILS;
    process.env.ADMIN_AUTH_SECRET = secret;
    process.env.ADMIN_ALLOWED_EMAILS = emails;
    try {
      return fn();
    } finally {
      if (s === undefined) delete process.env.ADMIN_AUTH_SECRET;
      else process.env.ADMIN_AUTH_SECRET = s;
      if (e === undefined) delete process.env.ADMIN_ALLOWED_EMAILS;
      else process.env.ADMIN_ALLOWED_EMAILS = e;
    }
  };

  const SECRET = "test-secret-not-used-anywhere-real";
  const EMAILS = "ops@trafficomm.com, Lead@Trafficomm.com";

  test("an allowlisted address round-trips", () => {
    withEnv(SECRET, EMAILS, () => {
      const result = verify("session", mintSessionToken("ops@trafficomm.com"));
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.email).toBe("ops@trafficomm.com");
    });
  });

  test("the allowlist is case-insensitive and whitespace-tolerant", () => {
    withEnv(SECRET, EMAILS, () => {
      expect(isAllowed("LEAD@trafficomm.com")).toBe(true);
      expect(isAllowed("  ops@trafficomm.com ")).toBe(true);
      expect(allowlist()).toHaveLength(2);
    });
  });

  test("an address not on the allowlist is refused even with a valid signature", () => {
    // Minted while allowed, verified after removal — the check happens at
    // verification, so revoking access takes effect immediately.
    const token = withEnv(SECRET, "temp@trafficomm.com", () => mintSessionToken("temp@trafficomm.com"));
    withEnv(SECRET, "ops@trafficomm.com", () => {
      const result = verify("session", token);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toBe("not_allowed");
    });
  });

  test("a login token cannot be replayed as a session", () => {
    withEnv(SECRET, EMAILS, () => {
      const login = mintLoginToken("ops@trafficomm.com");
      const asSession = verify("session", login);
      expect(asSession.ok, "kind is inside the signed payload").toBe(false);
      expect(verify("login", login).ok).toBe(true);
    });
  });

  test("a token signed with another secret is refused", () => {
    const foreign = withEnv("a-different-secret", EMAILS, () => mintSessionToken("ops@trafficomm.com"));
    withEnv(SECRET, EMAILS, () => {
      const result = verify("session", foreign);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toBe("bad_signature");
    });
  });

  test("a tampered payload is refused", () => {
    withEnv(SECRET, EMAILS + ", attacker@example.com", () => {
      const token = mintSessionToken("ops@trafficomm.com");
      const [body, sig] = [token.slice(0, token.lastIndexOf(".")), token.slice(token.lastIndexOf(".") + 1)];
      const payload = Buffer.from(body, "base64url").toString("utf8").replace("ops@trafficomm.com", "attacker@example.com");
      const forged = `${Buffer.from(payload, "utf8").toString("base64url")}.${sig}`;
      const result = verify("session", forged);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toBe("bad_signature");
    });
  });

  test("without a secret, nothing verifies", () => {
    const token = withEnv(SECRET, EMAILS, () => mintSessionToken("ops@trafficomm.com"));
    const s = process.env.ADMIN_AUTH_SECRET;
    delete process.env.ADMIN_AUTH_SECRET;
    try {
      const result = verify("session", token);
      expect(result.ok, "an unconfigured deployment must deny, not default open").toBe(false);
      if (!result.ok) expect(result.reason).toBe("unconfigured");
    } finally {
      if (s !== undefined) process.env.ADMIN_AUTH_SECRET = s;
    }
  });

  test("malformed input is refused rather than thrown", () => {
    withEnv(SECRET, EMAILS, () => {
      for (const bad of ["", "no-dot", "...", "!!!.$$$", "a".repeat(5000)]) {
        const result = verify("session", bad);
        expect(result.ok).toBe(false);
      }
      expect(verify("session", undefined).ok).toBe(false);
      expect(verify("session", null).ok).toBe(false);
    });
  });
});

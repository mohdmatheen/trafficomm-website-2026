import { expect, test } from "@playwright/test";
import { assessmentEmailConfig, assessmentSubject, buildAssessmentEmail, buildProviderRequest } from "../lib/assessment-email";
import type { AssessmentRecord } from "../lib/assessment-email";
import { limits, sanitizeContext, validateAssessment } from "../lib/assessment";
import { isDuplicateSubmission, resetRecentSubmissions } from "../lib/recent-submissions";

/**
 * The assessment email is the one place a lead exists before anyone reads it.
 * These assertions cover what must be true of it: the five surviving fields are
 * all present, the removed fields never come back, a reply reaches the prospect,
 * and a misconfiguration is loud rather than silent.
 */

const record = (over: Partial<AssessmentRecord> = {}): AssessmentRecord => ({
  type: "operations_assessment",
  name: "Jane Okonkwo",
  company: "Meridian Media",
  email: "jane@meridianmedia.ae",
  campaignsPerMonth: "50–100",
  challenge: "Trafficking volume spikes at quarter end and QA slips.",
  submittedAt: "2026-09-24T01:00:00.000Z",
  environment: "production",
  ...over,
});

test.describe("assessment email", () => {
  test("carries all five surviving fields", async () => {
    const { text } = buildAssessmentEmail(record());
    for (const value of ["Jane Okonkwo", "Meridian Media", "jane@meridianmedia.ae", "50–100", "Trafficking volume spikes at quarter end and QA slips."]) {
      expect(text).toContain(value);
    }
    for (const label of ["Name", "Company", "Work email", "Campaign volume (per month)", "Biggest operational challenge"]) {
      expect(text).toContain(label);
    }
  });

  test("never reintroduces the removed market or platform fields", async () => {
    const { subject, text } = buildAssessmentEmail(record());
    expect(`${subject}\n${text}`).not.toMatch(/\bmarkets?\b|\bplatforms?\b/i);
  });

  test("subject names the company and the request type", async () => {
    expect(assessmentSubject(record())).toBe("New Trafficomm Assessment Request — Meridian Media");
    expect(assessmentSubject(record({ type: "call_request" }))).toBe("New Trafficomm Call Request — Meridian Media");
  });

  test("a reply goes to the prospect, not to Trafficomm", async () => {
    expect(buildAssessmentEmail(record()).replyTo).toBe("jane@meridianmedia.ae");
  });

  test("subject cannot carry a forged header line", async () => {
    const subject = assessmentSubject(record({ company: "Acme\r\nBcc: attacker@example.com" }));
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toContain("Acme");
  });

  test("an optional empty challenge is stated, not left blank", async () => {
    expect(buildAssessmentEmail(record({ challenge: "" })).text).toContain("not provided");
  });

  test("a non-production submission is labelled so it is never mistaken for a lead", async () => {
    const preview = buildAssessmentEmail(record({ environment: "preview" }));
    expect(preview.subject).toBe("[preview] New Trafficomm Assessment Request — Meridian Media");
    expect(preview.text).toContain("test submission, not a real lead");
  });
});

test.describe("html body", () => {
  test("carries the same five fields as the plain-text body", async () => {
    const { html } = buildAssessmentEmail(record());
    for (const value of ["Jane Okonkwo", "Meridian Media", "jane@meridianmedia.ae", "50–100", "Trafficking volume spikes at quarter end and QA slips."]) {
      expect(html).toContain(value);
    }
  });

  test("both bodies are always sent, so text is a fallback and not a replacement", async () => {
    const email = buildAssessmentEmail(record());
    expect(email.text.length).toBeGreaterThan(0);
    expect(email.html).toContain("<!DOCTYPE html>");
  });

  test("escapes visitor input instead of rendering it as markup", async () => {
    const { html } = buildAssessmentEmail(record({ company: "Acme <script>alert(1)</script>", challenge: "5 > 3 && \"quoted\"" }));
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&gt; 3 &amp;&amp;");
  });

  test("uses no remote images or external stylesheets", async () => {
    const { html } = buildAssessmentEmail(record());
    expect(html).not.toMatch(/<img|<link|https?:\/\/[^"']*\.(css|png|jpe?g|gif|svg)/i);
  });

  test("attribution appears when present and is absent otherwise", async () => {
    const plain = buildAssessmentEmail(record());
    expect(plain.text).not.toContain("Submitted from");
    expect(plain.html).not.toContain("Attribution");

    const attributed = buildAssessmentEmail(
      record({ context: { path: "/contact", referrer: "https://www.linkedin.com/feed/", utm: { source: "linkedin", campaign: "q4-ops" } } }),
    );
    for (const value of ["/contact", "https://www.linkedin.com/feed/", "linkedin", "q4-ops"]) {
      expect(attributed.text).toContain(value);
      expect(attributed.html).toContain(value);
    }
    expect(attributed.text).toContain("utm_source");
  });

  test("carries no device or browser identification", async () => {
    const { text, html } = buildAssessmentEmail(record({ context: { path: "/contact" } }));
    expect(`${text}${html}`).not.toMatch(/user-?agent|Mozilla|ip address|\bcookie\b/i);
  });
});

test.describe("submission context is not trusted", () => {
  test("keeps a site-relative path and rejects an absolute URL", async () => {
    expect(sanitizeContext({ path: "/services/ad-operations" }).path).toBe("/services/ad-operations");
    expect(sanitizeContext({ path: "https://evil.example/phish" }).path).toBeUndefined();
    expect(sanitizeContext({ path: "javascript:alert(1)" }).path).toBeUndefined();
  });

  test("keeps an http referrer and rejects anything else", async () => {
    expect(sanitizeContext({ referrer: "https://www.google.com/" }).referrer).toBe("https://www.google.com/");
    expect(sanitizeContext({ referrer: "data:text/html,<script>" }).referrer).toBeUndefined();
  });

  test("clamps length and strips newlines", async () => {
    const context = sanitizeContext({ utm: { source: `${"x".repeat(500)}\r\nBcc: attacker@example.com` } });
    expect(context.utm!.source!.length).toBeLessThanOrEqual(300);
    expect(context.utm!.source).not.toMatch(/[\r\n]/);
  });

  test("drops unknown properties rather than passing them through", async () => {
    const context = sanitizeContext({ path: "/", utm: { source: "ok", evil: "x" }, cookies: "session=1", userAgent: "Mozilla" }) as Record<string, unknown>;
    expect(Object.keys(context).sort()).toEqual(["path", "utm"]);
    expect(Object.keys(context.utm as object)).toEqual(["source"]);
  });

  test("a non-object context is ignored, not an error", async () => {
    expect(sanitizeContext(null)).toEqual({});
    expect(sanitizeContext("string")).toEqual({});
    expect(sanitizeContext(42)).toEqual({});
  });
});

test.describe("server-side validation", () => {
  const valid = { name: "Jane", company: "Meridian", email: "jane@meridian.ae", volume: "50–100", challenge: "", intent: "assessment" as const };

  test("accepts a valid submission", async () => {
    expect(validateAssessment(valid)).toEqual({});
  });

  test("requires name, company, email and volume", async () => {
    expect(Object.keys(validateAssessment({})).sort()).toEqual(["company", "email", "name", "volume"]);
  });

  test("rejects a malformed email and a free-mail address", async () => {
    expect(validateAssessment({ ...valid, email: "not-an-email" }).email).toMatch(/valid email/);
    expect(validateAssessment({ ...valid, email: "jane@gmail.com" }).email).toMatch(/work email/);
  });

  test("rejects an address list, so Reply-To can never become two recipients", async () => {
    for (const email of ["jane@meridian.ae,attacker@evil.example", "jane@meridian.ae;attacker@evil.example", "Jane <jane@meridian.ae>", 'jane"@meridian.ae']) {
      expect(validateAssessment({ ...valid, email }).email, email).toBeDefined();
    }
  });

  test("bounds every field length", async () => {
    expect(validateAssessment({ ...valid, name: "x".repeat(limits.name + 1) }).name).toBeDefined();
    expect(validateAssessment({ ...valid, company: "x".repeat(limits.company + 1) }).company).toBeDefined();
    expect(validateAssessment({ ...valid, challenge: "x".repeat(limits.challenge + 1) }).challenge).toBeDefined();
  });

  test("rejects an unexpected volume rather than coercing it", async () => {
    expect(validateAssessment({ ...valid, volume: "one million" }).volume).toBeDefined();
  });

  test("rejects an unexpected intent, which decides the subject line", async () => {
    expect(validateAssessment({ ...valid, intent: "invoice" as never }).intent).toBeDefined();
  });

  test("non-string values do not pass as content", async () => {
    expect(validateAssessment({ name: 42 as never, company: {} as never, email: [] as never, volume: null as never })).toMatchObject({
      name: expect.any(String),
      company: expect.any(String),
      email: expect.any(String),
      volume: expect.any(String),
    });
  });
});

test.describe("duplicate submissions", () => {
  test.beforeEach(() => resetRecentSubmissions());

  test("the same enquiry twice in a row is caught the second time", async () => {
    expect(isDuplicateSubmission("a")).toBe(false);
    expect(isDuplicateSubmission("a")).toBe(true);
  });

  test("different enquiries are never confused", async () => {
    expect(isDuplicateSubmission("a")).toBe(false);
    expect(isDuplicateSubmission("b")).toBe(false);
  });

  test("the same enquiry is allowed again after the window", async () => {
    const now = Date.now();
    expect(isDuplicateSubmission("a", now)).toBe(false);
    expect(isDuplicateSubmission("a", now + 91_000)).toBe(false);
  });
});

test.describe("email configuration", () => {
  test("is absent, not broken, when nothing is set", async () => {
    expect(assessmentEmailConfig({})).toBeNull();
  });

  test("reads a complete configuration", async () => {
    const config = assessmentEmailConfig({
      ASSESSMENT_EMAIL_PROVIDER: "postmark",
      ASSESSMENT_EMAIL_API_KEY: "token",
      ASSESSMENT_EMAIL_FROM: "ops@example.com",
      ASSESSMENT_EMAIL_TO: "inbox@example.com",
    });
    expect(config).toEqual({ provider: "postmark", apiKey: "token", from: "ops@example.com", to: "inbox@example.com" });
  });

  test("refuses a half-configured provider instead of sending nowhere", async () => {
    expect(() =>
      assessmentEmailConfig({ ASSESSMENT_EMAIL_PROVIDER: "resend", ASSESSMENT_EMAIL_API_KEY: "key" }),
    ).toThrow(/ASSESSMENT_EMAIL_FROM/);
  });

  test("refuses an unknown provider", async () => {
    expect(() => assessmentEmailConfig({ ASSESSMENT_EMAIL_PROVIDER: "sendmail" })).toThrow(/postmark/);
  });
});

test.describe("provider request shape", () => {
  const config = { apiKey: "secret-token", from: "ops@trafficomm.example", to: "inbox@trafficomm.example" };

  test("postmark request matches the documented API", async () => {
    const req = buildProviderRequest({ provider: "postmark", ...config }, record());
    expect(req.url).toBe("https://api.postmarkapp.com/email");
    expect(req.headers["X-Postmark-Server-Token"]).toBe("secret-token");
    expect(req.body).toEqual({
      From: "ops@trafficomm.example",
      To: "inbox@trafficomm.example",
      ReplyTo: "jane@meridianmedia.ae",
      Subject: "New Trafficomm Assessment Request — Meridian Media",
      HtmlBody: expect.stringContaining("Meridian Media"),
      TextBody: expect.stringContaining("Meridian Media"),
      MessageStream: "outbound",
    });
  });

  test("resend request matches the documented API", async () => {
    const req = buildProviderRequest({ provider: "resend", ...config }, record());
    expect(req.url).toBe("https://api.resend.com/emails");
    expect(req.headers.Authorization).toBe("Bearer secret-token");
    expect(req.body).toEqual({
      from: "ops@trafficomm.example",
      to: ["inbox@trafficomm.example"],
      reply_to: "jane@meridianmedia.ae",
      subject: "New Trafficomm Assessment Request — Meridian Media",
      html: expect.stringContaining("Meridian Media"),
      text: expect.stringContaining("Meridian Media"),
    });
  });
});

test.describe("no secret reaches the browser", () => {
  test("no delivery variable is exposed to the client bundle", async ({ page }) => {
    await page.goto("/contact");
    const leaked = await page.evaluate(() => {
      const haystack = [...document.querySelectorAll("script")].map((s) => s.textContent ?? "").join("\n");
      return ["ASSESSMENT_EMAIL_API_KEY", "ASSESSMENT_EMAIL_TO", "ASSESSMENT_EMAIL_FROM", "ASSESSMENT_WEBHOOK_URL"].filter((k) => haystack.includes(k));
    });
    expect(leaked).toEqual([]);
  });
});

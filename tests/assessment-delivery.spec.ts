import { expect, test } from "@playwright/test";
import { assessmentEmailConfig, assessmentSubject, buildAssessmentEmail, buildProviderRequest } from "../lib/assessment-email";
import type { AssessmentRecord } from "../lib/assessment-email";

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

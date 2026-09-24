import { NextResponse } from "next/server";
import { validateAssessment, type AssessmentInput } from "@/lib/assessment";
import { assessmentEmailConfig, buildAssessmentEmail, sendAssessmentEmail, type AssessmentRecord } from "@/lib/assessment-email";
import { isPreviewDeployment } from "@/lib/deployment";

/**
 * Receives Operations Assessment requests and delivers them to every channel
 * that is configured. Two are supported, and they are not alternatives — a CRM
 * and an inbox are different destinations, so both run when both are set.
 *
 *   Email    ASSESSMENT_EMAIL_PROVIDER (postmark | resend), ASSESSMENT_EMAIL_API_KEY,
 *            ASSESSMENT_EMAIL_FROM, ASSESSMENT_EMAIL_TO
 *   Webhook  ASSESSMENT_WEBHOOK_URL — the submission is POSTed as JSON, now
 *            carrying a ready-made `subject`, `replyTo` and `text` so a relay
 *            (Zapier, Make, n8n, Pipedream) can send the notification without
 *            composing anything itself.
 *
 * With neither configured, production fails loudly (503) rather than silently
 * discarding a lead; development accepts submissions for testing.
 */
export async function POST(request: Request) {
  let body: Partial<AssessmentInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing.
  if (body.website) return NextResponse.json({ ok: true });

  const errors = validateAssessment(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const record: AssessmentRecord = {
    type: body.intent === "call" ? "call_request" : "operations_assessment",
    name: body.name!.trim(),
    company: body.company!.trim(),
    email: body.email!.trim(),
    campaignsPerMonth: body.volume!,
    challenge: body.challenge?.trim() ?? "",
    submittedAt: new Date().toISOString(),
    environment: isPreviewDeployment ? "preview" : process.env.NODE_ENV === "production" ? "production" : "development",
  };

  let email;
  try {
    email = assessmentEmailConfig();
  } catch (err) {
    // Misconfiguration is ours, not the visitor's; it must not look like a valid submission.
    console.error("[assessment] email delivery misconfigured:", err);
    return NextResponse.json({ ok: false, message: "Submissions are temporarily unavailable. Please try again later." }, { status: 503 });
  }
  const webhook = process.env.ASSESSMENT_WEBHOOK_URL;

  if (!email && !webhook) {
    // Preview deployments never forward data anywhere; they say so plainly.
    if (isPreviewDeployment) {
      return NextResponse.json(
        { ok: false, message: "This is a preview deployment — form submissions are disabled. Nothing was sent." },
        { status: 503 },
      );
    }
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, message: "Submissions are temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, delivered: false });
  }

  const deliveries: Promise<unknown>[] = [];
  if (email) deliveries.push(sendAssessmentEmail(email, record));
  if (webhook) deliveries.push(postWebhook(webhook, record));

  // Every configured channel must succeed. Reporting success while one destination
  // silently dropped the lead is the failure this route exists to prevent.
  const results = await Promise.allSettled(deliveries);
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failed.length) {
    for (const f of failed) console.error("[assessment] delivery failed:", f.reason);
    return NextResponse.json({ ok: false, message: "We couldn't send your request. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}

async function postWebhook(url: string, record: AssessmentRecord) {
  const { subject, text, replyTo } = buildAssessmentEmail(record);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // The flat fields stay for CRM mappings that already read them; subject/replyTo/text
    // are additions so an email relay needs no mapping logic of its own.
    body: JSON.stringify({ ...record, subject, replyTo, text }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

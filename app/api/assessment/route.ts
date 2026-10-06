import { NextResponse, after } from "next/server";
import { sanitizeContext, validateAssessment, type AssessmentInput } from "@/lib/assessment";
import { assessmentEmailConfig, buildAssessmentEmail, sendAssessmentEmail, type AssessmentRecord } from "@/lib/assessment-email";
import { isDuplicateSubmission } from "@/lib/recent-submissions";
import { isPreviewDeployment } from "@/lib/deployment";
import { attributionColumns, sanitizeAttribution } from "@/lib/attribution";
import { deriveIdempotencyKey, persistWithRetry } from "@/lib/leads/persist";

/**
 * Receives Operations Assessment requests and delivers them to every channel
 * that is configured. Two are supported, and they are not alternatives — a CRM
 * and an inbox are different destinations, so both run when both are set.
 *
 *   Email    ASSESSMENT_EMAIL_PROVIDER (postmark | resend), ASSESSMENT_EMAIL_API_KEY,
 *            ASSESSMENT_EMAIL_FROM, ASSESSMENT_EMAIL_TO
 *   Webhook  ASSESSMENT_WEBHOOK_URL — the submission is POSTed as JSON, carrying a
 *            ready-made `subject`, `replyTo`, `text` and `html` so a relay
 *            (Zapier, Make, n8n, Pipedream) can send the notification without
 *            composing anything itself.
 *
 * With neither configured, production fails loudly (503) rather than silently
 * discarding a lead; development accepts submissions for testing.
 *
 * The record is assembled field by field from validated input. The request body
 * is never spread, so no additional property a caller invents can reach an email,
 * and the recipient and sender are read only from the environment.
 */

/** The form's largest field is capped at 2,000 characters; 16 KB is generous for the whole body. */
const MAX_BODY_BYTES = 16_384;

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return NextResponse.json({ ok: false, message: "Request too large." }, { status: 413 });

  let body: Partial<AssessmentInput> & { context?: unknown };
  try {
    // Read as text first: a chunked request can exceed the cap without declaring it.
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false, message: "Request too large." }, { status: 413 });
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed;
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
  const context = sanitizeContext(body.context);
  if (Object.keys(context).length) record.context = context;
  const attribution = sanitizeAttribution((body as { attribution?: unknown }).attribution);
  // Minted by the browser once per form mount, so a visitor's own retry resolves
  // to the same lead rather than a second one.
  const submissionId = typeof (body as { submissionId?: unknown }).submissionId === "string" ? (body as { submissionId: string }).submissionId : null;
  const idempotencyKey = deriveIdempotencyKey({
    submissionId,
    source: record.type,
    email: record.email,
    company: record.company,
    submittedAt: record.submittedAt,
  });
  // Travels with the webhook payload so a recovery call can reproduce exactly
  // this key, which is what makes recovery unable to duplicate the lead.
  record.idempotencyKey = idempotencyKey;

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

  // An identical enquiry inside the window is answered as success without sending
  // again: the visitor's request did arrive, and they should not be told it failed.
  const fingerprint = [record.type, record.email, record.company, record.campaignsPerMonth, record.challenge].join("\u0000").toLowerCase();
  if (isDuplicateSubmission(fingerprint)) return NextResponse.json({ ok: true, duplicate: true });

  const deliveries: Promise<unknown>[] = [];
  if (email) deliveries.push(sendAssessmentEmail(email, record));
  if (webhook) deliveries.push(postWebhook(webhook, record));

  // Every configured channel must succeed. Reporting success while one destination
  // silently dropped the lead is the failure this route exists to prevent.
  const results = await Promise.allSettled(deliveries);
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failed.length) {
    // Provider detail goes to the server log only — never into the response.
    for (const f of failed) console.error("[assessment] delivery failed:", f.reason);
    return NextResponse.json({ ok: false, message: "We couldn't send your request. Please try again." }, { status: 502 });
  }

  // Persistence runs after the response, not before it.
  //
  // Delivery has already succeeded, so the prospect is told so immediately and
  // the database work happens behind that: `after` keeps the function alive once
  // the response has been sent, which buys several retries without a visitor
  // waiting for any of them. The ordering is deliberate in both directions — the
  // inbox first, so a database outage can never show a failure for an enquiry
  // that did arrive; retries second, so a transient outage does not quietly cost
  // us the row.
  after(async () => {
    await persistWithRetry({
      source: record.type === "call_request" ? "website_call" : "website_assessment",
      email: record.email,
      submittedAt: record.submittedAt,
      idempotencyKey,
      company: record.company,
      requirement: record.challenge || null,
      campaignVolume: record.campaignsPerMonth,
      // The form asks for one name field, so splitting it into first/last would be
      // inventing a structure the visitor never supplied.
      firstName: record.name,
      attribution: attributionColumns(attribution),
    });
  });

  return NextResponse.json({ ok: true, delivered: true });
}

async function postWebhook(url: string, record: AssessmentRecord) {
  const { subject, text, html, replyTo } = buildAssessmentEmail(record);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // The flat fields stay for CRM mappings that already read them; subject/replyTo/text/html
    // are additions so an email relay needs no mapping logic of its own.
    body: JSON.stringify({ ...record, subject, replyTo, text, html }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

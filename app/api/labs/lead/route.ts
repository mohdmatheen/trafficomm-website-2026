import { NextResponse } from "next/server";
import { assessmentEmailConfig, sendEmail } from "@/lib/assessment-email";
import { isPreviewDeployment } from "@/lib/deployment";
import { buildLabsLeadEmail, sanitizeLabsContext, validateLabsLead, type LabsLeadInput, type LabsLeadRecord } from "@/lib/labs/lead";
import { isDuplicateSubmission } from "@/lib/recent-submissions";
import { attributionColumns } from "@/lib/attribution";
import { recordLead } from "@/lib/leads/store";

/**
 * Delivery-estimate requests from the AdOps Capacity calculator.
 *
 * Deliberately a sibling of /api/assessment rather than a branch inside it: the
 * payload, the validation and the email body are different enough that sharing
 * one handler would mean two shapes fighting over the same code path. What is
 * shared is the part that matters — the provider configuration, the duplicate
 * guard and the rule that a configured channel failing means the submission is
 * refused rather than silently dropped.
 *
 * Channels: ASSESSMENT_EMAIL_* for the inbox, LABS_LEAD_WEBHOOK_URL (falling
 * back to ASSESSMENT_WEBHOOK_URL) for a CRM.
 */

const MAX_BODY_BYTES = 8_192;

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return NextResponse.json({ ok: false, message: "Request too large." }, { status: 413 });

  let body: LabsLeadInput;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false, message: "Request too large." }, { status: 413 });
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as LabsLeadInput;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: answer as success so a bot learns nothing from the difference.
  if (body.website) return NextResponse.json({ ok: true });

  const errors = validateLabsLead(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const record: LabsLeadRecord = {
    type: "labs_delivery_estimate",
    tool: "adops-capacity",
    name: String(body.name).trim().slice(0, 200),
    company: String(body.company).trim().slice(0, 200),
    email: String(body.email).trim().slice(0, 200),
    role: (body.role ?? "").trim().slice(0, 120),
    phone: (body.phone ?? "").trim().slice(0, 40),
    submittedAt: new Date().toISOString(),
    environment: isPreviewDeployment ? "preview" : process.env.NODE_ENV === "production" ? "production" : "development",
    context: sanitizeLabsContext(body.context),
  };

  let email;
  try {
    email = assessmentEmailConfig();
  } catch (err) {
    console.error("[labs-lead] email delivery misconfigured:", err);
    return NextResponse.json({ ok: false, message: "Requests are temporarily unavailable. Please try again later." }, { status: 503 });
  }
  const webhook = process.env.LABS_LEAD_WEBHOOK_URL || process.env.ASSESSMENT_WEBHOOK_URL;

  if (!email && !webhook) {
    if (isPreviewDeployment) {
      return NextResponse.json(
        { ok: false, message: "This is a preview deployment — requests are disabled. Nothing was sent." },
        { status: 503 },
      );
    }
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ ok: false, message: "Requests are temporarily unavailable. Please try again later." }, { status: 503 });
    }
    // Development: let the flow be exercised end to end without a provider.
    return NextResponse.json({ ok: true, delivered: false });
  }

  const fingerprint = ["labs", record.email, record.company, Math.round(record.context.externalizableHours)].join("\u0000").toLowerCase();
  if (isDuplicateSubmission(fingerprint)) return NextResponse.json({ ok: true, duplicate: true });

  const composed = buildLabsLeadEmail(record);
  const deliveries: Promise<unknown>[] = [];
  if (email) deliveries.push(sendEmail(email, composed));
  if (webhook) deliveries.push(postWebhook(webhook, record, composed));

  const results = await Promise.allSettled(deliveries);
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failed.length) {
    for (const f of failed) console.error("[labs-lead] delivery failed:", f.reason);
    return NextResponse.json({ ok: false, message: "We couldn't send your request. Please try again." }, { status: 502 });
  }

  // After delivery, and unable to fail the request — same reasoning as
  // /api/assessment: the inbox already has the lead.
  await recordLead({
    source: "website_labs",
    email: record.email,
    submittedAt: record.submittedAt,
    company: record.company,
    firstName: record.name,
    jobTitle: record.role || null,
    countryCode: record.context.market === "Saudi Arabia" ? "SA" : record.context.market === "UAE" ? "AE" : null,
    // The calculator's own market and volume, which is the closest thing the
    // Labs flow has to a stated requirement.
    requirement: `${Math.round(record.context.externalizableHours)} hrs/mo externalizable`,
    campaignVolume: String(record.context.campaignsPerMonth),
    attribution: attributionColumns(record.context.attribution),
  });

  return NextResponse.json({ ok: true, delivered: true });
}

async function postWebhook(url: string, record: LabsLeadRecord, composed: ReturnType<typeof buildLabsLeadEmail>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Flat fields for a CRM mapping, plus a ready-made message so a relay needs
    // no composition logic of its own — the same contract /api/assessment uses.
    body: JSON.stringify({ ...record, ...composed }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

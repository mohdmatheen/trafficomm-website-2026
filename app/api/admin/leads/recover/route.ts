import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/auth/require";
import { sanitizeAttribution, attributionColumns } from "@/lib/attribution";
import { insertLead } from "@/lib/leads/store";
import { submissionRef } from "@/lib/leads/persist";
import { LEAD_SOURCES, type LeadSource } from "@/lib/leads/types";

/**
 * Re-ingests a lead that was delivered but not persisted.
 *
 * The input is the payload `ASSESSMENT_WEBHOOK_URL` already receives, so a lead
 * sitting in a CRM or a relay after a database outage can be restored with one
 * authenticated POST and no retyping.
 *
 * This module does not import the email sender, the webhook poster or anything
 * that can reach either. That is the point and it is why it is a separate route
 * rather than a flag on the submission handler: the guarantee that recovery
 * cannot re-notify anyone is a property of what this file can reference, not of
 * a branch somebody has to remember to take. The lead was delivered when it was
 * first submitted; delivering it again would send Trafficomm a duplicate
 * notification for an enquiry it already has.
 *
 * Idempotent by construction. The key comes from the payload, the database holds
 * a unique index on it, and `insertLead` returns the existing row on conflict —
 * so running this twice, or ten times, produces one lead.
 */
export async function POST(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false, message: "Not authorised." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const str = (v: unknown, max = 300): string | null => {
    if (typeof v !== "string") return null;
    const t = v.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
    return t || null;
  };

  const idempotencyKey = str(body.idempotencyKey, 120);
  const email = str(body.email, 254);
  const submittedAt = str(body.submittedAt, 40);

  // Without the key there is nothing to be idempotent against, and a recovery
  // that can duplicate is worse than no recovery.
  if (!idempotencyKey || !email || !submittedAt || Number.isNaN(Date.parse(submittedAt))) {
    return NextResponse.json({ ok: false, message: "idempotencyKey, email and submittedAt are required." }, { status: 422 });
  }

  // The webhook payload calls these `type`; map to a stored source, and refuse
  // anything unrecognised rather than guessing.
  const rawType = str(body.type, 40) ?? "";
  const source: LeadSource | null =
    rawType === "call_request"
      ? "website_call"
      : rawType === "operations_assessment"
        ? "website_assessment"
        : rawType === "labs_delivery_estimate"
          ? "website_labs"
          : (LEAD_SOURCES as readonly string[]).includes(rawType)
            ? (rawType as LeadSource)
            : null;
  if (!source) return NextResponse.json({ ok: false, message: "Unrecognised lead type." }, { status: 422 });

  const context = body.context as Record<string, unknown> | undefined;

  try {
    const lead = await insertLead({
      source,
      email,
      submittedAt: new Date(submittedAt).toISOString(),
      idempotencyKey,
      deliveryState: "recovered",
      firstName: str(body.name, 200) ?? str(body.firstName, 200),
      lastName: str(body.lastName, 200),
      company: str(body.company, 200),
      jobTitle: str(body.role, 120) ?? str(body.jobTitle, 120),
      requirement: str(body.challenge, 2000) ?? str(body.requirement, 2000),
      campaignVolume: str(body.campaignsPerMonth, 60) ?? str(body.campaignVolume, 60),
      attribution: attributionColumns(sanitizeAttribution(body.attribution ?? context?.attribution)),
    });

    if (!lead) return NextResponse.json({ ok: false, message: "No database configured." }, { status: 503 });

    // `recovered` means this call created it; `delivered` means it had persisted
    // after all and this call changed nothing. Both are successes.
    const created = lead.deliveryState === "recovered";
    console.log(`[leads] recovery ref=${submissionRef(idempotencyKey)} source=${source} created=${created} by=${admin}`);
    return NextResponse.json({ ok: true, created, leadId: lead.id, status: lead.status });
  } catch (err) {
    console.error(`[leads] recovery failed ref=${submissionRef(idempotencyKey)} error=${err instanceof Error ? err.constructor.name : "unknown"}`);
    return NextResponse.json({ ok: false, message: "Recovery failed." }, { status: 500 });
  }
}

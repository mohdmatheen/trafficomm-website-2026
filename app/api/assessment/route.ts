import { NextResponse } from "next/server";
import { validateAssessment, type AssessmentInput } from "@/lib/assessment";

/**
 * Receives Operations Assessment requests.
 * Delivery: set ASSESSMENT_WEBHOOK_URL (CRM, Slack, Zapier, Make, HubSpot form
 * endpoint…) and each valid submission is POSTed there as JSON.
 * Without it, production requests fail loudly (503) rather than silently
 * discarding leads; development accepts them for testing.
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

  const payload = {
    type: body.intent === "call" ? "call_request" : "operations_assessment",
    name: body.name?.trim(),
    company: body.company?.trim(),
    email: body.email?.trim(),
    markets: body.markets,
    platforms: body.platforms ?? [],
    campaignsPerMonth: body.volume,
    challenge: body.challenge?.trim() ?? "",
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.ASSESSMENT_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, message: "Submissions are temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch {
    return NextResponse.json({ ok: false, message: "We couldn't send your request. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}

import { NextResponse } from "next/server";
import { assessmentEmailConfig, sendEmail } from "@/lib/assessment-email";
import { isAllowed, isAuthConfigured, mintLoginToken } from "@/lib/auth/session";
import { siteUrl } from "@/data/site";

/**
 * Requests a sign-in link.
 *
 * Always answers the same way. An address that is not on the allowlist gets the
 * identical response and the identical timing-insensitive shape as one that is,
 * because a different answer would turn this endpoint into a way of discovering
 * who at Trafficomm has dashboard access.
 *
 * The link is delivered through the email provider already configured for lead
 * notifications, so this introduces no new external service and no new secret.
 */
export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    console.error("[admin-login] ADMIN_AUTH_SECRET or ADMIN_ALLOWED_EMAILS is not configured");
    return NextResponse.json({ ok: false, message: "Sign-in is not available." }, { status: 503 });
  }

  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // The uniform response. Everything below is best-effort behind it.
  const uniform = NextResponse.json({ ok: true });

  if (!email || !isAllowed(email)) return uniform;

  let config;
  try {
    config = assessmentEmailConfig();
  } catch {
    config = null;
  }
  if (!config) {
    console.error("[admin-login] no email provider configured; cannot deliver a sign-in link");
    return uniform;
  }

  const link = `${siteUrl}/admin/callback?token=${encodeURIComponent(mintLoginToken(email))}`;
  try {
    await sendEmail(config, {
      subject: "Trafficomm lead dashboard — sign-in link",
      replyTo: config.to,
      text: `Sign in to the Trafficomm lead dashboard:\n\n${link}\n\nThis link expires in 15 minutes and can only be used by an authorised address.\nIf you did not request it, ignore this email.`,
      html: `<p>Sign in to the Trafficomm lead dashboard:</p><p><a href="${link}">${link}</a></p><p style="color:#5d5d64;font-size:13px">This link expires in 15 minutes and can only be used by an authorised address. If you did not request it, ignore this email.</p>`,
    });
  } catch (err) {
    // Logged without the address, and without the provider's response body.
    console.error("[admin-login] delivery failed:", err instanceof Error ? err.message : "unknown error");
  }

  return uniform;
}

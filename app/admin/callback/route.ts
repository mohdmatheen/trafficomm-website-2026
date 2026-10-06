import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, mintSessionToken, verify } from "@/lib/auth/session";
import { isIndexable } from "@/lib/deployment";

/**
 * Exchanges a login link for a session cookie.
 *
 * A GET, because it is reached by clicking a link in an email. The login token
 * is verified and then discarded — it never becomes the session credential, so a
 * link sitting in an inbox or a browser history cannot be replayed as one.
 *
 * `secure` follows the deployment rather than being hardcoded, so the cookie is
 * still settable over plain HTTP on a developer's machine while being
 * Secure-only wherever the site is actually served.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const result = verify("login", token);

  if (!result.ok) {
    return NextResponse.redirect(new URL(`/admin/login?error=${result.reason}`, request.url));
  }

  const response = NextResponse.redirect(new URL("/admin/leads", request.url));
  response.cookies.set(SESSION_COOKIE, mintSessionToken(result.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: isIndexable || process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

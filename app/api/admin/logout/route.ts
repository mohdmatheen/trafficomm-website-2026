import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

/** Clears the session cookie and returns to the sign-in page. */
export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login?error=signed_out", request.url));
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}

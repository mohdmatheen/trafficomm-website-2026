import { NextResponse } from "next/server";

/**
 * The visitor's country, for the cookie banner only. Vercel derives it from the
 * request IP and passes it in `x-vercel-ip-country`; this route returns that code
 * and nothing else. It stores nothing and logs nothing. Locally, and anywhere the
 * header is absent, the country is null and no banner is shown.
 */
export function GET(request: Request) {
  const raw = request.headers.get("x-vercel-ip-country");
  const country = raw && /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : null;
  return NextResponse.json({ country }, { headers: { "Cache-Control": "no-store" } });
}

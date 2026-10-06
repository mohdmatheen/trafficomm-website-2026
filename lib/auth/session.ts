import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Internal authentication for the lead dashboard.
 *
 * Email allowlist plus a one-time signed link. Chosen over an auth library
 * because the requirement is a handful of named Trafficomm people reading an
 * internal page: an OAuth provider, a user table and a session adapter would all
 * be new surface protecting the same four addresses, and the email provider that
 * delivers the link is the one already configured for lead notifications.
 *
 * Two tokens, both HMAC-SHA256 over their own payload with `ADMIN_AUTH_SECRET`:
 *
 *   login token   short-lived, single purpose, arrives by email
 *   session token longer-lived, lives in an HttpOnly cookie
 *
 * Neither is a bearer credential for anything but this dashboard, neither
 * contains anything but an address and an expiry, and both are verified
 * server-side on every request. There is no client-side authorization anywhere:
 * the pages are server components that resolve the session before rendering, so
 * an unauthenticated request never receives lead data to begin with.
 */

export const SESSION_COOKIE = "tc_admin";
const LOGIN_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const secret = () => process.env.ADMIN_AUTH_SECRET?.trim() ?? "";

/** Comma- or whitespace-separated, case-insensitive. Server-side only — never sent to the browser. */
export function allowlist(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(/[,\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const isAllowed = (email: string): boolean => allowlist().includes(email.trim().toLowerCase());

/** Constant-time, and length-safe: `timingSafeEqual` throws on a length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

type TokenKind = "login" | "session";

type Claims = { k: TokenKind; e: string; x: number; n: string };

/**
 * `k` is inside the signed payload, so a login link cannot be replayed as a
 * session cookie or the reverse. The nonce makes each link distinct even for the
 * same address in the same millisecond.
 *
 * JSON rather than a delimited string: an earlier version joined the fields with
 * dots, which every email address also contains, so the payload parsed back into
 * the wrong fields and every valid token was rejected as unauthorised. A format
 * that cannot collide with its own content is worth more than a shorter token.
 */
function mint(kind: TokenKind, email: string, ttlMs: number): string {
  const claims: Claims = {
    k: kind,
    e: email.trim().toLowerCase(),
    x: Date.now() + ttlMs,
    n: randomBytes(9).toString("base64url"),
  };
  const payload = JSON.stringify(claims);
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${sign(payload)}`;
}

export type VerifiedToken = { ok: true; email: string } | { ok: false; reason: "malformed" | "bad_signature" | "expired" | "not_allowed" | "unconfigured" };

export function verify(kind: TokenKind, token: string | undefined | null): VerifiedToken {
  // Without a secret nothing can be trusted, so nothing is. An unconfigured
  // deployment denies access rather than defaulting to open.
  if (!secret()) return { ok: false, reason: "unconfigured" };
  if (!token || typeof token !== "string") return { ok: false, reason: "malformed" };

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return { ok: false, reason: "malformed" };
  const body = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  let payload: string;
  try {
    payload = Buffer.from(body, "base64url").toString("utf8");
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (!safeEqual(sign(payload), signature)) return { ok: false, reason: "bad_signature" };

  let claims: Claims;
  try {
    const parsed = JSON.parse(payload) as Partial<Claims>;
    if (typeof parsed.k !== "string" || typeof parsed.e !== "string" || typeof parsed.x !== "number") {
      return { ok: false, reason: "malformed" };
    }
    claims = parsed as Claims;
  } catch {
    return { ok: false, reason: "malformed" };
  }

  const { k: tokenKind, e: email, x: expires } = claims;
  if (tokenKind !== kind || !email) return { ok: false, reason: "malformed" };
  if (expires < Date.now()) return { ok: false, reason: "expired" };
  // Re-checked at verification, not only at issue: removing someone from the
  // allowlist must lock them out immediately, not when their cookie expires.
  if (!isAllowed(email)) return { ok: false, reason: "not_allowed" };

  return { ok: true, email };
}

export const mintLoginToken = (email: string) => mint("login", email, LOGIN_TTL_MS);
export const mintSessionToken = (email: string) => mint("session", email, SESSION_TTL_MS);
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);

export const isAuthConfigured = () => Boolean(secret()) && allowlist().length > 0;

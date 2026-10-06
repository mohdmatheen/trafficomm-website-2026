import { cookies } from "next/headers";
import { SESSION_COOKIE, verify } from "./session";

/**
 * The single gate.
 *
 * Every admin page and every admin API route calls this before doing anything
 * else. It reads the HttpOnly cookie server-side, so there is no path by which
 * a client-supplied value, a header or a query parameter can stand in for a
 * session, and no lead data is assembled before it has returned an address.
 */
export async function currentAdmin(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const result = verify("session", token);
  return result.ok ? result.email : null;
}

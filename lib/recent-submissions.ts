/**
 * Guards against the same enquiry arriving twice in quick succession — a double
 * click that outran the disabled button, an impatient retry, a refresh-and-resend.
 *
 * Deliberately in-memory. On Vercel each serverless instance has its own copy and
 * instances are short-lived, so this catches the common case (both requests land
 * on the warm instance that just served the page) and misses the rare one. That is
 * the right trade: the downside of a miss is a duplicate email, and the brief's
 * instruction was not to stand up a database for deduplication. Cross-instance
 * certainty would need shared state (Vercel KV, Upstash), which is worth adding
 * only if duplicates are actually observed.
 *
 * It is not a spam defence. The honeypot and validation do that work; this only
 * stops an honest visitor being counted twice.
 */
const WINDOW_MS = 90_000;
/** Bounded so a burst of distinct submissions cannot grow the map without limit. */
const MAX_ENTRIES = 500;

const seen = new Map<string, number>();

function prune(now: number) {
  for (const [key, at] of seen) if (now - at > WINDOW_MS) seen.delete(key);
  // Map preserves insertion order, so the oldest keys go first.
  while (seen.size > MAX_ENTRIES) {
    const oldest = seen.keys().next();
    if (oldest.done) break;
    seen.delete(oldest.value);
  }
}

/**
 * Returns true when this exact enquiry was already accepted inside the window.
 * Calling it records the submission, so call it once per request.
 */
export function isDuplicateSubmission(key: string, now = Date.now()): boolean {
  prune(now);
  const previous = seen.get(key);
  if (previous !== undefined && now - previous <= WINDOW_MS) return true;
  seen.set(key, now);
  return false;
}

/** Test-only reset, so one case cannot leak state into the next. */
export function resetRecentSubmissions() {
  seen.clear();
}

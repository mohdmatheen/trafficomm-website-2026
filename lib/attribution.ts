/**
 * First-touch attribution.
 *
 * The site previously read UTMs from `window.location.search` at the moment a
 * form was submitted. That works only when the visitor lands and converts on the
 * same URL — so a LinkedIn click arriving on `/`, reading two pages and
 * converting on `/contact` produced a lead with no campaign on it at all. For a
 * paid campaign that is the whole measurement.
 *
 * So the first page of the visit writes what it can see, once, and nothing
 * overwrites it for the rest of the session. Values are only ever read from the
 * URL or the referrer the browser disclosed; nothing is inferred, defaulted or
 * synthesised. A visit with no UTMs stores a record with no UTMs rather than a
 * guess.
 *
 * Session storage, not local: attribution belongs to a visit. A prospect who
 * clicks an ad in March and returns organically in June is not still a March
 * click, and persisting it for months would quietly inflate the campaign.
 */

export const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

export type Attribution = {
  utm?: Partial<Record<UtmKey, string>>;
  referrer?: string;
  landingPath?: string;
  firstTouchAt?: string;
  /**
   * LinkedIn's first-party click id, present only when Campaign Manager has
   * first-party cookies enabled and the visitor genuinely arrived from an ad.
   * Absent is a legitimate state and must never be filled in.
   */
  liFatId?: string;
};

export const STORAGE_KEY = "trafficomm.attribution.v1";

const MAX = 300;

/** Printable, single-line, bounded. An attribution value with a newline in it is not one. */
const clean = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.replace(/[\r\n\t]+/g, " ").trim().slice(0, MAX);
  return trimmed || undefined;
};

/**
 * Server-side validation. The client supplies this, so every field is checked
 * before it reaches a database or an email — same posture as `sanitizeContext`.
 */
export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object") return {};
  const raw = input as Record<string, unknown>;
  const out: Attribution = {};

  const landingPath = clean(raw.landingPath);
  if (landingPath && /^\/[\w\-/.]*$/.test(landingPath)) out.landingPath = landingPath;

  const referrer = clean(raw.referrer);
  if (referrer && /^https?:\/\//i.test(referrer)) out.referrer = referrer;

  const firstTouchAt = clean(raw.firstTouchAt);
  if (firstTouchAt && !Number.isNaN(Date.parse(firstTouchAt))) out.firstTouchAt = new Date(firstTouchAt).toISOString();

  // LinkedIn click ids are opaque. Constrained by shape and length rather than
  // trusted, and rejected outright if it does not look like one.
  const liFatId = clean(raw.liFatId);
  if (liFatId && /^[\w-]{1,128}$/.test(liFatId)) out.liFatId = liFatId;

  if (raw.utm && typeof raw.utm === "object") {
    const utm: Partial<Record<UtmKey, string>> = {};
    for (const key of UTM_KEYS) {
      const value = clean((raw.utm as Record<string, unknown>)[key]);
      if (value) utm[key] = value;
    }
    if (Object.keys(utm).length) out.utm = utm;
  }

  return out;
}

/** Shape the lead store wants. Kept here so both routes map it identically. */
export function attributionColumns(a: Attribution) {
  return {
    liFatId: a.liFatId ?? null,
    utmSource: a.utm?.source ?? null,
    utmMedium: a.utm?.medium ?? null,
    utmCampaign: a.utm?.campaign ?? null,
    utmContent: a.utm?.content ?? null,
    utmTerm: a.utm?.term ?? null,
    referrer: a.referrer ?? null,
    landingPath: a.landingPath ?? null,
    firstTouchAt: a.firstTouchAt ?? null,
  };
}

/**
 * Reads the current URL and referrer. Browser-only.
 *
 * `li_fat_id` is read from the query string, which is where LinkedIn appends it
 * on an ad click once first-party cookies are enabled in Campaign Manager.
 */
export function readAttributionFromLocation(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Attribution = {
    landingPath: window.location.pathname,
    firstTouchAt: new Date().toISOString(),
  };

  const utm: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = clean(params.get(`utm_${key}`));
    if (value) utm[key] = value;
  }
  if (Object.keys(utm).length) out.utm = utm;

  const liFatId = clean(params.get("li_fat_id"));
  if (liFatId) out.liFatId = liFatId;

  // Only an external referrer says anything about where the visit came from.
  if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
    const referrer = clean(document.referrer);
    if (referrer) out.referrer = referrer;
  }

  return out;
}

/**
 * Stores the first touch of the visit, once.
 *
 * Returns whatever is stored afterwards. Later calls are no-ops, which is the
 * point: page two of the visit must not overwrite page one. The exception is a
 * stored record with no `li_fat_id` meeting a URL that has one — a visitor who
 * arrives organically and later clicks an ad in the same session really did
 * click the ad, and the id is additive rather than a rewrite of the campaign.
 */
export function captureFirstTouch(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    const current = readAttributionFromLocation();

    if (!existing) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    }

    const stored = JSON.parse(existing) as Attribution;
    if (!stored.liFatId && current.liFatId) {
      const merged = { ...stored, liFatId: current.liFatId };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return stored;
  } catch {
    // Private mode, blocked storage, corrupt JSON. Attribution is never allowed
    // to be the reason a form stops working.
    return readAttributionFromLocation();
  }
}

/** What a form attaches at submit time. Falls back to the live URL if storage is unavailable. */
export function readStoredAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    /* fall through */
  }
  return readAttributionFromLocation();
}

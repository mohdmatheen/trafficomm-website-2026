/**
 * Cookie consent for UK, EU, EEA and Swiss visitors.
 *
 * Google Consent Mode is the only mechanism: the site never loads or blocks tags
 * itself. The defaults below are pushed before the GTM container loads (see
 * AnalyticsEnvironment), and the container's tags check them before they fire:
 *
 * - analytics_storage gates Google Analytics 4.
 * - ad_storage gates the LinkedIn Insight Tag, which the container fires only
 *   when ad_storage is granted (Consent Settings → additional consent required).
 *
 * In the consent regions both are denied until the visitor chooses. Everywhere
 * else both are granted by default and can be switched off with "Cookie
 * settings". ad_user_data and ad_personalization stay denied in every region:
 * the site runs no Google advertising tags, and keeping them denied means a
 * future Google ad tag cannot inherit consent by accident.
 */

/** UK, the 27 EU member states, Iceland, Liechtenstein, Norway and Switzerland (ISO 3166-1 alpha-2). */
export const CONSENT_REGIONS = [
  "GB", "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "CH",
] as const;

/** localStorage key holding the visitor's choice: "all", "analytics" or "denied". */
export const CONSENT_STORAGE_KEY = "tc_consent";
/** sessionStorage key caching the visitor's country for the session. */
export const GEO_STORAGE_KEY = "tc_geo";
/** Window event the footer "Cookie settings" button raises to reopen the banner. */
export const OPEN_CONSENT_EVENT = "tc:open-consent";

/**
 * "all": analytics and LinkedIn advertising measurement.
 * "analytics": Google Analytics only.
 * "denied": neither.
 */
export type ConsentChoice = "all" | "analytics" | "denied";

export const requiresConsent = (country: string | null | undefined) =>
  Boolean(country) && (CONSENT_REGIONS as readonly string[]).includes(country!.toUpperCase());

/** Consent Mode settings for a choice. Only the two signals our tags read change. */
export function consentUpdateFor(choice: ConsentChoice) {
  return {
    analytics_storage: choice === "denied" ? "denied" : "granted",
    ad_storage: choice === "all" ? "granted" : "denied",
  } as const;
}

/**
 * The stored value as a choice. "granted" is what the banner stored before it
 * offered an advertising option, so it meant analytics only and must never be
 * read as consent to advertising cookies.
 */
export function parseStoredChoice(value: string | null): ConsentChoice | null {
  if (value === "all" || value === "analytics" || value === "denied") return value;
  if (value === "granted") return "analytics";
  return null;
}

const ALWAYS_DENIED = { ad_user_data: "denied", ad_personalization: "denied" };

/**
 * Inline, parser-blocking JavaScript that sets the Consent Mode defaults and
 * applies a stored choice before GTM reads the dataLayer. Consent commands have
 * to be pushed as an `arguments` object, which is what the local `consent`
 * function does; it is a dataLayer shim and does not load gtag.js.
 */
export function consentDefaultsScript() {
  const regional = { analytics_storage: "denied", ad_storage: "denied", ...ALWAYS_DENIED, wait_for_update: 500, region: CONSENT_REGIONS };
  const global = { analytics_storage: "granted", ad_storage: "granted", ...ALWAYS_DENIED };
  const updates = {
    all: consentUpdateFor("all"),
    analytics: consentUpdateFor("analytics"),
    granted: consentUpdateFor("analytics"),
    denied: consentUpdateFor("denied"),
  };
  return [
    "function consent(){window.dataLayer.push(arguments);}",
    `consent('consent','default',${JSON.stringify(regional)});`,
    `consent('consent','default',${JSON.stringify(global)});`,
    `try{var u=${JSON.stringify(updates)}[localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})];if(u)consent('consent','update',u);}catch(e){}`,
  ].join("");
}

/** Client side: record the visitor's choice and tell the tags about it. */
export function applyConsentChoice(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  const dataLayer = w.dataLayer;
  // Must be an `arguments` object, as in consentDefaultsScript.
  const consent = function () {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  } as (...command: unknown[]) => void;
  consent("consent", "update", consentUpdateFor(choice));
}

export function readStoredChoice(): ConsentChoice | null {
  try {
    return parseStoredChoice(localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function clearStoredChoice() {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Nothing stored that we can reach.
  }
}

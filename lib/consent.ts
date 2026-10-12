/**
 * Cookie consent for UK, EU, EEA and Swiss visitors.
 *
 * Google Consent Mode is the only mechanism: the site never loads or blocks tags
 * itself. The defaults below are pushed before the GTM container loads (see
 * AnalyticsEnvironment), and the container's GA4 tags require analytics_storage
 * to fire. Everywhere else analytics is granted by default, as it was before.
 *
 * Ad signals stay denied in every region. The site runs no advertising tags, and
 * keeping them denied means a future ad tag cannot inherit consent by accident.
 */

/** UK, the 27 EU member states, Iceland, Liechtenstein, Norway and Switzerland (ISO 3166-1 alpha-2). */
export const CONSENT_REGIONS = [
  "GB", "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "CH",
] as const;

/** localStorage key holding the visitor's choice: "granted" or "denied". */
export const CONSENT_STORAGE_KEY = "tc_consent";
/** sessionStorage key caching the visitor's country for the session. */
export const GEO_STORAGE_KEY = "tc_geo";
/** Window event the footer "Cookie settings" button raises to reopen the banner. */
export const OPEN_CONSENT_EVENT = "tc:open-consent";

export type ConsentChoice = "granted" | "denied";

export const requiresConsent = (country: string | null | undefined) =>
  Boolean(country) && (CONSENT_REGIONS as readonly string[]).includes(country!.toUpperCase());

const DENIED_ADS = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

/**
 * Inline, parser-blocking JavaScript that sets the Consent Mode defaults and
 * applies a stored choice before GTM reads the dataLayer. Consent commands have
 * to be pushed as an `arguments` object, which is what the local `consent`
 * function does; it is a dataLayer shim and does not load gtag.js.
 */
export function consentDefaultsScript() {
  const regional = { analytics_storage: "denied", ...DENIED_ADS, wait_for_update: 500, region: CONSENT_REGIONS };
  const global = { analytics_storage: "granted", ...DENIED_ADS };
  return [
    "function consent(){window.dataLayer.push(arguments);}",
    `consent('consent','default',${JSON.stringify(regional)});`,
    `consent('consent','default',${JSON.stringify(global)});`,
    `try{var c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});if(c==='granted'||c==='denied')consent('consent','update',{analytics_storage:c});}catch(e){}`,
  ].join("");
}

/** Client side: record the visitor's choice and tell Google tags about it. */
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
  consent("consent", "update", { analytics_storage: choice });
}

export function readStoredChoice(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
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

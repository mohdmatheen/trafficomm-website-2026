/**
 * The single place anything reaches `window.dataLayer`.
 *
 * GA4 is not installed by the site. Google Tag Manager is the only tag-management
 * layer (see components/analytics/Analytics.tsx), and GA4 is configured inside the
 * container, so there is exactly one source of pageviews and events.
 *
 * Every push also dispatches a DOM CustomEvent of the same name. That is what the
 * test suite listens to, and it means a non-GTM listener can be added without
 * touching any component.
 */

export type AnalyticsEvent =
  /** The visitor engaged with the assessment form — once per mount, on first input. */
  | "assessment_form_start"
  /** A submission passed client-side validation and was sent to the server. */
  | "assessment_submit_attempt"
  /** The server confirmed delivery. The only event that may be counted as a conversion. */
  | "assessment_submit_success"
  /** Validation, network or delivery failure. */
  | "assessment_submit_error"
  /** A click on any call to action leading to /contact. */
  | "contact_cta_click"
  /** A case study detail page was opened. */
  | "case_study_view"
  /** A solution detail page was opened. */
  | "solution_view"
  /** A click on a mailto:, tel: or external LinkedIn link. */
  | "email_click"
  | "phone_click"
  | "linkedin_click"
  /* Trafficomm Labs — AdOps Capacity calculator. Every parameter these carry is a
     band or a count; no salary, cost or contact detail is ever passed. */
  | "labs_tool_viewed"
  | "adops_tool_started"
  | "market_selected"
  | "business_completed"
  | "team_completed"
  | "workload_completed"
  | "operations_completed"
  | "analysis_started"
  | "results_viewed"
  | "scenario_changed"
  | "report_requested"
  | "pricing_requested"
  | "consultation_requested"
  | "tool_completed";

/**
 * The complete set of parameter keys allowed to leave the browser.
 *
 * This is an allowlist, not a guideline: `trackEvent` drops every key that is not
 * on it. A name, an email address, a company or the free-text challenge answer
 * cannot reach GTM or GA4 by being added at a call site, because there is no key
 * here for them to travel under.
 */
export const allowedParams = [
  /** Path only — never the query string, which can carry identifiers. */
  "page_path",
  /** "operations_assessment" or "call_request". */
  "form_name",
  /** Which instance of the form: "home" or "contact". */
  "form_location",
  /** The selected volume bucket, e.g. "50–100". A range, not a customer figure. */
  "campaign_volume",
  /** Where a CTA or link sits: "header", "footer", "mobile_nav", or a section id. */
  "cta_location",
  /** Slug of the solution being viewed. */
  "solution_name",
  /** Slug of the case study being viewed. */
  "case_study_name",
  /** Coarse failure reason: "validation" | "network" | "server". Never a provider message. */
  "error_reason",
  /** "production" | "preview" | "development", so non-production traffic can be excluded in GTM. */
  "site_environment",
  /* Labs parameters. Deliberately banded: a band tells us the shape of the
     opportunity without transmitting what a team is paid or how many people it
     has. Salary, cost and headcount figures have no key here and therefore
     cannot leave the browser. */
  /** Slug of the Labs tool, e.g. "adops-capacity". */
  "tool_name",
  /** "SA" | "AE". */
  "market",
  /** Team-size band, e.g. "6-10". */
  "team_band",
  /** Platforms selected, as a count band, e.g. "4-6". */
  "platforms_band",
  /** Utilization band, e.g. "90-100%". */
  "utilization_band",
  /** Externalizable workload band in hours, e.g. "500-750". */
  "externalizable_band",
  /** Which scenario control moved: "reporting_automation" | "external_allocation". */
  "scenario_control",
  /** Which questionnaire step the event belongs to. */
  "step",
  /** "quick" | "detailed" — how workload was supplied. */
  "workload_mode",
] as const;

export type AnalyticsParams = Partial<Record<(typeof allowedParams)[number], string>>;

type DataLayerWindow = Window & { dataLayer?: unknown[] };

const isAllowed = (key: string): key is (typeof allowedParams)[number] =>
  (allowedParams as readonly string[]).includes(key);

/**
 * Keeps only allowlisted, non-empty string values. Exported so the guarantee is
 * testable directly rather than inferred from behaviour.
 */
export function sanitizeParams(params: Record<string, unknown>): AnalyticsParams {
  const out: AnalyticsParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (!isAllowed(key)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[analytics] dropped "${key}": not in allowedParams. Add it there only if it carries no personal data.`);
      }
      continue;
    }
    if (typeof value === "string" && value) out[key] = value;
  }
  return out;
}

export function trackEvent(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    // `pathname` only. A query string can carry an email in a shared link, and
    // GA4 has no need for it to attribute the page.
    const payload = { event, page_path: window.location.pathname, ...sanitizeParams(params) };
    const w = window as DataLayerWindow;
    // GTM creates dataLayer itself; creating it here too means events raised before
    // the container finishes loading are queued rather than lost.
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent(event, { detail: payload }));
  } catch {
    // Analytics must never be able to break an interaction.
  }
}

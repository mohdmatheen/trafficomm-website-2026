/**
 * Analytics hooks for the assessment form.
 *
 * GA4 and Google Tag Manager are not installed yet, and this file does not
 * install them. It is the seam they will attach to: each event is pushed to
 * `window.dataLayer` when a container is present, and dispatched as a DOM event
 * either way, so a listener can be added later without touching the form.
 *
 * `assessment_submit_success` is emitted only after the server has confirmed a
 * valid submission — never optimistically on click, and never when a delivery
 * channel failed. A conversion count that includes attempts is worse than none.
 */
export type FormEvent =
  /** The visitor engaged with the form — fired once per mount, on first input. */
  | "assessment_form_start"
  /** A submission passed client-side validation and was sent to the server. */
  | "assessment_submit_attempt"
  /** The server confirmed delivery. The only event that may count as a conversion. */
  | "assessment_submit_success"
  /** Validation, network or delivery failure. */
  | "assessment_submit_error";

export type FormEventDetail = {
  /** Which form instance: "home" or "contact". */
  form?: string;
  /** "assessment" or "call". */
  intent?: string;
  /** On error only: a coarse reason, never a provider message or stack trace. */
  reason?: "validation" | "network" | "server";
};

type DataLayerWindow = Window & { dataLayer?: unknown[] };

export function trackFormEvent(event: FormEvent, detail: FormEventDetail = {}): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as DataLayerWindow;
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...detail });
    window.dispatchEvent(new CustomEvent(event, { detail }));
  } catch {
    // Analytics must never be able to break a submission.
  }
}

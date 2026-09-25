"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { company, enquiryConfidentialityNote } from "@/data/site";
import { utmKeys, validateAssessment, volumeOptions, type AssessmentInput, type FieldErrors, type SubmissionContext } from "@/lib/assessment";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/Icons";

type Status = "idle" | "submitting" | "success" | "error";
type Tone = "light" | "dark";

const empty: AssessmentInput = { name: "", company: "", email: "", volume: "", challenge: "", intent: "assessment", website: "" };

/**
 * Attribution read from the browser at submit time. Everything here is re-validated
 * server-side — it travels in the request body, so it is a hint, not evidence.
 * Deliberately excludes anything that identifies the device rather than the campaign.
 */
function readContext(): SubmissionContext {
  if (typeof window === "undefined") return {};
  const context: SubmissionContext = { path: window.location.pathname };
  // Same-origin navigation is not a referral; only an external source is worth recording.
  if (document.referrer && !document.referrer.startsWith(window.location.origin)) context.referrer = document.referrer;
  const params = new URLSearchParams(window.location.search);
  const utm: NonNullable<SubmissionContext["utm"]> = {};
  for (const key of utmKeys) {
    const value = params.get(`utm_${key}`);
    if (value) utm[key] = value;
  }
  if (Object.keys(utm).length) context.utm = utm;
  return context;
}

/** `privacyNote`: set false where the page already states the confidentiality line (Contact). */
export function AssessmentForm({ tone = "dark", idPrefix = "af", privacyNote = true }: { tone?: Tone; idPrefix?: string; privacyNote?: boolean }) {
  const [values, setValues] = useState<AssessmentInput>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [submittedIntent, setSubmittedIntent] = useState<AssessmentInput["intent"]>("assessment");
  const formRef = useRef<HTMLFormElement>(null);
  /**
   * Guards the request itself. `disabled` on the button covers the pointer, but a
   * second Enter press can land before React has re-rendered, so the in-flight
   * check has to be a ref read synchronously rather than derived from state.
   */
  const inFlight = useRef(false);
  const started = useRef(false);
  const dark = tone === "dark";

  const set = <K extends keyof AssessmentInput>(k: K, v: AssessmentInput[K]) => {
    if (!started.current) {
      started.current = true;
      // No volume yet, and nothing about the visitor — just that the form was engaged.
      trackEvent("assessment_form_start", { form_location: idPrefix });
    }
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  /**
   * The only values this form reports. `campaign_volume` is a bucket such as
   * "50–100", not a customer figure; the name, company, email and challenge answer
   * are never passed, and `lib/analytics.ts` has no key they could travel under.
   */
  const analytics = (intent: AssessmentInput["intent"]) => ({
    form_name: intent === "call" ? "call_request" : "operations_assessment",
    form_location: idPrefix,
    campaign_volume: values.volume,
  });

  async function submit(intent: AssessmentInput["intent"], e?: FormEvent) {
    e?.preventDefault();
    if (inFlight.current) return;
    const payload = { ...values, intent };
    const errs = validateAssessment(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      trackEvent("assessment_submit_error", { ...analytics(intent), error_reason: "validation" });
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    inFlight.current = true;
    setStatus("submitting");
    setMessage("");
    trackEvent("assessment_submit_attempt", analytics(intent));
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, context: readContext() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; duplicate?: boolean; message?: string; errors?: FieldErrors };
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message ?? "Something went wrong. Please try again.", { cause: res.status >= 500 ? "server" : "network" });
      }
      setSubmittedIntent(intent);
      setStatus("success");
      // Only here — the server has confirmed every configured channel accepted it.
      // A deduplicated resubmission is still a success for the visitor, but it is the
      // same enquiry, so it must not be counted a second time.
      if (!data.duplicate) trackEvent("assessment_submit_success", analytics(intent));
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      const cause = err instanceof Error ? err.cause : undefined;
      trackEvent("assessment_submit_error", { ...analytics(intent), error_reason: cause === "server" ? "server" : "network" });
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      // The submit button is gone, so focus would otherwise fall back to the body
      // and a keyboard or screen-reader user would lose their place. The panel takes
      // it instead, and announces itself as a live region either way.
      <div
        role="status"
        tabIndex={-1}
        ref={(el) => el?.focus()}
        className={cn("rounded-[var(--radius-panel)] p-8 outline-none sm:p-10", dark ? "bg-ink-2 ring-1 ring-line-dark" : "bg-white ring-1 ring-line")}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-signal text-white">
          <Check className="size-5" />
        </span>
        <p className={cn("mt-6 text-h3", dark ? "text-white" : "text-ink")}>
          {submittedIntent === "call" ? "Call request received." : "Assessment request received."}
        </p>
        <p className={cn("mt-3 max-w-md text-[1.05rem] leading-relaxed", dark ? "text-fog" : "text-steel")}>
          Thank you, {values.name.split(" ")[0]}. A member of the Trafficomm team will be in touch at {values.email} to arrange next steps.
        </p>
        <button
          type="button"
          className={cn("mt-8 text-[0.96rem] underline decoration-signal underline-offset-4", dark ? "text-white" : "text-ink")}
          onClick={() => {
            setValues(empty);
            setStatus("idle");
            started.current = false;
          }}
        >
          Submit another request
        </button>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => submit("assessment", e)}
      aria-describedby={message ? `${idPrefix}-status` : undefined}
      className={cn("relative rounded-[var(--radius-panel)] p-5 sm:p-8", dark ? "bg-ink-2 ring-1 ring-line-dark" : "bg-white ring-1 ring-line")}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField tone={tone} id={`${idPrefix}-name`} field="name" label="Name" autoComplete="name" value={values.name} error={errors.name} onChange={(v) => set("name", v)} />
        <TextField tone={tone} id={`${idPrefix}-company`} field="company" label="Company" autoComplete="organization" value={values.company} error={errors.company} onChange={(v) => set("company", v)} />
        <TextField tone={tone} id={`${idPrefix}-email`} field="email" type="email" label="Work email" autoComplete="email" value={values.email} error={errors.email} onChange={(v) => set("email", v)} className="sm:col-span-2" />
      </div>

      <div className="mt-6 grid gap-5">
        <Field tone={tone} id={`${idPrefix}-volume`} label="Campaign volume (per month)" error={errors.volume}>
          <select
            id={`${idPrefix}-volume`}
            data-field="volume"
            value={values.volume}
            onChange={(e) => set("volume", e.target.value)}
            aria-invalid={Boolean(errors.volume)}
            aria-describedby={errors.volume ? `${idPrefix}-volume-err` : undefined}
            className={inputClasses(tone, Boolean(errors.volume), "appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10")}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23${dark ? "b9b9bf" : "5d5d64"}' stroke-width='1.5'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")` }}
          >
            <option value="">Select volume</option>
            {volumeOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field tone={tone} id={`${idPrefix}-challenge`} label="Biggest operational challenge" hint="Optional" error={errors.challenge}>
          <textarea
            id={`${idPrefix}-challenge`}
            data-field="challenge"
            rows={4}
            value={values.challenge}
            onChange={(e) => set("challenge", e.target.value)}
            placeholder="e.g. QA bottlenecks during launch peaks, reporting eating account team time…"
            aria-invalid={Boolean(errors.challenge)}
            className={inputClasses(tone, Boolean(errors.challenge), "h-auto resize-y py-3 leading-relaxed")}
          />
        </Field>
      </div>

      {/*
        Anti-spam honeypot. Bots that fill every input populate it and are rejected server-side.
        Clipped to 1px, transparent, inert, out of the tab order and hidden from assistive tech,
        so legitimate visitors never see or reach it.
      */}
      <div className="pointer-events-none absolute size-px overflow-hidden opacity-0 [clip-path:inset(50%)]" aria-hidden="true" inert>
        <label htmlFor={`${idPrefix}-website`}>Leave this field empty</label>
        <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      {status === "error" && (
        <p id={`${idPrefix}-status`} role="alert" className={cn("mt-6 rounded-lg bg-signal-soft px-4 py-3 text-[0.96rem]", dark ? "text-signal" : "text-signal-ink")}>
          {message}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={busy} className={buttonClasses("primary", "lg", "sm:flex-1")}>
          {busy ? <Spinner /> : null}
          {busy ? "Sending…" : "Request an Operations Assessment"}
          {!busy && <ArrowRight className="transition-transform group-hover:translate-x-0.5" />}
        </button>
        {company.bookingUrl ? (
          <a href={company.bookingUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses(dark ? "outline-dark" : "ghost", "lg")}>
            Talk to Trafficomm
          </a>
        ) : (
          <button type="button" disabled={busy} onClick={() => submit("call")} className={buttonClasses(dark ? "outline-dark" : "ghost", "lg")}>
            Talk to Trafficomm
          </button>
        )}
      </div>
      <p className={cn("mt-4 text-[0.83rem] leading-relaxed", dark ? "text-mute" : "text-steel")}>
        {privacyNote && `${enquiryConfidentialityNote} `}We use these details only to respond to your request.
      </p>
    </form>
  );
}

function inputClasses(tone: Tone, invalid: boolean, extra?: string) {
  return cn(
    "block h-12 w-full rounded-lg px-4 text-[1.03rem] outline-none transition-[box-shadow,background-color]",
    tone === "dark"
      ? "bg-white/[0.04] text-white placeholder:text-mute ring-1 ring-inset ring-line-dark-strong focus:bg-white/[0.07] focus:ring-2 focus:ring-signal"
      : "bg-paper text-ink placeholder:text-steel/70 ring-1 ring-inset ring-line-strong focus:bg-white focus:ring-2 focus:ring-signal",
    invalid && "ring-2 ring-signal",
    extra,
  );
}

function Field({ tone, id, label, hint, error, children, className }: { tone: Tone; id: string; label: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={cn("mb-2 flex items-center justify-between text-[0.9rem]", tone === "dark" ? "text-fog" : "text-graphite")}>
        {label}
        {hint && <span className={cn("font-mono text-[0.7rem] uppercase tracking-[0.1em]", tone === "dark" ? "text-mute" : "text-steel")}>{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className={cn("mt-1.5 text-[0.86rem]", tone === "dark" ? "text-signal" : "text-signal-ink")}>
          {error}
        </p>
      )}
    </div>
  );
}

function TextField({
  tone,
  id,
  field,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  className,
}: {
  tone: Tone;
  id: string;
  field: keyof AssessmentInput;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <Field tone={tone} id={id} label={label} error={error} className={className}>
      <input
        id={id}
        data-field={field}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={inputClasses(tone, Boolean(error))}
      />
    </Field>
  );
}

function Spinner() {
  return <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />;
}

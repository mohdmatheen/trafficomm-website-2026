"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { company, enquiryConfidentialityNote } from "@/data/site";
import { marketOptions, platformOptions, validateAssessment, volumeOptions, type AssessmentInput, type FieldErrors } from "@/lib/assessment";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/Icons";

type Status = "idle" | "submitting" | "success" | "error";
type Tone = "light" | "dark";

const empty: AssessmentInput = { name: "", company: "", email: "", markets: [], platforms: [], volume: "", challenge: "", intent: "assessment", website: "" };

/** `privacyNote`: set false where the page already states the confidentiality line (Contact). */
export function AssessmentForm({ tone = "dark", idPrefix = "af", privacyNote = true }: { tone?: Tone; idPrefix?: string; privacyNote?: boolean }) {
  const [values, setValues] = useState<AssessmentInput>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [submittedIntent, setSubmittedIntent] = useState<AssessmentInput["intent"]>("assessment");
  const formRef = useRef<HTMLFormElement>(null);
  const dark = tone === "dark";

  const set = <K extends keyof AssessmentInput>(k: K, v: AssessmentInput[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };
  const toggle = (k: "markets" | "platforms", v: string) =>
    set(k, values[k].includes(v) ? values[k].filter((x) => x !== v) : [...values[k], v]);

  async function submit(intent: AssessmentInput["intent"], e?: FormEvent) {
    e?.preventDefault();
    const payload = { ...values, intent };
    const errs = validateAssessment(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: FieldErrors };
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message ?? "Something went wrong. Please try again.");
      }
      setSubmittedIntent(intent);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className={cn("rounded-[var(--radius-panel)] p-8 sm:p-10", dark ? "bg-ink-2 ring-1 ring-line-dark" : "bg-white ring-1 ring-line")}>
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

      <ChipGroup tone={tone} field="markets" legend="Market(s)" options={marketOptions} selected={values.markets} error={errors.markets} onToggle={(v) => toggle("markets", v)} />
      <ChipGroup tone={tone} field="platforms" legend="Platforms" hint="Optional" options={platformOptions} selected={values.platforms} error={errors.platforms} onToggle={(v) => toggle("platforms", v)} />

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

function ChipGroup({
  tone,
  field,
  legend,
  hint,
  options,
  selected,
  error,
  onToggle,
}: {
  tone: Tone;
  field: "markets" | "platforms";
  legend: string;
  hint?: string;
  options: string[];
  selected: string[];
  error?: string;
  onToggle: (v: string) => void;
}) {
  const id = useId();
  const dark = tone === "dark";
  return (
    <fieldset className="mt-6" aria-describedby={error ? `${id}-err` : undefined}>
      <legend className={cn("mb-2.5 flex w-full items-center justify-between text-[0.9rem]", dark ? "text-fog" : "text-graphite")}>
        {legend}
        {hint && <span className={cn("font-mono text-[0.7rem] uppercase tracking-[0.1em]", dark ? "text-mute" : "text-steel")}>{hint}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => {
          const on = selected.includes(o);
          return (
            <label
              key={o}
              className={cn(
                "relative cursor-pointer rounded-full px-3.5 py-2 text-[0.92rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal",
                on
                  ? "bg-signal text-white"
                  : dark
                    ? "bg-white/[0.04] text-fog ring-1 ring-inset ring-line-dark-strong hover:text-white"
                    : "bg-paper text-graphite ring-1 ring-inset ring-line-strong hover:text-ink",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={on}
                onChange={() => onToggle(o)}
                data-field={i === 0 ? field : undefined}
              />
              {o}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${id}-err`} className={cn("mt-1.5 text-[0.86rem]", dark ? "text-signal" : "text-signal-ink")}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Spinner() {
  return <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />;
}

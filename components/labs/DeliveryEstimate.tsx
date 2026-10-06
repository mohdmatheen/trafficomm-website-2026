"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { readStoredAttribution } from "@/lib/attribution";
import { allocationRows } from "@/lib/labs/allocation";
import { formatNumber } from "@/lib/labs/currency";
import { METHODOLOGY_VERSION, leadScore } from "@/lib/labs/engine";
import type { LabsLeadContext, LabsLeadErrors } from "@/lib/labs/lead";
import type { useLabsCalculator } from "@/lib/labs/state";
import { cn } from "@/lib/cn";

type Ctx = ReturnType<typeof useLabsCalculator>;

/**
 * The delivery-estimate request.
 *
 * It asks for five fields, two of them optional, because the visitor has just
 * spent three minutes describing their operation and re-asking any of it would
 * be rude as well as redundant. The analysis is attached to the submission
 * instead — that is the whole proposition of the form, and it is stated on it.
 */
export function DeliveryEstimate(ctx: Ctx) {
  const { state, result, scenario, market, fx, context, trackEvent } = ctx;
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<LabsLeadErrors>({});
  const [message, setMessage] = useState("");
  const started = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const buildContext = (): LabsLeadContext => {
    const score = leadScore(state.input, result);
    const released = Math.max(0, result.workloadHours - scenario.internalHours);
    return {
      methodologyVersion: METHODOLOGY_VERSION,
      market: market.name,
      currency: market.currency,
      fxRate: fx.rate,
      fxSource: fx.source,
      fxAsOf: fx.asOf,
      businessType: state.input.businessType,
      headcount: result.headcount,
      campaignsPerMonth: state.input.campaignsPerMonth,
      activeClients: state.input.activeClients,
      marketsManaged: state.input.marketsManaged,
      platforms: state.platforms,
      complexityIndex: result.complexityIndex,
      utilization: result.utilization,
      workloadHours: result.workloadHours,
      executionHours: result.executionHours,
      externalizableHours: result.externalizableHours,
      externalizableFte: result.externalizableFte,
      efficiencyScore: result.efficiencyScore,
      loadedMonthlyCost: result.loadedMonthlyCost,
      executionCost: result.executionCost,
      salaryBasis: state.salaryMode === "custom" ? "custom" : "market-estimate",
      workloadBasis: state.workloadMode === "detailed" ? "detailed" : "quick-estimate",
      externalAllocation: state.scenario.externalAllocation > 0 ? state.scenario.externalAllocation : null,
      reportingAutomation: state.scenario.reportingAutomation > 0 ? state.scenario.reportingAutomation : null,
      releasedCapacityHours: released,
      // Only sent when the visitor moved it; the default split is Trafficomm's
      // illustration and tells us nothing about their intentions.
      capacityAllocation: state.allocationEdited
        ? allocationRows(state.allocation, released).map((r) => ({ label: r.label, percent: r.percent, hours: r.hours }))
        : null,
      leadScore: score.total,
      leadClassification: score.classification,
      capturedAt: new Date().toISOString(),
      // First-touch, from the landing page of this visit — not from the current
      // URL, which by this point is always /labs/adops-capacity and tells us
      // nothing about where the visitor came from.
      attribution: readStoredAttribution(),
    };
  };

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("delivery_estimate_started", context());
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/labs/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          company: form.get("company"),
          email: form.get("email"),
          role: form.get("role"),
          phone: form.get("phone"),
          website: form.get("website"),
          context: buildContext(),
        }),
      });
      const data = (await res.json()) as { ok: boolean; errors?: LabsLeadErrors; message?: string };
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage(data.message ?? "Please check the highlighted fields.");
        setStatus("error");
        return;
      }
      setStatus("done");
      trackEvent("delivery_estimate_submitted", context());
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setMessage("We couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  const hours = scenario.externallyDeliveredHours || result.externalizableHours;

  if (status === "done") {
    return (
      <section aria-labelledby={`${uid}-success`} className="rounded-[var(--radius-panel)] bg-ink p-6 text-white sm:p-10">
        <div ref={successRef} tabIndex={-1} className="outline-none">
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-signal">
            <svg viewBox="0 0 16 16" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5 6.5 12 13 4.5" />
            </svg>
          </span>
          <h3 id={`${uid}-success`} className="mt-6 text-[clamp(1.6rem,1.3rem+1.4vw,2.4rem)] leading-[1.1] tracking-[-0.03em]">
            Your request is with Trafficomm.
          </h3>
          <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-fog">
            We&rsquo;ve included your AdOps analysis, so you won&rsquo;t need to explain your operation again. A Trafficomm operations lead will review it and
            reply to the address you gave.
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Externalizable workload", v: `${formatNumber(hours, 0)} hrs/month` },
              { k: "Equivalent capacity", v: `${formatNumber(result.externalizableFte, 1)} FTE` },
              { k: "Market", v: market.label },
            ].map((s) => (
              <div key={s.k} className="rounded-[var(--radius-card)] bg-ink-2 px-5 py-4 ring-1 ring-inset ring-line-dark">
                <dt className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-fog">{s.k}</dt>
                <dd className="mt-2 text-[1.3rem] tabular-nums tracking-[-0.02em] text-white">{s.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                document.getElementById("results-headline")?.scrollIntoView({ block: "start" });
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-[0.98rem] font-medium text-ink outline-offset-4 transition-colors duration-200 hover:bg-paper motion-reduce:transition-none"
            >
              Return to my analysis
            </button>
            <Link href="/" className="min-h-11 text-[0.95rem] text-fog underline decoration-line-dark-strong underline-offset-4 outline-offset-4 hover:text-white">
              Visit Trafficomm
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={`${uid}-title`} className="rounded-[var(--radius-panel)] bg-ink p-6 text-white sm:p-10">
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">Trafficomm delivery scenario</p>
      <h3 id={`${uid}-title`} className="mt-4 text-[clamp(1.6rem,1.3rem+1.4vw,2.4rem)] leading-[1.1] tracking-[-0.03em]">
        Get a Trafficomm delivery estimate
      </h3>
      <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-fog">
        We&rsquo;ll use the operation you just analysed — you won&rsquo;t need to enter everything again. That is{" "}
        <strong className="font-medium text-white">{formatNumber(hours, 0)} hours a month</strong> of workload potentially suitable for external delivery,
        about {formatNumber(result.externalizableFte, 1)} full-time equivalents.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8 grid max-w-2xl gap-5" onInput={onFirstInput}>
        <div className="grid gap-5 sm:grid-cols-2">
          <LabsField id={`${uid}-name`} name="name" label="Name" error={errors.name} autoComplete="name" required />
          <LabsField id={`${uid}-company`} name="company" label="Company" error={errors.company} autoComplete="organization" required />
        </div>
        <LabsField id={`${uid}-email`} name="email" label="Work email" type="email" error={errors.email} autoComplete="email" required />
        <div className="grid gap-5 sm:grid-cols-2">
          <LabsField id={`${uid}-role`} name="role" label="Role" optional error={errors.role} autoComplete="organization-title" />
          <LabsField id={`${uid}-phone`} name="phone" label="Phone" type="tel" optional error={errors.phone} autoComplete="tel" />
        </div>

        <p aria-hidden="true" className="absolute left-[-9999px]">
          <label htmlFor={`${uid}-website`}>Leave this field empty</label>
          <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
        </p>

        {status === "error" && message && (
          <p role="alert" className="rounded-[10px] bg-signal-soft px-4 py-3 text-[0.94rem] text-white ring-1 ring-inset ring-signal/40">
            {message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-7 text-[0.98rem] font-medium text-ink outline-offset-4 transition-colors duration-200 hover:bg-paper disabled:opacity-60 motion-reduce:transition-none"
          >
            {status === "sending" ? "Sending…" : "Request a delivery estimate"}
            {status !== "sending" && <span aria-hidden="true">→</span>}
          </button>
          <Link
            href="/contact#call"
            onClick={() => trackEvent("consultation_requested", context())}
            className="min-h-11 text-[0.95rem] text-fog underline decoration-line-dark-strong underline-offset-4 outline-offset-4 hover:text-white"
          >
            Discuss my operation
          </Link>
        </div>

        <p className="max-w-2xl text-[0.84rem] leading-relaxed text-mute">
          Submitting attaches the analysis above — your team size, campaign volume, workload and the figures it produced — so we can scope the work without
          asking you to repeat it. Individual salary inputs are never sent. Nothing left your browser before this point.
        </p>
      </form>
    </section>
  );
}

function LabsField({
  id,
  name,
  label,
  error,
  type = "text",
  optional = false,
  required = false,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  type?: string;
  optional?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[0.94rem] text-white">
        {label}
        {optional && <span className="ml-2 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-mute">Optional</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-12 w-full rounded-[10px] bg-ink-2 px-3.5 text-[1rem] text-white outline-offset-4 ring-1 ring-inset transition-colors duration-200 placeholder:text-mute focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none",
          error ? "ring-signal" : "ring-line-dark-strong",
        )}
      />
      {error && (
        <p id={`${id}-error`} className="text-[0.86rem] leading-relaxed text-signal">
          {error}
        </p>
      )}
    </div>
  );
}

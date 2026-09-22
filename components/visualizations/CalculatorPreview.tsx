"use client";

import { useId, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowRight, Lock } from "@/components/ui/Icons";

const FIELDS = [
  { key: "campaigns", label: "Campaigns / month", min: 10, max: 500, step: 10, initial: 150 },
  { key: "platforms", label: "Platforms", min: 1, max: 10, step: 1, initial: 4 },
  { key: "markets", label: "Markets", min: 1, max: 12, step: 1, initial: 5 },
  { key: "team", label: "Internal team size", min: 1, max: 40, step: 1, initial: 6 },
] as const;

type Key = (typeof FIELDS)[number]["key"];

/**
 * Teaser for a future operations-cost calculator. It only shows arithmetic
 * derived directly from the visitor's inputs — no benchmarks, savings or ROI.
 */
export function CalculatorPreview() {
  const id = useId();
  const [v, setV] = useState<Record<Key, number>>(() => Object.fromEntries(FIELDS.map((f) => [f.key, f.initial])) as Record<Key, number>);
  const combos = v.platforms * v.markets;
  const perPerson = Math.round((v.campaigns / v.team) * 10) / 10;

  return (
    <div className="grid overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line lg:grid-cols-[1.05fr_1fr]">
      <div className="border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-steel">Inputs</p>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-steel">Preview</p>
        </div>
        <div className="mt-6 space-y-6">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <div className="flex items-baseline justify-between">
                <label htmlFor={`${id}-${f.key}`} className="font-mono text-[0.79rem] uppercase tracking-[0.1em] text-graphite">
                  {f.label}
                </label>
                <output htmlFor={`${id}-${f.key}`} className="text-[1.6rem] leading-none tracking-[-0.03em] text-ink tabular">
                  {v[f.key]}
                </output>
              </div>
              <input
                id={`${id}-${f.key}`}
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={v[f.key]}
                onChange={(e) => setV((prev) => ({ ...prev, [f.key]: Number(e.target.value) }))}
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-paper-2 accent-[#d93632]"
                style={{ background: `linear-gradient(to right, #d93632 ${((v[f.key] - f.min) / (f.max - f.min)) * 100}%, #efefeb 0)` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <p className="eyebrow text-steel">Operational load — from your inputs</p>
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line ring-1 ring-line">
          <div className="bg-paper p-4">
            <dt className="font-mono text-[0.68rem] uppercase leading-snug tracking-[0.1em] text-steel">Platform × market combinations</dt>
            <dd className="mt-3 text-[2.2rem] leading-none tracking-[-0.04em] text-ink tabular">{combos}</dd>
            <dd className="mt-2 text-[0.79rem] text-steel">
              {v.platforms} × {v.markets}
            </dd>
          </div>
          <div className="bg-paper p-4">
            <dt className="font-mono text-[0.68rem] uppercase leading-snug tracking-[0.1em] text-steel">Campaigns per team member / month</dt>
            <dd className="mt-3 text-[2.2rem] leading-none tracking-[-0.04em] text-ink tabular">{perPerson}</dd>
            <dd className="mt-2 text-[0.79rem] text-steel">
              {v.campaigns} ÷ {v.team}
            </dd>
          </div>
        </dl>

        <div className="relative mt-4 overflow-hidden rounded-lg ring-1 ring-line">
          <ul className="divide-y divide-line" aria-hidden="true">
            {["In-house model", "Hybrid model", "Trafficomm operations model"].map((m) => (
              <li key={m} className="flex items-center justify-between px-4 py-3 text-[0.94rem] text-steel">
                {m}
                <span className="h-2 w-24 rounded-full bg-[repeating-linear-gradient(135deg,#e2e2dd_0_4px,#f3f3ef_4px_8px)]" />
              </li>
            ))}
          </ul>
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <p className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-3.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-graphite ring-1 ring-line">
              <Lock className="size-3.5 shrink-0 text-signal-ink" /> Model comparison · full calculator
            </p>
          </div>
        </div>

        <a href="#assessment" className={buttonClasses("secondary", "lg", "mt-6 w-full sm:w-auto sm:self-start")}>
          Calculate your operations cost
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="mt-4 text-[0.86rem] leading-relaxed text-steel">
          The full calculator is in development and will compare operating models using transparent inputs. Until then, we can model it with you in an operations assessment.
        </p>
      </div>
    </div>
  );
}

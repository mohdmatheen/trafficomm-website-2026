"use client";

import { Choice, Chip, EstimatedTag, Money, Segmented, Slider, Stepper } from "@/components/labs/primitives";
import { formatHours, formatMoney, formatUsd } from "@/lib/labs/currency";
import { OPTIMIZATION_CADENCE_LABELS, REPORTING_FREQUENCY_LABELS } from "@/lib/labs/estimator";
import { ACTIVITIES, EFFICIENCY_INPUTS, MARKETS, ROLES, type MarketCode, type RoleId } from "@/lib/labs/model";
import { LABS_PLATFORMS } from "@/lib/labs/platforms";
import type { useLabsCalculator } from "@/lib/labs/state";

type Ctx = ReturnType<typeof useLabsCalculator>;

/** Shared question layout: the prompt and its control, with context beside it on
 *  desktop and stacked beneath on mobile. */
export function Question({ title, hint, children, aside }: { title: string; hint?: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
      <div>
        <h2 className="text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)] leading-[1.1] tracking-[-0.03em] text-ink">{title}</h2>
        {hint && <p className="mt-3 max-w-prose text-[1rem] leading-relaxed text-steel">{hint}</p>}
        <div className="mt-8">{children}</div>
      </div>
      {aside && <aside className="lg:pt-2">{aside}</aside>}
    </div>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[0.98rem] text-ink">{label}</label>
      {hint && <p className="text-[0.86rem] leading-relaxed text-steel">{hint}</p>}
      {children}
    </div>
  );
}

const numberField =
  "h-12 w-full rounded-[10px] bg-white px-3.5 text-[1.05rem] tabular-nums text-ink outline-offset-4 ring-1 ring-inset ring-line [appearance:textfield] focus-visible:ring-2 focus-visible:ring-signal [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export function MarketStep({ state, dispatch }: Ctx) {
  return (
    <Question
      title="Where does your team operate?"
      hint="This sets the salary assumptions and the currency every figure is shown in. You can replace the assumptions with your own costs at the next step."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(MARKETS) as MarketCode[]).map((code) => {
          const m = MARKETS[code];
          return (
            <Choice
              key={code}
              selected={state.input.market === code}
              onSelect={() => dispatch({ type: "setMarket", market: code })}
              title={m.label}
              meta={`${m.currency} · USD equivalent shown throughout`}
              description={
                code === "SA"
                  ? "Uses Trafficomm's approved Saudi salary assumptions."
                  : "Uses UAE market benchmarks from the Hays GCC salary guide."
              }
            />
          );
        })}
      </div>
      <p className="mt-6 text-[0.88rem] leading-relaxed text-steel">
        More markets will be added. The calculation engine is market-agnostic — only the salary dataset and currency change.
      </p>
    </Question>
  );
}

export function BusinessStep({ state, dispatch }: Ctx) {
  const i = state.input;
  return (
    <Question title="Tell us about the operation" hint="Three numbers. Approximate is fine — this shapes the workload estimate, not a quote.">
      <div className="grid gap-6">
        <Field id="business-type" label="What kind of team is this?">
          <Segmented
            label="Team type"
            value={i.businessType}
            onChange={(v) => dispatch({ type: "patchInput", patch: { businessType: v } })}
            options={[
              { value: "Agency", label: "Agency" },
              { value: "Brand / In-house", label: "Brand / in-house" },
            ]}
          />
        </Field>
        <div className="grid gap-6 sm:grid-cols-3">
          <Field id="clients" label="Active clients or accounts">
            <input id="clients" type="number" inputMode="numeric" min={1} max={2000} value={i.activeClients} className={numberField}
              onChange={(e) => dispatch({ type: "patchInput", patch: { activeClients: clampInt(e.target.value, 1, 2000) } })} />
          </Field>
          <Field id="campaigns" label="Campaigns launched per month">
            <input id="campaigns" type="number" inputMode="numeric" min={0} max={20000} value={i.campaignsPerMonth} className={numberField}
              onChange={(e) => dispatch({ type: "patchInput", patch: { campaignsPerMonth: clampInt(e.target.value, 0, 20000) } })} />
          </Field>
          <Field id="markets" label="Markets managed">
            <input id="markets" type="number" inputMode="numeric" min={1} max={60} value={i.marketsManaged} className={numberField}
              onChange={(e) => dispatch({ type: "patchInput", patch: { marketsManaged: clampInt(e.target.value, 1, 60) } })} />
          </Field>
        </div>
        <p className="text-[0.88rem] leading-relaxed text-steel">
          Enter the approximate number of campaigns your team launches or rebuilds in a typical month — not the number currently live.
        </p>
      </div>
    </Question>
  );
}

export function TeamStep(ctx: Ctx) {
  const { state, dispatch, market, fx } = ctx;
  const i = state.input;
  const estimate = state.salaryMode === "market";
  return (
    <Question
      title="Who runs it?"
      hint="Headcount by role. Salaries default to market assumptions — switch to your own costs if you prefer, and nothing you type leaves your browser."
      aside={
        <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-inset ring-line sm:p-6">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-steel">Monthly team cost</p>
          <Money amount={ctx.result.baseMonthlyCost} currency={market.currency} fx={fx} size="lg" className="mt-3" />
          <p className="mt-4 text-[0.86rem] leading-relaxed text-steel">
            Before the {Math.round(i.operating.employerOverhead * 100)}% employer overhead the model adds for benefits, recruitment, equipment and admin.
          </p>
        </div>
      }
    >
      <div className="grid gap-4">
        <Segmented
          label="Salary basis"
          value={state.salaryMode}
          onChange={(mode) => dispatch({ type: "setSalaryMode", mode })}
          options={[
            { value: "market", label: "Use market estimate" },
            { value: "custom", label: "Enter my actual costs" },
          ]}
        />
        <ul className="grid gap-3">
          {ROLES.map((role) => (
            <li key={role.id} className="rounded-[var(--radius-card)] bg-white p-4 ring-1 ring-inset ring-line sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[1.05rem] tracking-[-0.01em] text-ink">{role.label}</p>
                  {role.id !== "other" && estimate && (
                    <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[0.72rem] tabular-nums text-steel">
                      {formatMoney(market.salaries[role.id as Exclude<RoleId, "other">], market.currency)}/mo
                      <span className="text-fog">{formatUsd(market.salaries[role.id as Exclude<RoleId, "other">], fx.rate)}</span>
                    </p>
                  )}
                </div>
                <Stepper id={`hc-${role.id}`} label={`${role.label} headcount`} value={i.headcount[role.id]} onChange={(v) => dispatch({ type: "setHeadcount", role: role.id, value: v })} max={500} />
              </div>
              {!estimate && (
                <div className="mt-4 grid gap-2">
                  <label htmlFor={`sal-${role.id}`} className="text-[0.88rem] text-steel">
                    Monthly cost per person ({market.currency})
                  </label>
                  <input id={`sal-${role.id}`} type="number" inputMode="numeric" min={0} step={500} value={i.salaries[role.id]} className={numberField}
                    onChange={(e) => dispatch({ type: "setSalary", role: role.id, value: clampInt(e.target.value, 0, 10_000_000) })} />
                </div>
              )}
            </li>
          ))}
        </ul>
        {estimate && (
          <p className="flex flex-wrap items-center gap-2 text-[0.86rem] leading-relaxed text-steel">
            <EstimatedTag>Estimated using Trafficomm market assumptions</EstimatedTag>
            <span>{market.code === "SA" ? "Trafficomm approved Saudi defaults." : "Hays GCC Salary Guide 2025 averages."}</span>
          </p>
        )}
      </div>
    </Question>
  );
}

export function WorkloadStep(ctx: Ctx) {
  const { state, dispatch } = ctx;
  const d = state.drivers;
  const quick = state.workloadMode === "quick";
  return (
    <Question
      title="How much operational work does that generate?"
      hint="Most teams do not track this by activity. Answer the business questions and the calculator estimates the hours — then adjust anything that looks wrong."
      aside={
        <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-inset ring-line sm:p-6">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-steel">Workload</p>
          <p className="mt-3 text-[2.1rem] tabular-nums tracking-[-0.035em] text-ink">{formatHours(ctx.result.workloadHours)}</p>
          <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-steel">per month</p>
          {quick && <div className="mt-4"><EstimatedTag /></div>}
        </div>
      }
    >
      <div className="grid gap-6">
        <Segmented
          label="How to supply workload"
          value={state.workloadMode}
          onChange={(mode) => dispatch({ type: "setWorkloadMode", mode })}
          options={[
            { value: "quick", label: "Quick estimate" },
            { value: "detailed", label: "I know our hours" },
          ]}
        />

        {quick ? (
          <div className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="creatives" label="Creative variants per campaign">
                <input id="creatives" type="number" inputMode="numeric" min={1} max={200} value={d.creativesPerCampaign} className={numberField}
                  onChange={(e) => dispatch({ type: "setDrivers", patch: { creativesPerCampaign: clampInt(e.target.value, 1, 200) } })} />
              </Field>
              <div className="grid content-end gap-2">
                <p className="text-[0.98rem] text-ink">Platforms in use</p>
                <p className="font-mono text-[1.05rem] tabular-nums text-steel">{state.platforms.length} selected</p>
                <p className="text-[0.84rem] text-steel">Set on the next step.</p>
              </div>
            </div>
            <Slider id="reporting-freq" label="How often do clients receive reporting?" min={1} max={5} value={d.reportingFrequency}
              valueLabel={REPORTING_FREQUENCY_LABELS[d.reportingFrequency - 1]} minLabel="Monthly" maxLabel="Daily"
              onChange={(v) => dispatch({ type: "setDrivers", patch: { reportingFrequency: v } })} />
            <Slider id="opt-cadence" label="How often are campaigns optimised?" min={1} max={5} value={d.optimizationCadence}
              valueLabel={OPTIMIZATION_CADENCE_LABELS[d.optimizationCadence - 1]} minLabel="Monthly" maxLabel="Daily"
              onChange={(v) => dispatch({ type: "setDrivers", patch: { optimizationCadence: v } })} />
            <p className="text-[0.88rem] leading-relaxed text-steel">
              Hours are interpolated from these answers against Trafficomm&rsquo;s reference operation. They are an estimate, not a measurement — switch to
              &ldquo;I know our hours&rdquo; to enter observed figures.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {ACTIVITIES.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] bg-white p-4 ring-1 ring-inset ring-line">
                <div className="min-w-0">
                  <label htmlFor={`hrs-${a.id}`} className="text-[1rem] text-ink">{a.label}</label>
                  <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-steel">{a.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input id={`hrs-${a.id}`} type="number" inputMode="decimal" min={0} max={2000} step={0.5} value={state.input.hoursPerWeek[a.id]}
                    className="h-11 w-20 rounded-[10px] bg-paper px-3 text-right text-[1rem] tabular-nums text-ink outline-offset-4 ring-1 ring-inset ring-line focus-visible:ring-2 focus-visible:ring-signal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    onChange={(e) => dispatch({ type: "setHours", activity: a.id, value: Math.max(0, Math.min(2000, Number(e.target.value) || 0)) })} />
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-steel">hrs/wk</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Question>
  );
}

export function PlatformsStep({ state, dispatch }: Ctx) {
  const groups = Array.from(new Set(LABS_PLATFORMS.map((p) => p.group)));
  return (
    <Question
      title="Which platforms does the team run?"
      hint="Each platform carries its own build model, specs and reporting logic, so platform count moves operational workload more than campaign count does."
    >
      <div className="grid gap-6">
        {groups.map((g) => (
          <div key={g}>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-steel">{g}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {LABS_PLATFORMS.filter((p) => p.group === g).map((p) => (
                <Chip key={p.id} selected={state.platforms.includes(p.id)} onSelect={() => dispatch({ type: "togglePlatform", id: p.id })}>
                  {p.name}
                </Chip>
              ))}
            </div>
          </div>
        ))}
        <p className="text-[0.88rem] leading-relaxed text-steel">{state.platforms.length} selected.</p>
      </div>
    </Question>
  );
}

export function OperationsStep({ state, dispatch }: Ctx) {
  const groups = [
    { key: "automation", label: "Automation", hint: "How much of this runs without someone doing it by hand." },
    { key: "standardization", label: "Standards", hint: "Whether conventions exist and are actually followed." },
    { key: "governance", label: "QA & governance", hint: "Whether checks are a defined step rather than a habit." },
    { key: "reporting", label: "Reporting efficiency", hint: "How much assembly a report needs before it is useful." },
  ] as const;
  return (
    <Question
      title="How does the operation run today?"
      hint="Score each from 1 (entirely manual or undefined) to 5 (automated or fully standardised). These drive the operational efficiency score."
    >
      <div className="grid gap-8">
        {groups.map((g) => (
          <div key={g.key}>
            <p className="text-[1.05rem] tracking-[-0.01em] text-ink">{g.label}</p>
            <p className="mt-1 text-[0.88rem] leading-relaxed text-steel">{g.hint}</p>
            <div className="mt-4 grid gap-5">
              {EFFICIENCY_INPUTS.filter((e) => e.component === g.key).map((e) => (
                <Slider key={e.id} id={`eff-${e.id}`} label={e.label} min={1} max={5} value={state.input.efficiency[e.id]}
                  valueLabel={`${state.input.efficiency[e.id]} / 5`} minLabel="Manual" maxLabel="Automated"
                  onChange={(v) => dispatch({ type: "setEfficiency", id: e.id, value: v })} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Question>
  );
}

function clampInt(raw: string, min: number, max: number) {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

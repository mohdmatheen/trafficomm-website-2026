"use client";

import { SignalPipeline } from "./SignalPipeline";
import { ValidationGates } from "./ValidationGates";
import { adOpsPipeline, briefFields, campaignChecks, creativeChecks, monitorSignals, traffickingMap } from "@/data/visual/ad-operations-pipeline";

/** Shared framing for the small stage visuals inside the pipeline panel. */
function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-[var(--radius-card)] bg-ink-3/60 p-4 ring-1 ring-line-dark sm:p-5">
      <p className="eyebrow mb-4 !text-[0.62rem] text-fog">{label}</p>
      {children}
    </div>
  );
}

const Chip = ({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) => (
  <span className={`rounded-md px-2.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] ring-1 ring-inset ring-line-dark ${muted ? "text-fog/80" : "text-fog"}`}>{children}</span>
);

/** Campaign structure being assembled: campaign → ad set / creative. Platform-neutral. */
function BuildTree() {
  const branches = [
    { node: "Ad set / ad group", leaves: ["Audience", "Placement", "Budget"] },
    { node: "Creative", leaves: ["Format", "Copy", "Destination"] },
  ];
  return (
    <Frame label="Campaign structure">
      <p className="inline-block rounded-md bg-signal px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-white">Campaign</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {branches.map((b) => (
          <div key={b.node} className="relative pl-5">
            <span className="absolute left-0 top-0 h-full w-px bg-line-dark-strong" aria-hidden="true" />
            <span className="absolute left-0 top-4 h-px w-3 bg-line-dark-strong" aria-hidden="true" />
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-white">{b.node}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {b.leaves.map((l) => (
                <li key={l}>
                  <Chip>{l}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** Ad Operations pipeline: brief → build → traffic → QA → validate → approval → launch → monitor. */
export function CampaignPipeline() {
  return (
    <SignalPipeline
      stages={adOpsPipeline}
      label="Campaign operations pipeline"
      ownerLabels={{ client: "Your team", trafficomm: "Trafficomm", output: "In flight" }}
      detail={(i) => {
        if (i === 0)
          return (
            <Frame label="Illustrative campaign brief">
              <ul className="grid gap-1.5 sm:grid-cols-3">
                {briefFields.map((f) => (
                  <li key={f} className="rounded-md bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-line-dark">
                    <span className="block font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{f}</span>
                    <span className="mt-1.5 block h-1.5 w-full rounded-full bg-white/10" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </Frame>
          );
        if (i === 1) return <BuildTree />;
        if (i === 2)
          return (
            <Frame label="Objects mapped into the structure">
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {traffickingMap.map(([from, to]) => (
                  <li key={from} className="flex items-center gap-3 rounded-md bg-white/[0.04] px-3 py-2 text-[0.88rem] text-fog ring-1 ring-inset ring-line-dark">
                    <span className="flex-1">{from}</span>
                    <span className="text-signal" aria-hidden="true">
                      →
                    </span>
                    <span className="flex-1 text-right text-fog/80">{to}</span>
                  </li>
                ))}
              </ul>
            </Frame>
          );
        if (i === 3)
          return (
            <Frame label="Creative & tag checks">
              <ValidationGates checks={creativeChecks} />
            </Frame>
          );
        if (i === 4)
          return (
            <Frame label="Independent campaign QA">
              <ValidationGates checks={campaignChecks} />
            </Frame>
          );
        if (i === 5)
          return (
            <Frame label="Accountability">
              <ol className="grid gap-2 sm:grid-cols-3">
                {[
                  { t: "QA complete", who: "Trafficomm" },
                  { t: "Approval", who: "Your team" },
                  { t: "Launch ready", who: "Trafficomm" },
                ].map((step, k) => (
                  <li
                    key={step.t}
                    className={`relative rounded-md px-3 py-3 ring-1 ring-inset ${k === 1 ? "bg-signal-soft/10 ring-signal/60" : "bg-white/[0.04] ring-line-dark"}`}
                  >
                    <span className="block font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{step.who}</span>
                    <span className={`mt-1 block text-[0.95rem] ${k === 1 ? "text-white" : "text-fog"}`}>{step.t}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">Campaigns go live on your approval, not automatically.</p>
            </Frame>
          );
        if (i === 6)
          return (
            <Frame label="Go-live">
              <div className="flex flex-wrap items-center gap-3">
                <Chip muted>Launch ready</Chip>
                <span className="text-signal" aria-hidden="true">
                  →
                </span>
                <span className="flex items-center gap-2 rounded-md bg-signal px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-white">
                  <span className="size-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden="true" />
                  Campaign live
                </span>
              </div>
            </Frame>
          );
        return (
          <Frame label="Watched in flight">
            <ul className="grid gap-1.5 sm:grid-cols-4">
              {monitorSignals.map((m) => (
                <li key={m} className="rounded-md bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-line-dark">
                  <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">
                    <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                    {m}
                  </span>
                  <span className="mt-2 block text-[0.86rem] text-fog">Monitored</span>
                </li>
              ))}
            </ul>
          </Frame>
        );
      }}
    />
  );
}

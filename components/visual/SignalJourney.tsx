"use client";

import { SignalPipeline } from "./SignalPipeline";
import { ValidationGates } from "./ValidationGates";
import { destinationLanes, gtmParts, illustrativeEvent, measurementJourney, validationChecks } from "@/data/visual/measurement-journey";

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-[var(--radius-card)] bg-ink-3/60 p-4 ring-1 ring-line-dark sm:p-5">
      <p className="eyebrow mb-4 !text-[0.62rem] text-fog">{label}</p>
      {children}
    </div>
  );
}

/** A minimal abstract interface with the measured action on it. */
function ActionSurface() {
  return (
    <Frame label="Illustrative interface">
      <div className="rounded-md bg-white/[0.04] p-4 ring-1 ring-inset ring-line-dark">
        <span className="block h-1.5 w-24 rounded-full bg-white/15" aria-hidden="true" />
        <span className="mt-3 block h-1.5 w-40 rounded-full bg-white/10" aria-hidden="true" />
        <span className="mt-6 inline-flex items-center gap-2 rounded-md bg-signal px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-white">
          <span className="size-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden="true" />
          Form submit
        </span>
      </div>
      <p className="mt-3 text-[0.84rem] text-mute">The action becomes the signal that the rest of the chain carries.</p>
    </Frame>
  );
}

/** Measurement & Analytics: the signal journey from user action to validated reporting. */
export function SignalJourney() {
  return (
    <SignalPipeline
      stages={measurementJourney}
      label="Measurement signal journey"
      ownerLabels={{ client: "Your site", trafficomm: "Trafficomm", output: "Output" }}
      detail={(i) => {
        if (i === 0) return <ActionSurface />;
        if (i === 1)
          return (
            <Frame label="Illustrative event — no personal data">
              <div className="rounded-md bg-white/[0.04] p-4 font-mono text-[0.8rem] ring-1 ring-inset ring-line-dark">
                <p className="text-white">
                  event: <span className="text-signal">{illustrativeEvent.name}</span>
                </p>
                <ul className="mt-3 space-y-1.5 text-mute">
                  {illustrativeEvent.params.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="h-px w-3 bg-signal" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Frame>
          );
        if (i === 2)
          return (
            <Frame label="Inside the tag manager">
              <ol className="grid gap-1.5 sm:grid-cols-3">
                {gtmParts.map((g) => (
                  <li key={g.k} className="rounded-md bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-line-dark">
                    <span className="block font-mono text-[0.62rem] uppercase tracking-[0.1em] text-signal">{g.k}</span>
                    <span className="mt-1.5 block text-[0.9rem] text-fog">{g.v}</span>
                  </li>
                ))}
              </ol>
            </Frame>
          );
        if (i === 3)
          return (
            <Frame label="Two paths, one event">
              <ul className="grid gap-2 sm:grid-cols-2">
                {destinationLanes.map((l) => (
                  <li key={l.lane} className="rounded-md bg-white/[0.04] p-3 ring-1 ring-inset ring-line-dark">
                    <span className="block font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{l.lane}</span>
                    <span className="mt-2 flex flex-wrap items-center gap-2 text-[0.88rem] text-fog">
                      {l.nodes.map((node, k) => (
                        <span key={node} className="flex items-center gap-2">
                          {k > 0 && (
                            <span className="text-signal" aria-hidden="true">
                              →
                            </span>
                          )}
                          {node}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">
                Server-side signals such as Meta CAPI complement the browser signal. They do not restore every lost signal or create perfect attribution.
              </p>
            </Frame>
          );
        if (i === 4)
          return (
            <Frame label="Event to conversion">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[0.75rem] uppercase tracking-[0.08em]">
                <span className="rounded-md px-2.5 py-1.5 text-fog ring-1 ring-inset ring-line-dark">{illustrativeEvent.name}</span>
                <span className="text-signal" aria-hidden="true">
                  →
                </span>
                <span className="rounded-md bg-signal px-2.5 py-1.5 text-white">Conversion</span>
                <span className="text-signal" aria-hidden="true">
                  →
                </span>
                <span className="rounded-md px-2.5 py-1.5 text-fog ring-1 ring-inset ring-line-dark">Platform optimization</span>
              </div>
            </Frame>
          );
        if (i === 5)
          return (
            <Frame label="Validation layer">
              <ValidationGates checks={validationChecks} />
              <p className="mt-3 text-[0.84rem] text-mute">A validated signal is one that fired, carried its parameters, arrived, and mapped to the right conversion.</p>
            </Frame>
          );
        return (
          <Frame label="What the validated signal feeds">
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {["Reporting your team can defend", "Platform optimization signals"].map((o) => (
                <li key={o} className="flex items-center gap-2.5 rounded-md bg-white/[0.04] px-3 py-2.5 text-[0.9rem] text-fog ring-1 ring-inset ring-line-dark">
                  <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </Frame>
        );
      }}
    />
  );
}

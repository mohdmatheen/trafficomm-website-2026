"use client";

import { useId } from "react";
import { adServerRows, creativeChecks, displayFormats, readyState, systemNodes, type SystemNode } from "@/data/visual/creative-adtech-systems";
import { cn } from "@/lib/cn";
import { Chip, Frame, IllustrativeTag } from "./parts";
import { useSignalSequence } from "./useSignalSequence";
import { ValidationGates } from "./ValidationGates";

const N = systemNodes.length;
const creative = systemNodes.filter((s) => s.track === "creative");
const adtech = systemNodes.filter((s) => s.track === "adtech");
const bridgeIndex = systemNodes.findIndex((s) => s.track === "bridge");

/**
 * Creative & AdTech: two operational systems, and the bridge between them.
 *
 * Track A produces the creative. Track B is the publisher operation that has
 * to carry it. They are drawn as two separate tracks precisely because they
 * are two services — and the ad-serving bridge in the middle is the whole
 * argument for buying them from one team.
 *
 * Distinct from the other service visuals on purpose: no single rail, no
 * converging signals. A creative object moves along one production line,
 * crosses into the publisher system, and serves.
 *
 * One responsive composition: five across on desktop, a readable stack below
 * it. Under reduced motion the last node is selected and both rails are
 * complete, so the whole relationship is visible without any animation.
 */
export function ConnectedSystems({ sides }: { sides: readonly { code: string; label: string; summary: string }[] }) {
  const id = useId();
  const { ref, active, playing, select } = useSignalSequence(N);
  const node = systemNodes[active];

  const focusTab = (i: number) => {
    select(i);
    document.getElementById(`${id}-n${i}`)?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown";
    const prev = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!next && !prev && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    focusTab(e.key === "Home" ? 0 : e.key === "End" ? N - 1 : (i + (next ? 1 : N - 1)) % N);
  };

  const renderNode = (s: SystemNode, i: number, wide = false, first = false) => {
    const on = i === active;
    const done = i < active;
    return (
      <div key={s.id} role="presentation" className={cn("relative", wide && "w-full")}>
        {!first && (
          <span
            className={cn("absolute -left-3 top-1/2 hidden h-px w-3 lg:block", done || on ? "bg-signal" : "bg-line-dark-strong")}
            aria-hidden="true"
          />
        )}
        <button
          type="button"
          role="tab"
          id={`${id}-n${i}`}
          aria-selected={on}
          aria-controls={`${id}-p`}
          tabIndex={on ? 0 : -1}
          onClick={() => select(i)}
          onKeyDown={(e) => onKey(e, i)}
          className={cn(
            "flex min-h-11 w-full items-center gap-2.5 rounded-[var(--radius-card)] p-3 text-left outline-offset-4 ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none lg:flex-col lg:items-start lg:gap-2",
            on ? "bg-signal-soft/10 ring-signal/60" : done ? "bg-ink-2 ring-line-dark-strong" : "bg-ink-2 ring-line-dark hover:ring-line-dark-strong",
            wide && "lg:flex-row lg:items-center lg:justify-between lg:gap-4",
          )}
        >
          <span className="flex items-center gap-2.5">
            {/* The creative object itself: a square, not a rail dot. */}
            <span className={cn("size-2 shrink-0", on ? "bg-signal" : done ? "bg-white/50" : "bg-white/20")} aria-hidden="true" />
            <span className={cn("font-mono text-[0.68rem] uppercase leading-tight tracking-[0.08em]", on ? "text-white" : "text-fog")}>{s.label}</span>
          </span>
          {wide && <span className="hidden text-[0.86rem] text-fog lg:block">{s.summary}</span>}
        </button>
      </div>
    );
  };

  const trackHead = (code: string, label: string, summary: string) => (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-full bg-white font-mono text-[0.7rem] text-ink">{code}</span>
        <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-white">{label}</h3>
      </span>
      <p className="text-[0.9rem] leading-snug text-fog">{summary}</p>
    </div>
  );

  const detail = () => {
    if (node.id === "spec")
      return (
        <Frame label="Common display specifications — illustrative examples" className="mt-5">
          <ul className="flex flex-wrap items-end gap-3">
            {displayFormats.map((f) => (
              <li key={f.size} className="flex flex-col items-center gap-2">
                <span className="block bg-white/[0.06] ring-1 ring-inset ring-line-dark" style={{ width: f.w / 7, height: f.h / 7 }} aria-hidden="true" />
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-fog">{f.size}</span>
              </li>
            ))}
          </ul>
        </Frame>
      );
    if (node.id === "creative-qa")
      return (
        <Frame label="Creative QA gate" className="mt-5">
          <ValidationGates checks={creativeChecks} />
          <p className="mt-3 flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-white">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
            {readyState}
          </p>
        </Frame>
      );
    if (node.id === "configuration")
      return (
        <Frame label="Abstract ad-server view" className="mt-5">
          <div className="flex items-center justify-end pb-3">
            <IllustrativeTag>Illustrative interface</IllustrativeTag>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line-dark">
                {["Placement", "Creative", "Tag", "Status"].map((h) => (
                  <th key={h} scope="col" className="pb-2 font-mono text-[0.6rem] font-normal uppercase tracking-[0.1em] text-fog">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adServerRows.map((r) => (
                <tr key={r.placement} className="border-b border-line-dark/60 last:border-0">
                  <td className="py-2.5 text-[0.86rem] text-white">{r.placement}</td>
                  <td className="py-2.5 font-mono text-[0.78rem] text-fog tabular">{r.creative}</td>
                  <td className="py-2.5 text-[0.86rem] text-fog">{r.tag}</td>
                  <td className="py-2.5">
                    <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-white">
                      <span className={cn("size-1.5 rounded-full", r.status === "Live" ? "bg-signal" : "bg-white/40")} aria-hidden="true" />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">An abstract view of ad-server configuration. Trafficomm works in your ad server — this is not a Trafficomm product.</p>
        </Frame>
      );
    return null;
  };

  return (
    <div ref={ref}>
      <div>
        {/* Track A — creative technology. Each track is its own tab list: a
            tablist may not contain the headings that name the two systems. */}
        {trackHead(sides[0].code, sides[0].label, sides[0].summary)}
        <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3" role="tablist" aria-label="Creative technology stages">
          {creative.map((s, i) => renderNode(s, i, false, i === 0))}
        </div>

        {/* The bridge: where a creative becomes something an ad server can serve. */}
        <div className="relative h-8" aria-hidden="true">
          <span className="absolute inset-y-0 left-3 w-px bg-signal/40 lg:left-[90%]" />
        </div>
        <div role="tablist" aria-label="Where the two systems connect">{renderNode(systemNodes[bridgeIndex], bridgeIndex, true, true)}</div>
        <div className="relative h-8" aria-hidden="true">
          <span className="absolute inset-y-0 left-3 w-px bg-signal/40 lg:left-[70%]" />
        </div>

        {/* Track B — publisher / ad-tech operations */}
        {trackHead(sides[1].code, sides[1].label, sides[1].summary)}
        <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3" role="tablist" aria-label="Publisher and AdTech operations stages">
          {adtech.map((s, i) => renderNode(s, bridgeIndex + 1 + i, false, i === 0))}
        </div>
      </div>

      <div id={`${id}-p`} role="tabpanel" aria-label={`Creative and AdTech operations: ${node.label}`} className="mt-6 overflow-hidden rounded-[var(--radius-panel)] bg-ink-2 ring-1 ring-line-dark">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark px-5 py-3">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-white">{node.label}</span>
          <span className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">
              <span className={cn("size-1.5 rounded-full bg-signal", playing && "animate-pulse-dot")} aria-hidden="true" />
              {playing ? "Creative in production" : "Select a stage"}
            </span>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">
              {node.track === "creative" ? sides[0].label : node.track === "adtech" ? sides[1].label : "Where they connect"}
            </span>
          </span>
        </div>
        <div key={node.id} className="min-h-[34.5rem] p-5 sm:min-h-[28.5rem] sm:p-7 animate-enter">
          <p className="max-w-2xl text-[1.04rem] leading-relaxed text-fog">{node.summary}</p>
          {node.items && (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {node.items.map((it) => (
                <li key={it}>
                  <Chip>{it}</Chip>
                </li>
              ))}
            </ul>
          )}
          {detail()}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useId } from "react";
import {
  adServerRows,
  creativeFormats,
  creativeSpecSheet,
  inventoryTree,
  readyState,
  systemNodes,
  type SystemNode,
} from "@/data/visual/creative-adtech-systems";
import { cn } from "@/lib/cn";
import { FormatSpecimen } from "./HeroBoards";
import { Chip, Frame, IllustrativeTag } from "./parts";
import { useSignalSequence } from "./useSignalSequence";

const N = systemNodes.length;
const creative = systemNodes.filter((s) => s.track === "creative");
const publisher = systemNodes.filter((s) => s.track === "publisher");
const outputs = systemNodes.filter((s) => s.track === "output");
const bridgeIndex = systemNodes.findIndex((s) => s.track === "bridge");
const indexOf = (id: string) => systemNodes.findIndex((s) => s.id === id);

/**
 * Creative & AdTech: two production systems that meet at the ad server.
 *
 * Creative technology and publisher operations run as parallel inputs —
 * neither one delivers anything alone. Both feed trafficking and ad serving,
 * and delivery and reporting come out of that. The layout says it before the
 * copy does: two tracks, a bridge, then output.
 *
 * Distinct from the other service visuals on purpose: no single rail, no
 * converging KPI, no ownership lanes. The subject here is an object — a
 * creative that has to meet a specification before an ad server will carry it.
 *
 * The sequence walks both inputs, crosses the bridge, then comes back to rest
 * on the first stage so the page's resting state is where the story starts.
 * Under reduced motion the final stage is selected from the start, and every
 * node is visible either way.
 */
export function ConnectedSystems({ sides }: { sides: readonly { code: string; label: string; summary: string }[] }) {
  const id = useId();
  // Rests on the ad server: the point of the page is that the two systems meet there.
  const { ref, active, playing, select } = useSignalSequence(N, undefined, bridgeIndex);
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
          <span className={cn("absolute -left-3 top-1/2 hidden h-px w-3 lg:block", done || on ? "bg-signal" : "bg-line-dark-strong")} aria-hidden="true" />
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
            on ? "bg-signal-soft/10 ring-signal" : done ? "bg-ink-2 ring-line-dark-strong" : "bg-ink-2 ring-line-dark hover:ring-line-dark-strong",
            wide && "lg:flex-row lg:items-center lg:justify-between lg:gap-4",
          )}
        >
          <span className="flex items-center gap-2.5">
            {/* The creative object itself: a square, not a rail dot. Publisher-side nodes carry an outline. */}
            <span
              className={cn("size-2 shrink-0", on ? "bg-signal" : s.track === "publisher" ? "ring-1 ring-inset ring-white/40" : done ? "bg-white/50" : "bg-white/20")}
              aria-hidden="true"
            />
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
        <Frame label="Formats built to specification — abstract specimens" className="mt-5">
          <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
            {creativeFormats.map((f) => (
              <FormatSpecimen key={f.size} spec={f} tone="dark" maxSide={58} />
            ))}
          </div>
        </Frame>
      );
    if (node.id === "creative-qa")
      return (
        <Frame label="Creative QA gate — illustrative specification" className="mt-5">
          <dl className="grid gap-px overflow-hidden rounded-md bg-line-dark ring-1 ring-line-dark sm:grid-cols-2">
            {creativeSpecSheet.map((c) => (
              <div key={c.field} className="flex items-center justify-between gap-3 bg-ink-2 px-3 py-2">
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{c.field}</dt>
                <dd className="flex items-center gap-2.5 text-[0.86rem] text-white">
                  <span className="text-fog">{c.value}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white">
                    <svg viewBox="0 0 12 12" className="size-3 text-signal" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 6.4 4.7 9 10 3.4" />
                    </svg>
                    Pass
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-white">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
            {readyState}
          </p>
        </Frame>
      );
    if (node.id === "inventory")
      return (
        <Frame label="Abstract inventory structure" className="mt-5">
          <ul className="grid gap-1">
            {inventoryTree.map((t, i) => (
              <li key={`${t.label}-${i}`} className="flex items-center gap-3" style={{ paddingLeft: `${t.level * 1.5}rem` }}>
                <span className={cn("h-px w-3 shrink-0", t.level === 0 ? "bg-signal" : "bg-line-dark-strong")} aria-hidden="true" />
                <span className="flex flex-1 flex-wrap items-baseline gap-x-3 rounded-md bg-white/[0.04] px-3 py-2 ring-1 ring-inset ring-line-dark">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white">{t.label}</span>
                  <span className="text-[0.84rem] text-fog">{t.note}</span>
                </span>
              </li>
            ))}
          </ul>
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
                  <th key={h} scope="col" className="pb-2 font-mono text-[0.62rem] font-normal uppercase tracking-[0.1em] text-fog">
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
    if (node.id === "delivery")
      return (
        <Frame label="What is actually serving" className="mt-5">
          <ol className="flex flex-wrap items-center gap-2">
            {["Creative", "Placement", "Impression"].map((s, k) => (
              <li key={s} className="flex items-center gap-2">
                {k > 0 && (
                  <span className="text-signal" aria-hidden="true">
                    →
                  </span>
                )}
                <Chip tone={k === 2 ? "plain" : "muted"}>{s}</Chip>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">The execution that passed QA is the one in the placement it was built for.</p>
        </Frame>
      );
    if (node.id === "adserver")
      return (
        <Frame label="Where the two systems meet" className="mt-5">
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {[
              { from: "Creative technology", to: "Creative tag" },
              { from: "Publisher operations", to: "Placement" },
            ].map((r) => (
              <li key={r.from} className="flex items-center gap-3 rounded-md bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-line-dark">
                <span className="flex-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{r.from}</span>
                <span className="text-signal" aria-hidden="true">
                  →
                </span>
                <span className="flex-1 text-right text-[0.88rem] text-white">{r.to}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">Creative assignment is the moment the two systems become one campaign.</p>
        </Frame>
      );
    return null;
  };

  const trackLabel = node.track === "creative" ? sides[0].label : node.track === "publisher" ? sides[1].label : node.track === "bridge" ? "Where they connect" : "Output";

  return (
    <div ref={ref}>
      <div>
        {/* Input A — creative technology */}
        {trackHead(sides[0].code, sides[0].label, sides[0].summary)}
        <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3" role="tablist" aria-label="Creative technology stages">
          {creative.map((s, i) => renderNode(s, i, false, i === 0))}
        </div>

        {/* Input B — publisher operations, running in parallel */}
        <div className="mt-8">{trackHead(sides[1].code, sides[1].label, sides[1].summary)}</div>
        <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3" role="tablist" aria-label="Publisher and AdTech operations stages">
          {publisher.map((s, i) => renderNode(s, indexOf(s.id), false, i === 0))}
        </div>

        {/* Both inputs enter the ad server */}
        <div className="relative h-8" aria-hidden="true">
          <span className="absolute inset-y-0 left-3 w-px bg-signal/50 lg:left-[50%]" />
          <span className="absolute inset-y-0 hidden w-px bg-signal/50 lg:left-[90%] lg:block" />
        </div>
        <div role="tablist" aria-label="Where the two systems connect">
          {renderNode(systemNodes[bridgeIndex], bridgeIndex, true, true)}
        </div>

        {/* And come out as delivery and reporting */}
        <div className="relative h-8" aria-hidden="true">
          <span className="absolute inset-y-0 left-3 w-px bg-signal/50 lg:left-[10%]" />
        </div>
        <div className="relative grid gap-2 sm:grid-cols-2 lg:w-[40%] lg:grid-cols-2 lg:gap-3" role="tablist" aria-label="Output stages">
          {outputs.map((s, i) => renderNode(s, indexOf(s.id), false, i === 0))}
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
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{trackLabel}</span>
          </span>
        </div>
        <div key={node.id} className="min-h-[37.5rem] p-5 sm:min-h-[32.5rem] sm:p-7 animate-enter">
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
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-fog">
            <span className="flex items-center gap-2 text-white">
              <span className="size-1.5 bg-signal" aria-hidden="true" />
              {node.track === "bridge" ? "Both systems meet here" : node.track === "output" ? "Out of the ad server" : node.track === "creative" ? "Creative production" : "Publisher setup"}
            </span>
            {node.feeds ? (
              <>
                <span className="text-signal" aria-hidden="true">
                  →
                </span>
                <span>Feeds · {systemNodes[indexOf(node.feeds)].label}</span>
              </>
            ) : (
              <span>End of the chain</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

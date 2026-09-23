"use client";

import { useId } from "react";
import { PlatformMark } from "@/components/ui/PlatformMark";
import {
  architecture,
  bookingOrderFields,
  deliveryStateExample,
  deliveryStates,
  dv360Structure,
  inventoryNote,
  inventoryRoutes,
  lanes,
  programmaticChecks,
  type Lane,
} from "@/data/visual/programmatic-architecture";
import { cn } from "@/lib/cn";
import { Chip, Frame } from "./parts";
import { useSignalSequence } from "./useSignalSequence";
import { ValidationGates } from "./ValidationGates";

const N = architecture.length;
const LANE_Y: Record<Lane, number> = { agency: 100 / 6, trafficomm: 50, platform: 500 / 6 };
const colX = (i: number) => ((i + 0.5) / N) * 100;

/** Elbow route between two nodes: across, change lane, across again. */
const segment = (i: number) => {
  const x1 = colX(i);
  const x2 = colX(i + 1);
  const y1 = LANE_Y[architecture[i].lane];
  const y2 = LANE_Y[architecture[i + 1].lane];
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} L ${mid} ${y1} L ${mid} ${y2} L ${x2} ${y2}`;
};

/**
 * Programmatic Operations: the delivery architecture as a lane map.
 *
 * Three lanes — the agency's trading team, Trafficomm operations, and the
 * platforms and supply themselves — with every node drawn in the lane that
 * owns it. The media signal routes between lanes, which is the point: the
 * trader keeps strategy, inventory and buying decisions, and the operation
 * around those decisions is what Trafficomm runs.
 *
 * Not the ad operations pipeline (no single straight rail) and not the
 * performance engine: this one is a system map, and the route is the story.
 *
 * On the server and under reduced motion the route is complete and the final
 * node is selected, so nothing needs the animation to be understood.
 */
export function DeliveryArchitecture() {
  const id = useId();
  const { ref, active, playing, select } = useSignalSequence(N, undefined, 0);
  const node = architecture[active];
  const lane = lanes.find((l) => l.id === node.lane)!;

  const focusTab = (i: number, p: "t" | "m") => {
    select(i);
    document.getElementById(`${id}-${p}${i}`)?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number, p: "t" | "m") => {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown";
    const prev = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!next && !prev && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    focusTab(e.key === "Home" ? 0 : e.key === "End" ? N - 1 : (i + (next ? 1 : N - 1)) % N, p);
  };

  const tabProps = (i: number, p: "t" | "m") => ({
    type: "button" as const,
    role: "tab",
    id: `${id}-${p}${i}`,
    "aria-selected": i === active,
    "aria-controls": `${id}-p`,
    tabIndex: i === active ? 0 : -1,
    onClick: () => select(i),
    onKeyDown: (e: React.KeyboardEvent) => onKey(e, i, p),
  });

  const detail = () => {
    if (node.id === "plan")
      return (
        <Frame label="What arrives from the desk — illustrative booking order" className="mt-5">
          {/* Rows from sm up; on a phone the field names alone say the same thing in two lines. */}
          <ul className="hidden gap-1.5 sm:grid sm:grid-cols-2">
            {bookingOrderFields.map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-md bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-line-dark">
                <span className="w-24 shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{f}</span>
                <span className="h-1.5 flex-1 rounded-full bg-white/10" aria-hidden="true" />
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-1.5 sm:hidden">
            {bookingOrderFields.map((f) => (
              <li key={f} className="rounded-md bg-white/[0.04] px-2.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog ring-1 ring-inset ring-line-dark">
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">Field names only — Trafficomm never publishes a client&rsquo;s plan values.</p>
        </Frame>
      );
    if (node.id === "dv360")
      return (
        <Frame label="Plan structure in the platform" className="mt-5">
          <ol className="grid gap-1.5">
            {dv360Structure.map((s, i) => (
              <li key={s.level} className="flex flex-wrap items-baseline gap-x-3 rounded-md bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-line-dark" style={{ marginLeft: `${i * 1.25}rem` }}>
                <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white">
                  <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                  {s.level}
                </span>
                <span className="text-[0.86rem] text-fog">{s.note}</span>
              </li>
            ))}
          </ol>
        </Frame>
      );
    if (node.id === "inventory")
      return (
        <Frame label="Where the impression comes from" className="mt-5">
          <ul className="grid gap-1.5">
            {inventoryRoutes.map((r) => (
              <li key={r.format} className="flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-md bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-line-dark">
                <span className="w-28 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white">{r.format}</span>
                {r.path.map((s, k) => (
                  <span key={s} className="flex items-center gap-2.5 text-[0.88rem] text-fog">
                    {k > 0 && (
                      <span className="text-signal" aria-hidden="true">
                        →
                      </span>
                    )}
                    {s}
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">{inventoryNote}</p>
        </Frame>
      );
    if (node.id === "approval")
      return (
        <Frame label="Approval status" className="mt-5">
          <ul className="flex flex-wrap items-center gap-2">
            {["Submitted", "In review", "Approved"].map((s, k) => (
              <li key={s} className="flex items-center gap-2">
                {k > 0 && (
                  <span className="text-signal" aria-hidden="true">
                    →
                  </span>
                )}
                <Chip tone={k === 2 ? "plain" : "muted"}>{s}</Chip>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">Rejections come back with the specific reason, so the fix happens once.</p>
        </Frame>
      );
    if (node.id === "qa")
      return (
        <Frame label="Configuration checked against the booking" className="mt-5">
          <ValidationGates checks={programmaticChecks} />
        </Frame>
      );
    if (node.id === "delivery")
      return (
        <Frame label="Operational state — example" className="mt-5">
          <ol className="flex flex-wrap items-center gap-2">
            {deliveryStates.map((s, k) => {
              const on = s === deliveryStateExample;
              return (
                <li key={s} className="flex items-center gap-2">
                  {k > 0 && (
                    <span className="text-signal" aria-hidden="true">
                      →
                    </span>
                  )}
                  <Chip tone={on ? "on" : "muted"}>{s}</Chip>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">States a campaign moves through in flight. No delivery or performance figures are shown.</p>
        </Frame>
      );
    return null;
  };

  return (
    <div ref={ref}>
      {/* Desktop: three ownership lanes, one route crossing them. */}
      <div className="hidden lg:grid lg:grid-cols-[9.5rem_1fr] lg:gap-x-5">
        <ul className="grid h-[17rem] grid-rows-3" aria-label="Ownership lanes">
          {lanes.map((l) => (
            <li key={l.id} className="flex items-center">
              <span className={cn("font-mono text-[0.68rem] uppercase leading-tight tracking-[0.1em]", l.id === "trafficomm" ? "text-white" : "text-fog")}>{l.label}</span>
            </li>
          ))}
        </ul>
        <div className="relative grid h-[17rem] grid-rows-3" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
          {/* Lane bands: Trafficomm's lane is the one this page is about. */}
          <div className="pointer-events-none absolute inset-0 grid grid-rows-3" aria-hidden="true">
            {lanes.map((l) => (
              <div key={l.id} className={cn("rounded-[var(--radius-card)]", l.id === "trafficomm" ? "bg-white/[0.035] ring-1 ring-inset ring-line-dark" : "")} />
            ))}
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            {architecture.slice(0, -1).map((s, i) => {
              // While the signal is travelling the route lights up behind it; at rest the
              // whole architecture stays present, because the later stages are context,
              // not missing steps.
              const lit = playing ? i < active : true;
              return (
                <path
                  key={s.id}
                  d={segment(i)}
                  fill="none"
                  strokeWidth={lit ? 2 : 1.25}
                  vectorEffect="non-scaling-stroke"
                  className={cn("stroke-signal transition-opacity duration-500 ease-out motion-reduce:transition-none", lit ? "opacity-100" : "opacity-40")}
                />
              );
            })}
          </svg>
          <div role="tablist" aria-label="Programmatic delivery architecture" className="contents">
            {architecture.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <div key={s.id} role="presentation" className="relative z-10 flex items-stretch p-1.5" style={{ gridColumn: i + 1, gridRow: lanes.findIndex((l) => l.id === s.lane) + 1 }}>
                  <button
                    {...tabProps(i, "t")}
                    className={cn(
                      "relative flex w-full flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-2.5 text-left outline-offset-4 ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none",
                      on ? "bg-signal-soft/10 ring-2 ring-signal" : done ? "bg-ink-2 ring-line-dark-strong" : "bg-ink-2 ring-line-dark hover:ring-line-dark-strong",
                    )}
                  >
                    {on && <span className="absolute inset-x-0 top-0 h-[3px] bg-signal" aria-hidden="true" />}
                    <span className="flex items-center justify-between gap-1">
                      <span className={cn("font-mono text-[0.6rem]", on ? "text-white" : "text-fog")}>{String(i + 1).padStart(2, "0")}</span>
                      {s.platform && <PlatformMark slug={s.platform} size={18} className="rounded-[5px]" />}
                    </span>
                    <span className={cn("font-mono text-[0.64rem] uppercase leading-tight tracking-[0.08em]", on ? "text-white" : "text-fog")}>{s.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile / tablet: the same architecture read downward, lane by lane. */}
      <div role="tablist" aria-orientation="vertical" aria-label="Programmatic delivery architecture" className="relative lg:hidden">
        {architecture.map((s, i) => {
          const on = i === active;
          const li = lanes.findIndex((l) => l.id === s.lane);
          return (
            <div key={s.id} role="presentation" style={{ paddingLeft: `${li * 1.1}rem` }}>
              <button
                {...tabProps(i, "m")}
                className={cn(
                  "relative my-1 flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-card)] p-3 text-left outline-offset-4 ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none",
                  on ? "bg-signal-soft/10 ring-2 ring-signal" : "bg-ink-2 ring-line-dark",
                )}
              >
                {on && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-signal" aria-hidden="true" />}
                <span className={cn("font-mono text-[0.62rem]", on ? "text-white" : "text-fog")}>{String(i + 1).padStart(2, "0")}</span>
                {s.platform && <PlatformMark slug={s.platform} size={20} className="rounded-[5px]" />}
                <span className={cn("flex-1 font-mono text-[0.7rem] uppercase tracking-[0.08em]", on ? "text-white" : "text-fog")}>{s.label}</span>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{lanes.find((l) => l.id === s.lane)!.short}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* One panel for both compositions. */}
      <div id={`${id}-p`} role="tabpanel" aria-label={`Delivery architecture: ${node.label}`} className="mt-6 overflow-hidden rounded-[var(--radius-panel)] bg-ink-2 ring-1 ring-line-dark">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark px-5 py-3">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-white">
            {String(active + 1).padStart(2, "0")} · {node.label}
          </span>
          <span className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">
              <span className={cn("size-1.5 rounded-full bg-signal", playing && "animate-pulse-dot")} aria-hidden="true" />
              {playing ? "Media in transit" : "Select a stage"}
            </span>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{lane.label}</span>
          </span>
        </div>
        <div key={node.id} className="min-h-[35.5rem] p-5 sm:min-h-[26rem] sm:p-7 animate-enter">
          <p className="max-w-2xl text-[1.04rem] leading-relaxed text-fog">{node.summary}</p>
          {node.items && (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {node.items.map((it) => (
                <li key={it} className="rounded-md bg-white/[0.06] px-2.5 py-1.5 text-[0.9rem] text-fog ring-1 ring-inset ring-line-dark">
                  {it}
                </li>
              ))}
            </ul>
          )}
          {detail()}
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-fog">
            <span className="flex items-center gap-2 text-white">
              <span className="size-1.5 bg-signal" aria-hidden="true" />
              Media object here
            </span>
            {active < N - 1 ? (
              <>
                <span className="text-signal" aria-hidden="true">
                  →
                </span>
                <span>Next · {architecture[active + 1].label}</span>
              </>
            ) : (
              <span>End of the operation</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

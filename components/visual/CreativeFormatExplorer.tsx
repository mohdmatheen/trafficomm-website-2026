"use client";

import { useId, useState } from "react";
import { formatGroups, masterToFormats, type Specimen } from "@/data/visual/creative-formats";
import { cn } from "@/lib/cn";

/**
 * What Trafficomm's creative work actually looks like: the formats, drawn to
 * their real proportions.
 *
 * A prospective agency should be able to see that a 728 × 90 and a 9:16 are
 * different production problems without reading a paragraph about "multi-
 * format creative production". Selecting a group changes the specimens; the
 * HTML5 group shows the storyboard and the checks a package has to pass.
 *
 * Every frame is abstract — blocks for image, message and call to action.
 * Nothing here is client creative, and no production volume is claimed. The
 * panel reserves its height so switching groups never moves the page.
 */

/** One abstract creative, drawn to the group's aspect ratio. */
function Frame({ spec, max, label = true, video = false, interactive = false }: { spec: Specimen; max: number; label?: boolean; video?: boolean; interactive?: boolean }) {
  const k = max / Math.max(spec.w, spec.h);
  const w = Math.round(spec.w * k);
  const h = Math.round(spec.h * k);
  const wide = spec.w / spec.h > 2.2;
  const tiny = Math.min(w, h) < 26;
  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <div className={cn("relative flex gap-[3px] bg-paper p-[3px] ring-1 ring-inset ring-line", wide ? "flex-row items-stretch" : "flex-col")} style={{ width: w, height: h }} aria-hidden="true">
        <span className={cn("bg-ink/12", wide ? "h-full w-1/3" : "w-full flex-1")} />
        {!tiny && (
          <span className={cn("flex flex-col justify-between gap-[3px]", wide ? "flex-1" : "w-full")}>
            <span className="block h-[3px] w-full bg-ink/12" />
            <span className="block h-[3px] w-2/3 bg-ink/12" />
            <span className="block h-[5px] w-1/2 bg-signal" />
          </span>
        )}
        {tiny && <span className="block h-[4px] w-1/3 bg-signal" />}
        {video && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="block size-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-signal" />
          </span>
        )}
        {interactive && (
          <span className="absolute inset-x-[3px] bottom-[3px] flex h-1/3 items-center justify-center bg-white ring-1 ring-inset ring-line">
            <span className="font-mono text-[0.5rem] uppercase tracking-[0.1em] text-steel">Expand</span>
          </span>
        )}
      </div>
      {label && <figcaption className="font-mono text-[0.6rem] uppercase tracking-[0.06em] text-steel">{spec.size}</figcaption>}
    </figure>
  );
}

export function CreativeFormatExplorer() {
  const id = useId();
  const [active, setActive] = useState(0);
  const n = formatGroups.length;
  const g = formatGroups[active];

  const focusTab = (i: number) => {
    setActive(i);
    document.getElementById(`${id}-t${i}`)?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown";
    const prev = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!next && !prev && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    focusTab(e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (next ? 1 : n - 1)) % n);
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink">Creative formats</span>
        <span className="rounded-full bg-signal-soft/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-signal-ink ring-1 ring-inset ring-signal/40">Illustrative creative specimens</span>
      </div>

      <div className="border-b border-line px-5 py-3">
        <div role="tablist" aria-label="Creative format groups" className="flex flex-wrap gap-1.5">
          {formatGroups.map((f, i) => {
            const on = i === active;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                id={`${id}-t${i}`}
                aria-selected={on}
                aria-controls={`${id}-p`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "min-h-11 rounded-md px-3.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none",
                  on ? "bg-signal-ink text-white ring-signal-ink" : "text-steel ring-line hover:text-ink",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div id={`${id}-p`} role="tabpanel" aria-label={`${g.label} formats`} className="min-h-[21rem] p-5 sm:min-h-[19rem] sm:p-7">
        <p className="text-[1rem] leading-relaxed text-steel">{g.note}</p>

        {g.specimens && (
          <ul className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-5">
            {g.specimens.map((s) => (
              <li key={s.size}>
                <Frame spec={s} max={g.id === "display" ? 116 : 132} video={g.id === "video"} interactive={Boolean(g.interactive)} />
              </li>
            ))}
          </ul>
        )}

        {g.frames && (
          <div className="mt-6">
            <ol className="flex flex-wrap items-center gap-2">
              {g.frames.map((f, i) => (
                <li key={f} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-signal" aria-hidden="true">
                      →
                    </span>
                  )}
                  <span className={cn("flex h-14 w-20 flex-col justify-between rounded-[3px] p-1.5 ring-1 ring-inset", i === g.frames!.length - 1 ? "bg-white ring-signal" : "bg-paper ring-line")}>
                    <span className="block h-[3px] rounded-full bg-ink/15" style={{ width: `${40 + i * 18}%` }} aria-hidden="true" />
                    <span className={cn("block h-[5px] rounded-full", i === g.frames!.length - 1 ? "w-1/2 bg-signal" : "w-1/3 bg-ink/15")} aria-hidden="true" />
                    <span className="font-mono text-[0.56rem] uppercase tracking-[0.08em] text-steel">{f}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {g.checks && (
          <dl className="mt-6 grid gap-px overflow-hidden rounded-md bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
            {g.checks.map((c) => (
              <div key={c} className="flex items-center justify-between gap-3 bg-white px-3 py-2">
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-steel">{c}</dt>
                <dd className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink">
                  <svg viewBox="0 0 12 12" className="size-3 text-signal" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 6.4 4.7 9 10 3.4" />
                  </svg>
                  Checked
                </dd>
              </div>
            ))}
          </dl>
        )}

        {g.id === "display" && (
          <div className="mt-7 border-t border-line pt-5">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-steel">One master, the set a plan needs</p>
            <ul className="mt-3 flex flex-wrap items-center gap-2">
              <li className="rounded-md bg-ink px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-white">Master</li>
              <li aria-hidden="true" className="text-signal">
                →
              </li>
              {masterToFormats.map((m) => (
                <li key={m} className="rounded-md bg-paper px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink ring-1 ring-inset ring-line">
                  {m}
                </li>
              ))}
              <li aria-hidden="true" className="text-signal">
                →
              </li>
              <li className="flex items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink ring-1 ring-inset ring-signal">
                <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                QA · trafficked
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

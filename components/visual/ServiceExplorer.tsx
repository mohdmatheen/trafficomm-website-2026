"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight } from "@/components/ui/Icons";
import { ServiceGlyph, glyphCaption } from "@/components/visual/ServiceGlyph";
import { cn } from "@/lib/cn";

type Item = { slug: string; name: string; short: string };

/**
 * The company in one interface: six capabilities, and the operating model
 * behind whichever one you select.
 *
 * It is a preview, not a copy of the service pages — each glyph is the
 * miniature used in navigation, shown large enough to read. The point is that
 * a visitor can tell what Ad Operations is by looking at it, and only then
 * decide whether to read the page.
 *
 * Static by design: selection changes the picture, nothing animates on its
 * own, so there is nothing to wait for and nothing to disable under reduced
 * motion. Panel height is reserved so switching never moves the page.
 */
export function ServiceExplorer({ items }: { items: Item[] }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const n = items.length;
  const item = items[active];

  const focusTab = (i: number) => {
    setActive(i);
    document.getElementById(`${id}-t${i}`)?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight";
    const prev = e.key === "ArrowUp" || e.key === "ArrowLeft";
    if (!next && !prev && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    focusTab(e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (next ? 1 : n - 1)) % n);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-6">
      <ul role="tablist" aria-orientation="vertical" aria-label="Capabilities" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 lg:gap-1.5">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li key={it.slug} role="presentation">
              <button
                type="button"
                role="tab"
                id={`${id}-t${i}`}
                aria-selected={on}
                aria-controls={`${id}-p`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-card)] px-3 py-2.5 text-left outline-offset-4 ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none",
                  on ? "bg-white ring-signal" : "bg-white/60 ring-line hover:ring-line-strong",
                )}
              >
                <ServiceGlyph slug={it.slug} className="shrink-0" />
                <span className="min-w-0">
                  <span className={cn("block text-[1rem] leading-tight tracking-[-0.01em]", on ? "text-ink" : "text-graphite")}>{it.name}</span>
                  <span className="mt-0.5 block font-mono text-[0.62rem] uppercase tracking-[0.08em] text-steel">{glyphCaption[it.slug]}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div id={`${id}-p`} role="tabpanel" aria-label={`${item.name} operating model`} className="overflow-hidden rounded-[var(--radius-panel)] bg-white ring-1 ring-line">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink">{item.name}</span>
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-steel">{glyphCaption[item.slug]}</span>
        </div>
        <div key={item.slug} className="flex min-h-[19rem] flex-col justify-between gap-6 p-6 sm:min-h-[17rem] sm:p-8 animate-enter">
          <div className="flex flex-1 items-center justify-center rounded-[var(--radius-card)] bg-paper px-5 py-8 ring-1 ring-line sm:px-8">
            <ServiceGlyph slug={item.slug} full className="w-full max-w-[36rem]" />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-md text-[0.98rem] leading-relaxed text-steel">{item.short}</p>
            <Link href={`/services/${item.slug}`} className="group flex items-center gap-2 whitespace-nowrap text-[0.94rem] font-medium text-ink">
              {item.name} <ArrowRight className="text-signal transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/data/types";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Animated statistic. Server-renders the final value (SEO, no-JS, reduced
 * motion), then counts up from zero the first time it scrolls into view.
 */
export function Counter({ stat, duration = 1800 }: { stat: Stat; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(stat.value);

  useEffect(() => {
    const el = ref.current;
    if (!el || stat.display || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setValue(Math.round(stat.value * easeOutExpo(t)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    // Reset only if we are going to animate, so there is no flash for visible-at-load counters.
    setValue(0);
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stat.value, stat.display, duration]);

  const text = stat.display ?? `${stat.prefix ?? ""}${value.toLocaleString("en-US")}${stat.suffix ?? ""}`;
  const final = stat.display ?? `${stat.prefix ?? ""}${stat.value.toLocaleString("en-US")}${stat.suffix ?? ""}`;

  return (
    <span ref={ref} className="tabular">
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}

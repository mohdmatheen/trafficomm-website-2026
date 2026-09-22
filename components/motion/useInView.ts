"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { reducedMotionQuery } from "@/lib/motion/tokens";
import { observeVisibility, type VisibilityOptions } from "@/lib/motion/visibility";

/** True once the element has entered the viewport (never flips back). */
export function useInView<T extends Element>(options: VisibilityOptions = { threshold: 0.25 }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const { rootMargin, threshold } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const off = observeVisibility(
      el,
      (v) => {
        if (v) {
          setInView(true);
          off();
        }
      },
      { rootMargin, threshold },
    );
    return off;
  }, [rootMargin, threshold]);
  return { ref, inView };
}

/**
 * Calls `onChange(visible)` whenever the element enters/leaves the viewport
 * (and the tab is visible). Use it to start/stop loops and SVG animation.
 */
export function useVisibilityEffect<T extends Element>(ref: RefObject<T | null>, onChange: (visible: boolean) => void, options: VisibilityOptions = {}) {
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });
  const { rootMargin, threshold } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inViewport = false;
    const emit = () => cb.current(inViewport && !document.hidden);
    const off = observeVisibility(
      el,
      (v) => {
        inViewport = v;
        emit();
      },
      { rootMargin, threshold },
    );
    document.addEventListener("visibilitychange", emit);
    return () => {
      off();
      document.removeEventListener("visibilitychange", emit);
      cb.current(false);
    };
  }, [ref, rootMargin, threshold]);
}

/** Pauses an SVG's native (SMIL) animations while it is off-screen. */
export function usePauseSvgWhenHidden(ref: RefObject<SVGSVGElement | null>) {
  useVisibilityEffect(ref, (visible) => {
    const svg = ref.current;
    if (!svg) return;
    if (visible) svg.unpauseAnimations();
    else svg.pauseAnimations();
  });
}

// Stable subscribe functions per query, so useSyncExternalStore never resubscribes on re-render.
const subscribers = new Map<string, (cb: () => void) => () => void>();
const subscribeQuery = (query: string) => {
  let fn = subscribers.get(query);
  if (!fn) {
    fn = (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    };
    subscribers.set(query, fn);
  }
  return fn;
};

/**
 * Media query match. Returns `null` during SSR and hydration, so components
 * can server-render every variant (no layout shift) and drop the unused one
 * right after hydration.
 */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    subscribeQuery(query),
    () => window.matchMedia(query).matches,
    () => null,
  );
}

/**
 * Reduced-motion preference. The server snapshot is `true`, so the static
 * state renders and hydrates; animation switches on right after hydration
 * when the user allows motion.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeQuery(reducedMotionQuery), () => window.matchMedia(reducedMotionQuery).matches, () => true);
}

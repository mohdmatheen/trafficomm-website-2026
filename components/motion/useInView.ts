"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Fires once when the element first enters the viewport. */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.25 }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Reduced-motion preference. The server snapshot is `true`, so the static
 * (non-animated) state is what renders and hydrates; animation switches on
 * right after hydration when the user allows motion.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => true);
}

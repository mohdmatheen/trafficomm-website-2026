"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { reducedMotionQuery } from "@/lib/motion/tokens";
import { observeVisibility } from "@/lib/motion/visibility";

/**
 * One IntersectionObserver for the whole app. Any element with `data-reveal`
 * fades up once when it enters the viewport. Content is visible without JS
 * because the hidden state only applies under `html.js`.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed='true'])"));
    if (window.matchMedia(reducedMotionQuery).matches) {
      els.forEach((el) => (el.dataset.revealed = "true"));
      return;
    }
    const offs = els.map((el) => {
      const off = observeVisibility(
        el,
        (visible) => {
          if (!visible) return;
          el.dataset.revealed = "true";
          off();
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      return off;
    });
    return () => offs.forEach((off) => off());
  }, [pathname]);

  return null;
}

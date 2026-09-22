"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole app. Any element with `data-reveal`
 * fades up once when it enters the viewport. Content is visible without JS
 * because the hidden state only applies under `html.js`.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed='true'])"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => (el.dataset.revealed = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

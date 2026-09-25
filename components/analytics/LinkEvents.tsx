"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * One delegated listener for every tracked link on the site.
 *
 * The alternative was a tracking prop threaded through thirteen call sites of
 * ButtonLink plus the contact page's link list. This touches no markup at all,
 * which matters when the design is signed off: there is no way for an analytics
 * change to move a pixel.
 *
 * It is also why the mailto:, tel: and LinkedIn cases are safe to include.
 * Trafficomm's email, phone and LinkedIn values are still null in data/site.ts, so
 * those links are not rendered on any page today. Nothing here creates them — the
 * listener simply matches nothing until the real details are filled in, and starts
 * reporting on its own when they are.
 */

/** Where the link sits, as a short stable label rather than a DOM path. */
function locationOf(el: Element): string {
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest('nav[aria-label="Mobile"]')) return "mobile_nav";
  const section = el.closest("section[aria-labelledby]");
  const labelledBy = section?.getAttribute("aria-labelledby");
  // Section heading ids are authored, stable and carry no personal data.
  if (labelledBy) return labelledBy;
  return "page";
}

function classify(link: HTMLAnchorElement): AnalyticsEvent | null {
  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return "email_click";
  if (href.startsWith("tel:")) return "phone_click";
  // Only Trafficomm's own LinkedIn profile — never the internal /platforms/linkedin page.
  if (/^https?:\/\/([\w-]+\.)*linkedin\.com\//i.test(href)) return "linkedin_click";
  if (href === "/contact" || href.startsWith("/contact?") || href.startsWith("/contact#")) return "contact_cta_click";
  return null;
}

export function LinkEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const event = classify(link);
      if (!event) return;
      trackEvent(event, { cta_location: locationOf(link) });
    };
    // Capture phase: the event is recorded even if a handler stops propagation.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

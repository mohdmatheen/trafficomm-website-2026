"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * Fires a single view event when a page mounts.
 *
 * This is not a pageview — GTM raises those. It marks that a particular case study
 * or solution was opened, carrying only its slug. The ref guard keeps React's
 * development double-render from reporting one visit twice.
 */
export function ViewEvent({ event, params }: { event: AnalyticsEvent; params?: Record<string, string> }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackEvent(event, params ?? {});
  }, [event, params]);
  return null;
}

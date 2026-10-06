"use client";

import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/attribution";

/**
 * Records the first page of the visit.
 *
 * Mounted once in the root layout so it runs on whichever page the visitor
 * actually lands on, which is the only moment the campaign parameters are in the
 * URL. Everything after that reads what this stored.
 *
 * It renders nothing, pushes nothing to the dataLayer and sends nothing to the
 * network. Attribution reaches a server only when a visitor submits a form, and
 * reaches GTM never — the analytics allowlist has no key for a UTM value.
 */
export function FirstTouch() {
  useEffect(() => {
    captureFirstTouch();
  }, []);
  return null;
}

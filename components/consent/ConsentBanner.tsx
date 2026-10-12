"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import {
  GEO_STORAGE_KEY,
  OPEN_CONSENT_EVENT,
  applyConsentChoice,
  readStoredChoice,
  requiresConsent,
  type ConsentChoice,
} from "@/lib/consent";

/** The visitor's country, cached in sessionStorage so /api/geo is asked once per session. */
async function visitorCountry(): Promise<string | null> {
  try {
    const cached = sessionStorage.getItem(GEO_STORAGE_KEY);
    if (cached !== null) return cached || null;
  } catch {
    // Storage blocked: ask the server each time.
  }
  try {
    const res = await fetch("/api/geo", { cache: "no-store" });
    const { country } = (await res.json()) as { country: string | null };
    try {
      sessionStorage.setItem(GEO_STORAGE_KEY, country ?? "");
    } catch {}
    return country;
  } catch {
    return null;
  }
}

/**
 * Asks UK, EU, EEA and Swiss visitors whether Google Analytics may set cookies.
 * Until they choose, Consent Mode keeps analytics_storage denied for them (see
 * lib/consent.ts). Other visitors see nothing unless they open "Cookie settings"
 * in the footer, which shows the banner in every region.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (readStoredChoice() === null) {
      visitorCountry().then((country) => {
        if (!cancelled && requiresConsent(country)) setOpen(true);
      });
    }
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      cancelled = true;
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, []);

  const choose = useCallback((choice: ConsentChoice) => {
    applyConsentChoice(choice);
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-[90] rounded-2xl bg-ink p-5 text-white ring-1 ring-white/15 shadow-[0_12px_40px_rgb(0_0_0/0.25)] sm:inset-x-auto sm:left-5 sm:bottom-5 sm:max-w-sm"
    >
      <p className="text-[0.93rem] leading-relaxed text-fog">
        We use Google Analytics cookies to understand how this site is used. They&rsquo;re off until you choose.{" "}
        <Link href="/privacy#cookies" className="text-white underline underline-offset-4">
          Privacy policy
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className={buttonClasses("light", "md")} onClick={() => choose("granted")}>
          Accept analytics
        </button>
        <button type="button" className={buttonClasses("light", "md")} onClick={() => choose("denied")}>
          Reject
        </button>
      </div>
    </div>
  );
}

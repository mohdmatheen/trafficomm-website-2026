"use client";

import { OPEN_CONSENT_EVENT, clearStoredChoice } from "@/lib/consent";

/** Footer control: forgets the stored choice and reopens the banner, in any region. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        clearStoredChoice();
        window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
      }}
    >
      Cookie settings
    </button>
  );
}

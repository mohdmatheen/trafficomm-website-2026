"use client";

import { useState } from "react";

/**
 * Requests a sign-in link.
 *
 * The success message is the same whether or not the address is authorised,
 * matching the endpoint, so the UI cannot be used to enumerate who has access
 * either.
 */
export function LoginForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  return (
    <form
      className="mt-8 grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email");
        setStatus("sending");
        try {
          await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
        } catch {
          /* The uniform message is shown either way; a network error reveals nothing useful here. */
        }
        setStatus("sent");
      }}
    >
      <label htmlFor="admin-email" className="text-[0.94rem] text-ink">
        Work email
      </label>
      <input
        id="admin-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="h-12 w-full rounded-[10px] bg-white px-3.5 text-[1rem] text-ink outline-offset-4 ring-1 ring-inset ring-line focus-visible:ring-2 focus-visible:ring-signal"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 text-[0.95rem] font-medium text-white outline-offset-4 transition-colors duration-200 hover:bg-graphite disabled:opacity-60 motion-reduce:transition-none"
      >
        {status === "sending" ? "Sending…" : "Send sign-in link"}
      </button>
      {status === "sent" && (
        <p role="status" className="text-[0.92rem] leading-relaxed text-steel">
          If that address is authorised, a sign-in link is on its way. It expires in 15 minutes.
        </p>
      )}
    </form>
  );
}

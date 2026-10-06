"use client";

import { useState } from "react";
import { ALLOWED_TRANSITIONS, SOURCE_LABELS, STATUS_GROUP, type Lead, type LeadStatus } from "@/lib/leads/types";
import { cn } from "@/lib/cn";

/**
 * The lead table.
 *
 * Deliberately a table and not a CRM. The buttons offered come from the same
 * transition map the server enforces, so the UI cannot suggest a move that would
 * be rejected — but the server rejects it anyway if the request is made another
 * way, which is where the actual control lives.
 */

const GROUP_STYLE: Record<ReturnType<() => (typeof STATUS_GROUP)[LeadStatus]>, string> = {
  raw: "bg-paper-2 text-steel ring-line-strong",
  qualified: "bg-ink text-white ring-ink",
  opportunity: "bg-signal-soft text-signal-ink ring-signal/40",
  closed: "bg-paper-2 text-graphite ring-line-strong",
  invalid: "bg-transparent text-steel ring-line line-through",
};

export function LeadTable({ leads }: { leads: Lead[] }) {
  const [rows, setRows] = useState(leads);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function move(lead: Lead, next: LeadStatus) {
    setBusy(lead.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
      if (!res.ok || !data.ok) {
        setError(data.reason === "illegal_transition" ? "That change is no longer valid — reload the page." : "Could not update the lead.");
        return;
      }
      setRows((current) => current.map((r) => (r.id === lead.id ? { ...r, status: next } : r)));
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  }

  if (!rows.length) {
    return <p className="rounded-[var(--radius-card)] bg-white px-5 py-8 text-center text-[0.98rem] text-steel ring-1 ring-inset ring-line">No leads yet.</p>;
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-4 rounded-[10px] bg-signal-soft px-4 py-3 text-[0.92rem] text-signal-ink ring-1 ring-inset ring-signal/30">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-[var(--radius-card)] ring-1 ring-line">
        <table className="w-full min-w-[72rem] border-collapse bg-white text-left text-[0.86rem]">
          <thead>
            <tr className="border-b border-line">
              {["Received", "Name", "Company", "Work email", "Role", "Country", "Source", "Campaign", "Creative", "Requirement", "Volume", "Status", "Move to"].map(
                (h) => (
                  <th key={h} scope="col" className="whitespace-nowrap px-3 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-steel">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => {
              const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "—";
              return (
                <tr key={lead.id} className="border-b border-line align-top last:border-0">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[0.76rem] tabular-nums text-steel">
                    {new Date(lead.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                    {lead.isTestLead && <span className="ml-2 rounded-full bg-paper-2 px-2 py-0.5 text-[0.62rem] uppercase text-steel">test</span>}
                  </td>
                  <td className="px-3 py-3 text-ink">{name}</td>
                  <td className="px-3 py-3 text-ink">{lead.company ?? "—"}</td>
                  <td className="px-3 py-3"><a href={`mailto:${lead.email}`} className="text-graphite underline decoration-line-strong underline-offset-2">{lead.email}</a></td>
                  <td className="px-3 py-3 text-steel">{lead.jobTitle ?? "—"}</td>
                  <td className="px-3 py-3 text-steel">{lead.countryCode ?? "—"}</td>
                  <td className="px-3 py-3 text-steel">{SOURCE_LABELS[lead.source]}</td>
                  {/* Attribution. An em dash means it genuinely was not supplied. */}
                  <td className="px-3 py-3 font-mono text-[0.74rem] text-steel">
                    {lead.utmCampaign ?? lead.campaignUrn ?? "—"}
                    {lead.utmSource && <span className="block text-fog">{lead.utmSource}</span>}
                    {lead.liFatId && <span className="block text-signal-ink">li_fat_id ✓</span>}
                  </td>
                  <td className="px-3 py-3 font-mono text-[0.74rem] text-steel">{lead.utmContent ?? lead.creativeUrn ?? "—"}</td>
                  <td className="max-w-[18rem] px-3 py-3 text-steel">{lead.requirement ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-steel">{lead.campaignVolume ?? "—"}</td>
                  <td className="px-3 py-3">
                    <span className={cn("inline-block rounded-full px-2.5 py-1 font-mono text-[0.64rem] uppercase tracking-[0.08em] ring-1 ring-inset", GROUP_STYLE[STATUS_GROUP[lead.status]])}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {ALLOWED_TRANSITIONS[lead.status].length === 0 && <span className="text-[0.76rem] text-fog">—</span>}
                      {ALLOWED_TRANSITIONS[lead.status].map((next) => (
                        <button
                          key={next}
                          type="button"
                          disabled={busy === lead.id}
                          onClick={() => move(lead, next)}
                          className="min-h-8 rounded-full bg-paper px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink outline-offset-4 ring-1 ring-inset ring-line transition-colors duration-150 hover:ring-line-strong disabled:opacity-40 motion-reduce:transition-none"
                        >
                          {next}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[0.8rem] leading-relaxed text-steel">
        QUALIFIED reserves a LinkedIn Qualified Lead conversion exactly once. Nothing is sent to LinkedIn yet — the integration is not built.
      </p>
    </>
  );
}

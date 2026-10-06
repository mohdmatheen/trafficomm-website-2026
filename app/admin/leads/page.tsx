import { redirect } from "next/navigation";
import { LeadTable } from "@/components/admin/LeadTable";
import { currentAdmin } from "@/lib/auth/require";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listLeads } from "@/lib/leads/store";
import { STATUS_GROUP } from "@/lib/leads/types";

/**
 * The lead list.
 *
 * A server component: the session is resolved and the rows are fetched on the
 * server, so an unauthenticated request is redirected before any lead data is
 * assembled, let alone serialised into a payload. There is no client-side
 * "if (!user) hide" anywhere, because that is a style and not a control.
 */
export default async function AdminLeadsPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  if (!isDatabaseConfigured()) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-[2rem] tracking-[-0.03em] text-ink">Lead dashboard</h1>
        <p className="mt-4 rounded-[10px] bg-signal-soft px-4 py-3 text-[0.95rem] text-signal-ink ring-1 ring-inset ring-signal/30">
          No database is configured on this deployment, so there are no stored leads to show. Set <code>DATABASE_URL</code> and run the migrations.
        </p>
      </main>
    );
  }

  const leads = await listLeads();
  const counts = leads.reduce<Record<string, number>>((acc, l) => {
    const g = STATUS_GROUP[l.status];
    acc[g] = (acc[g] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="mx-auto w-full max-w-[90rem] px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-signal-ink">Trafficomm internal</p>
          <h1 className="mt-2 text-[1.9rem] tracking-[-0.03em] text-ink">Lead dashboard</h1>
        </div>
        <p className="font-mono text-[0.72rem] text-steel">
          {admin} ·{" "}
          <a href="/api/admin/logout" className="underline decoration-line-strong underline-offset-4 hover:text-ink">
            sign out
          </a>
        </p>
      </div>

      {/* The four commercial states, so raw, qualified, opportunity and invalid
          are distinguishable before reading a single row. */}
      <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["Raw leads", counts.raw ?? 0, "NEW and CONTACTED"],
            ["Qualified", counts.qualified ?? 0, "Signal LinkedIn will optimise toward"],
            ["Opportunity", counts.opportunity ?? 0, "Opportunity and proposal"],
            ["Closed", counts.closed ?? 0, "Won and lost"],
            ["Invalid", counts.invalid ?? 0, "Reviewed, not a real lead"],
          ] as const
        ).map(([label, value, note]) => (
          <div key={label} className="rounded-[var(--radius-card)] bg-white px-5 py-4 ring-1 ring-inset ring-line">
            <dt className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-steel">{label}</dt>
            <dd className="mt-2 text-[1.6rem] tabular-nums tracking-[-0.02em] text-ink">{value}</dd>
            <dd className="mt-0.5 text-[0.78rem] leading-snug text-steel">{note}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <LeadTable leads={leads} />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CTABand } from "@/components/sections/shared/CTABand";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Trafficomm Labs — Operations Tools for Agencies",
  description:
    "Free tools from Trafficomm's operations team. Measure what your ad operations cost, how much capacity they consume and how much of the workload could be delivered externally.",
  path: "/labs",
});

/** Only shipped tools appear. A roadmap of links that do nothing is worse than a short list. */
const TOOLS = [
  {
    href: "/labs/adops-capacity",
    name: "AdOps Capacity & Outsourcing Calculator",
    summary:
      "Calculate what your advertising operations are really costing your team, how much of your capacity execution consumes, and how much of that workload could be delivered externally.",
    meta: "Free · ~3 minutes · No signup",
  },
];

export default function LabsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Labs", path: "/labs" }]}
        eyebrow="Trafficomm Labs"
        title={
          <>
            Tools from the team <span className="block text-steel/70">that runs the operation.</span>
          </>
        }
        lead="Trafficomm Labs builds the instruments we use to size, check and plan advertising operations. They are free, they run in your browser, and they are useful whether or not you ever talk to us."
      />
      <Section tone="paper">
        <ul className="grid gap-4 lg:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="group flex h-full flex-col rounded-[var(--radius-panel)] bg-white p-7 outline-offset-4 ring-1 ring-inset ring-line transition-colors duration-200 hover:ring-line-strong motion-reduce:transition-none sm:p-9"
              >
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-steel">{t.meta}</span>
                <span className="mt-5 text-[1.5rem] leading-tight tracking-[-0.025em] text-ink">{t.name}</span>
                <span className="mt-3 flex-1 text-[1rem] leading-relaxed text-steel">{t.summary}</span>
                <span className="mt-7 flex items-center gap-2 text-[0.96rem] font-medium text-ink">
                  Open the tool
                  <span aria-hidden="true" className="text-signal transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CTABand title="Want the operation behind the numbers?" />
    </>
  );
}

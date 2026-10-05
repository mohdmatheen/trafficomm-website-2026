import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/labs/Calculator";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { Section, SectionHeading } from "@/components/ui/Section";
import { siteUrl } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ad Operations Outsourcing Calculator — AdOps Capacity",
  description:
    "Free calculator for agencies: work out what your ad operations cost, how much team capacity campaign execution consumes, and how many hours a month could be delivered externally. Saudi Arabia and UAE.",
  path: "/labs/adops-capacity",
});

/** Explanatory copy sits below the tool: crawlable, useful, and never in the way of it. */
const EXPLAINERS = [
  {
    id: "what-is-adops-capacity",
    title: "What ad operations capacity means",
    body: [
      "Ad operations capacity is the amount of campaign execution, verification, in-flight management and reporting work a team can complete in its available working time, at the standard it has committed to.",
      "It is not the same as headcount. A team of eight has a fixed number of hours in a month, but only part of those hours are available for operational work once briefing, meetings, documentation and escalations are accounted for. The calculator uses that productive share rather than gross hours, which is why utilization can exceed 100% on a team that looks adequately staffed.",
    ],
  },
  {
    id: "what-it-measures",
    title: "What this calculator measures",
    body: [
      "It takes your team, your campaign volume and how your operation runs, and returns four things: what the team costs fully loaded, how much of its productive capacity the workload consumes, what the execution half of that work costs at your effective hourly rate, and how many hours a month are suitable for external delivery.",
      "Workload is split across ten activities — campaign setup and trafficking, QA, reporting production, data extraction, budget pacing, routine optimisation, creative coordination, tracking and measurement, strategy, and client or internal meetings — because the mix matters more than the total. A team spending 70% of its hours on execution has a different problem from one spending 70% on meetings.",
    ],
  },
  {
    id: "who-it-is-for",
    title: "Who it is for",
    body: [
      "Agency founders, heads of digital, performance marketing directors, ad operations leads and operations directors — anyone accountable for whether campaign execution gets done without consuming the people who are supposed to be doing strategy.",
      "In-house performance teams can use it the same way. The questions are about operational load, not about who owns the budget.",
    ],
  },
  {
    id: "what-outsourcing-means",
    title: "What ad operations outsourcing actually means",
    body: [
      "Ad operations outsourcing is moving the execution layer of digital advertising — campaign setup, trafficking, QA, pacing, optimisation support and reporting — to a specialist team that works alongside your own. Strategy, client relationships and commercial decisions stay in-house. The operational hours move.",
      "That is why this calculator reports hours rather than savings. What external delivery is worth depends on a delivery scope and a price, and the model deliberately contains neither.",
    ],
  },
  {
    id: "how-capacity-planning-works",
    title: "How capacity planning works",
    body: [
      "Campaign count is an input, not a capacity model. A campaign is a container for an unknown amount of work: one might be built once and report monthly, another rebuilt twice across five platforms with forty creative variants and daily reporting. Both are one campaign.",
      "Sizing a team means measuring the workload the campaigns actually generate and comparing it against the operating time the team actually has. This calculator does that with Trafficomm's reference assumptions; the method for doing it with your own observed figures is set out in the capacity planning guide.",
    ],
  },
];

export default function AdOpsCapacityPage() {
  return (
    <>
      {/* The tool is the page. Everything explanatory sits beneath it. */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto w-full max-w-[72rem] px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-20">
          <Link href="/labs" className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-signal-ink outline-offset-4">
            Trafficomm Labs
          </Link>
          <h1 className="mt-5 max-w-[20ch] text-[clamp(2.1rem,1.5rem+2.8vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-ink">
            Know what your AdOps operation is really costing you.
          </h1>
          <p className="mt-6 max-w-2xl text-[clamp(1.02rem,0.98rem+0.3vw,1.2rem)] leading-relaxed text-steel">
            Analyse your team&rsquo;s capacity, operational workload and execution cost — and see where campaign operations may be consuming strategic talent.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-steel">
            {["Free", "~3 minutes", "No signup required"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="bg-paper py-12 sm:py-16">
        <Calculator />
      </div>

      <Section tone="white" labelledBy="about-title">
        <SectionHeading
          id="about-title"
          eyebrow="About this tool"
          title={
            <>
              Ad operations capacity, <span className="block text-steel/70">and what it is costing.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-x-16">
          {EXPLAINERS.map((e) => (
            <section key={e.id} id={e.id}>
              <h2 className="text-[1.35rem] tracking-[-0.025em] text-ink">{e.title}</h2>
              {e.body.map((p) => (
                <p key={p.slice(0, 32)} className="mt-3 text-[1rem] leading-relaxed text-steel">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <div className="mt-14 border-t border-line pt-8">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-steel">Read next</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/insights/ad-operations-capacity-planning", label: "Ad operations capacity planning", meta: "Method" },
              { href: "/insights/agency-guide-to-outsourcing-ad-operations", label: "Ad operations outsourcing: the complete guide", meta: "Guide" },
              { href: "/ad-operations-outsourcing", label: "Ad operations outsourcing", meta: "Service" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] bg-paper p-5 outline-offset-4 ring-1 ring-inset ring-line transition-colors duration-200 hover:ring-line-strong motion-reduce:transition-none"
                >
                  <span className="font-mono text-[0.64rem] uppercase tracking-[0.1em] text-steel">{l.meta}</span>
                  <span className="mt-2.5 text-[1.02rem] leading-snug text-ink">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper">
        <p className="mx-auto max-w-3xl text-center text-[0.9rem] leading-relaxed text-steel">
          Salary figures are Trafficomm market assumptions, not published national averages, and the externalizable share of each activity is a model
          assumption rather than an observation about any particular team. Your inputs stay in your browser — nothing is submitted unless you choose to
          get in touch.
        </p>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Labs", path: "/labs" },
          { name: "AdOps Capacity Calculator", path: "/labs/adops-capacity" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AdOps Capacity & Outsourcing Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          url: `${siteUrl}/labs/adops-capacity`,
          description:
            "Calculate ad operations cost, team utilization and externalizable workload for agencies operating in Saudi Arabia and the UAE.",
          isAccessibleForFree: true,
          publisher: { "@id": `${siteUrl}/#organization` },
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
    </>
  );
}

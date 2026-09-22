import type { Metadata } from "next";
import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Lock } from "@/components/ui/Icons";
import { Eyebrow } from "@/components/ui/Section";
import { company, enquiryConfidentialityNote, markets } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Request an Operations Assessment",
  description:
    "Talk to Trafficomm about ad operations, performance marketing, programmatic, measurement or reporting support. Request an operations assessment or schedule a call.",
  path: "/contact",
});

const next = [
  { t: "We review your request", b: "An operations lead reviews your markets, platforms, volumes and challenges." },
  { t: "A working conversation", b: "We walk through how campaigns move from plan to report in your team today." },
  { t: "Assessment & recommendation", b: "You get our view on where operational time is lost and an operating model that fits." },
];

export default function ContactPage() {
  const details = [
    company.email && { k: "Email", v: <a className="underline decoration-signal underline-offset-4" href={`mailto:${company.email}`}>{company.email}</a> },
    company.phone && { k: "Phone", v: <a href={`tel:${company.phone}`}>{company.phone}</a> },
    company.linkedin && { k: "LinkedIn", v: <a href={company.linkedin} target="_blank" rel="noopener noreferrer">Trafficomm on LinkedIn</a> },
  ].filter(Boolean) as { k: string; v: React.ReactNode }[];

  return (
    <section className="relative overflow-hidden bg-paper pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="grid-bg mask-radial pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-site relative">
        <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
        <div className="mt-10 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-6">Let&apos;s talk operations</Eyebrow>
            <h1 className="text-h1 text-ink">
              What&apos;s slowing <span className="block text-steel/70">your media team down?</span>
            </h1>
            <p className="mt-7 max-w-lg text-lead text-steel">
              Request an operations assessment, or ask to talk to Trafficomm. Tell us a little about your markets, platforms and volumes so the first conversation is useful.
            </p>

            <div id="call" className="mt-12 scroll-mt-28">
              <p className="eyebrow mb-5 text-steel">What happens next</p>
              <ol className="space-y-5">
                {next.map((n, i) => (
                  <li key={n.t} className="grid grid-cols-[2.5rem_1fr] gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-white font-mono text-[0.68rem] text-ink ring-1 ring-line-strong">{i + 1}</span>
                    <div>
                      <p className="text-[1.05rem] tracking-[-0.01em] text-ink">{n.t}</p>
                      <p className="mt-1 text-[0.92rem] leading-relaxed text-steel">{n.b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {details.length > 0 && (
              <dl className="mt-12 divide-y divide-line border-y border-line">
                {details.map((d) => (
                  <div key={d.k} className="flex justify-between gap-6 py-4 text-[0.95rem]">
                    <dt className="text-steel">{d.k}</dt>
                    <dd className="text-ink">{d.v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-12">
              <p className="eyebrow mb-4 text-steel">Markets supported</p>
              <p className="text-[0.95rem] text-graphite">{markets.map((m) => m.name).join(" · ")}</p>
            </div>
            <p className="mt-8 flex max-w-md items-start gap-2.5 text-[0.88rem] leading-relaxed text-steel">
              <Lock className="mt-0.5 shrink-0 text-ink" />
              <span>{enquiryConfidentialityNote}</span>
            </p>
          </div>
          <div className="lg:pt-2">
            <AssessmentForm tone="light" idPrefix="contact" privacyNote={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

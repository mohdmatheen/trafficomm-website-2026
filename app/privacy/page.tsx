import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Section";
import { privacySections, privacyUpdated } from "@/data/privacy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Trafficomm collects and uses information through this website: enquiry and Labs forms, Google Analytics, cookies, sharing, retention and your rights.",
  path: "/privacy",
});

const updatedLabel = new Date(`${privacyUpdated}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function PrivacyPage() {
  return (
    <section className="bg-paper pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Privacy Policy", path: "/privacy" }]} />
        <div className="mt-10 max-w-3xl">
          <Eyebrow className="mb-6">Legal</Eyebrow>
          <h1 className="text-h1 text-ink">Privacy Policy</h1>
          <p className="mt-6 text-[0.95rem] text-steel">
            Last updated <time dateTime={privacyUpdated}>{updatedLabel}</time>
          </p>
          <p className="mt-6 text-lead text-steel">
            This policy explains what Trafficomm collects through this website, why we collect it, who it is shared with and the choices you have.
          </p>
          <nav aria-label="On this page" className="mt-10 border-y border-line py-6">
            <ol className="grid gap-2 text-[0.95rem] sm:grid-cols-2">
              {privacySections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-graphite underline decoration-line-strong underline-offset-4 hover:text-ink">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-12 space-y-12">
            {privacySections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-[1.5rem] tracking-[-0.015em] text-ink">{s.heading}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p} className="mt-4 leading-relaxed text-graphite">{p}</p>
                ))}
                {s.items && (
                  <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-graphite marker:text-steel">
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                )}
                {s.after?.map((p) => (
                  <p key={p} className="mt-4 leading-relaxed text-graphite">{p}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

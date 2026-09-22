import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";

export function CTABand({
  eyebrow = "Let's talk operations",
  title = "What's slowing your media team down?",
  body = "Request an operations assessment and we'll map where setup, QA, optimization and reporting time is going — and what a performance operations layer would change.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section aria-label="Request an operations assessment" className="relative overflow-hidden bg-ink py-20 text-white sm:py-24">
      <div className="grid-bg-dark mask-fade-y pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 top-1/2 size-[640px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(234_62_58/0.16),transparent_62%)]" aria-hidden="true" />
      <div className="container-site relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          <h2 className="mt-6 text-h2">{title}</h2>
          <p className="mt-6 max-w-xl text-lead text-fog">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <ButtonLink href="/contact" size="lg">
            Request an Operations Assessment
          </ButtonLink>
          <ButtonLink href="/contact#call" size="lg" variant="outline-dark" arrow={false}>
            Talk to Trafficomm
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

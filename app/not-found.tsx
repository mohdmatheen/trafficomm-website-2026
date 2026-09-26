import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  const links = [
    { href: "/services", label: "Services" },
    { href: "/case-studies", label: "Case studies" },
    { href: "/how-we-work", label: "How we work" },
    { href: "/about", label: "About" },
  ];
  return (
    <section className="relative flex min-h-[80dvh] items-center overflow-hidden bg-paper pt-28 pb-20">
      <div className="grid-bg mask-radial pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site relative">
        <Eyebrow>Error 404 · Placement not found</Eyebrow>
        <h1 className="mt-6 text-h1 text-ink">
          This page didn&apos;t <span className="block text-steel/70">pass QA.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lead text-steel">The link may be broken or the page may have moved. Here are some places to go instead.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex h-11 items-center rounded-full px-5 text-[0.9rem] text-ink ring-1 ring-inset ring-line-strong hover:bg-ink/5">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CTABand } from "@/components/sections/shared/CTABand";
import { PageHero } from "@/components/sections/shared/PageHero";
import { OperatingModel } from "@/components/sections/home/OperatingModel";
import { ArrowRight } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { solutions } from "@/data/solutions";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Solutions — Operating Models for Agencies, Brands & Publishers",
  description:
    "Performance operations models for media agencies, performance agencies, brands, publishers and ad-tech companies — including white-label ad operations.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Solutions", path: "/solutions" }]}
        eyebrow="Solutions"
        title={
          <>
            Built around <span className="block text-steel/70">how you operate.</span>
          </>
        }
        lead="Agencies, brands, publishers and ad-tech companies need different things from an operations partner. Each model below defines what you keep, what Trafficomm runs and how we engage."
      />
      <Section tone="paper" className="!pt-0">
        <ul className="divide-y divide-line border-y border-line">
          {solutions.map((s, i) => (
            <li key={s.slug} data-reveal>
              <Link href={`/solutions/${s.slug}`} className="group grid gap-4 py-8 sm:py-10 lg:grid-cols-[4rem_1fr_1.3fr_auto] lg:items-center lg:gap-10">
                <span className="font-mono text-[0.72rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-h3 text-ink transition-colors group-hover:text-signal-ink">{s.name}</span>
                <span className="text-[1rem] leading-relaxed text-steel">{s.headline}</span>
                <span className="flex size-12 items-center justify-center rounded-full ring-1 ring-line-strong transition-all duration-500 group-hover:bg-ink group-hover:text-white">
                  <ArrowRight />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <OperatingModel index={null} />
      <CTABand />
    </>
  );
}

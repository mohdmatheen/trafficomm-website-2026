import type { Metadata } from "next";
import { PlatformMark } from "@/components/ui/PlatformMark";
import Link from "next/link";
import { CTABand } from "@/components/sections/shared/CTABand";
import { PageHero } from "@/components/sections/shared/PageHero";
import { PlatformEcosystem } from "@/components/sections/home/PlatformEcosystem";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Eyebrow, Section } from "@/components/ui/Section";
import { platforms } from "@/data/platforms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Platforms — Meta, Google Ads, DV360, CM360 & More",
  description:
    "Campaign operations across Meta, Google Ads, TikTok, Snapchat, X, LinkedIn, DV360, CM360, Search Ads 360 and Amazon Ads — one team, shared standards.",
  path: "/platforms",
});

const categories = ["Social", "Professional", "Search", "Programmatic", "Ad Serving", "Retail Media"] as const;

export default function PlatformsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Platforms", path: "/platforms" }]}
        eyebrow="Platform experience"
        title={
          <>
            Ten platforms. <span className="block text-steel/70">One operations team.</span>
          </>
        }
        lead="Most media plans span several platforms. Trafficomm operates across all of them with one set of standards — so naming, QA, pacing and reporting stay consistent however the budget is split."
      />
      <Section tone="paper" className="!pt-0">
        <div className="space-y-14">
          {categories.map((cat) => {
            const list = platforms.filter((p) => p.category === cat);
            if (!list.length) return null;
            return (
              <div key={cat} className="grid gap-6 lg:grid-cols-[14rem_1fr]">
                <Eyebrow className="lg:pt-2">{cat}</Eyebrow>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/platforms/${p.slug}`} className="group flex h-full flex-col rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line transition-shadow hover:shadow-[0_24px_50px_-28px_rgb(0_0_0/0.3)]">
                        <span className="flex items-start justify-between">
                          <span className="flex items-center gap-3 text-[1.5rem] tracking-[-0.03em] text-ink">
                            <PlatformMark slug={p.slug} size={40} className="rounded-[10px]" />
                            {p.name}
                          </span>
                          <ArrowUpRight className="text-signal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                        <span className="mt-1 text-[0.85rem] text-steel">{p.short}</span>
                        <span className="mt-6 text-[0.88rem] leading-relaxed text-graphite">{p.capabilities.slice(0, 3).join(" · ")}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>
      <PlatformEcosystem index={null} />
      <CTABand />
    </>
  );
}

import Link from "next/link";
import { JsonLd, serviceSchema } from "@/components/seo/JsonLd";
import { CTABand } from "@/components/sections/shared/CTABand";
import { LinkList } from "@/components/sections/shared/LinkList";
import { PageHero } from "@/components/sections/shared/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { PlatformMark } from "@/components/ui/PlatformMark";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ObjectChain } from "@/components/visual/ObjectChain";
import { platforms } from "@/data/platforms";
import { services } from "@/data/services";
import type { Platform } from "@/data/types";

export function PlatformTemplate({ platform }: { platform: Platform }) {
  const svc = services.filter((s) => platform.services.includes(s.slug));
  const others = platforms.filter((p) => p.slug !== platform.slug);

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Platforms", path: "/platforms" },
          { name: platform.name, path: `/platforms/${platform.slug}` },
        ]}
        eyebrow={`${platform.category} · ${platform.short}`}
        title={platform.headline}
        lead={platform.intro}
        actions={
          <ButtonLink href="/contact" size="lg">
            Request an Operations Assessment
          </ButtonLink>
        }
        aside={
          <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-ink p-7 text-white sm:p-9">
            <div className="grid-bg-dark absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-line-dark-strong">
                  <LogoMark className="w-6" inverted />
                </span>
                <span className="h-px flex-1 bg-[repeating-linear-gradient(90deg,#ea3e3a_0_4px,transparent_4px_8px)]" aria-hidden="true" />
                <span className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 text-[0.92rem] text-ink">
                  <PlatformMark slug={platform.slug} size={30} className="rounded-full ring-0" />
                  {platform.name}
                </span>
              </div>
              <p className="eyebrow mt-8 text-mute">What we operate</p>
              <ul className="mt-4 grid gap-px overflow-hidden rounded-lg bg-line-dark">
                {platform.capabilities.map((c) => (
                  <li key={c} className="flex items-center gap-3 bg-ink-2 px-4 py-2.5 text-[0.92rem]">
                    <span className="size-1 rounded-full bg-signal" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <Section tone="white" labelledBy="ops-title">
        <SectionHeading id="ops-title" eyebrow={`${platform.name} operations`} title="How we run it" />
        {platform.hierarchy && (
          <div className="mt-10" data-reveal>
            <ObjectChain items={platform.hierarchy} label={`${platform.name} objects`} />
          </div>
        )}
        <ol className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-line ring-1 ring-line md:grid-cols-2 lg:grid-cols-4">
          {platform.operations.map((o, i) => (
            <li key={o.title} className="bg-white p-7" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
              <span className="font-mono text-[0.7rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-[1.3rem] tracking-[-0.02em] text-ink">{o.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-steel">{o.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="paper" labelledBy="svc-title">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading id="svc-title" eyebrow="Related capabilities" title={`Services we deliver on ${platform.name}`} />
            <div className="mt-10">
              <LinkList items={svc.map((s) => ({ href: `/services/${s.slug}`, label: s.name, meta: s.scopeLine.join(" · ") }))} />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="One operations team" title="Across every platform" />
            <ul className="mt-10 flex flex-wrap gap-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/platforms/${p.slug}`} className="inline-flex h-11 items-center gap-2.5 rounded-full bg-white pl-1.5 pr-4 text-[0.92rem] text-ink ring-1 ring-line transition-colors hover:ring-ink">
                    <PlatformMark slug={p.slug} size={32} className="rounded-full ring-0" />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-14 max-w-3xl text-[0.8rem] leading-relaxed text-steel">
          {platform.officialName ?? platform.name} and all other platform names and marks are trademarks of their respective owners. They indicate the platforms Trafficomm has operational experience with and do not imply partnership, certification or endorsement.
        </p>
      </Section>

      <CTABand title={`Running ${platform.name} at volume?`} />
      <JsonLd data={serviceSchema({ name: `${platform.name} campaign operations`, description: platform.seo.description, path: `/platforms/${platform.slug}` })} />
    </>
  );
}

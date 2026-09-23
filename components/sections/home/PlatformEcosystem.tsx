import { Section, SectionHeading } from "@/components/ui/Section";
import { PlatformNetwork } from "@/components/visualizations/PlatformNetwork";
import { ecosystemPlatforms } from "@/data/platforms";

export function PlatformEcosystem({ index = "04" }: { index?: string | null }) {
  return (
    <Section tone="dark" labelledBy="platforms-title" className="overflow-hidden">
      <div className="grid-bg-dark mask-radial pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end xl:gap-16">
          <SectionHeading
            id="platforms-title"
            tone="dark"
            index={index ?? undefined}
            eyebrow="Platforms we operate across"
            title={
              <>
                Multiple Platforms. <span className="block text-mute">One Operations Team.</span>
              </>
            }
          />
          <p className="text-[1rem] leading-relaxed text-fog lg:pb-2" data-reveal>
            Social, search, programmatic, ad serving, retail media, commerce and delivery — operated by one team with shared standards for naming, QA and reporting. Select a platform to see what we run on it.
          </p>
        </div>
        <div className="mt-14 lg:mt-12">
          <PlatformNetwork items={ecosystemPlatforms} caption="Across major advertising, commerce and delivery platforms" />
        </div>
        <p className="mt-12 max-w-3xl text-[0.81rem] leading-relaxed text-mute">
          Platform names and marks are trademarks of their respective owners. They indicate the platforms Trafficomm has operational experience with and do not imply partnership, certification or endorsement. Coverage continues to expand; this is not an exhaustive list.
        </p>
      </div>
    </Section>
  );
}

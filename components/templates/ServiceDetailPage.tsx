import { JsonLd, serviceSchema } from "@/components/seo/JsonLd";
import { Conversion } from "@/components/sections/home/Conversion";
import { FlagshipCase } from "@/components/sections/home/FlagshipCase";
import { FAQList } from "@/components/sections/shared/FAQList";
import { LinkList } from "@/components/sections/shared/LinkList";
import { PressureCascade } from "@/components/sections/shared/PressureCascade";
import { AgencyIntegration } from "@/components/service-page/AgencyIntegration";
import { EngagementModels } from "@/components/service-page/EngagementModels";
import { LifecycleExplorer } from "@/components/service-page/LifecycleExplorer";
import { ProofStrip } from "@/components/service-page/ProofStrip";
import { ServiceHero } from "@/components/service-page/ServiceHero";
import { CampaignPipeline } from "@/components/visual/CampaignPipeline";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PlatformNetwork } from "@/components/visualizations/PlatformNetwork";
import { platforms } from "@/data/platforms";
import type { ServicePageContent } from "@/data/service-pages/types";

const Title = ({ t, dark = false }: { t: [string, string]; dark?: boolean }) => (
  <>
    {t[0]} <span className={`block ${dark ? "text-mute" : "text-steel/70"}`}>{t[1]}</span>
  </>
);

/**
 * Full service page. Renders a ServicePageContent object section by section;
 * the Ad Operations page is the reference implementation of this template.
 */
export function ServiceDetailPage({ content, name }: { content: ServicePageContent; name: string }) {
  const c = content;
  return (
    <>
      <ServiceHero content={c} name={name} />
      <ProofStrip note={c.proof.note} />

      <Section tone="paper" labelledBy="pressure-title">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="pressure-title" eyebrow="The operational problem" title={<Title t={c.pressure.title} />} lead={c.pressure.lead} />
          </div>
          <PressureCascade tiers={c.pressure.tiers} resolution={c.pressure.resolution} label="How campaign growth becomes operational risk" />
        </div>
      </Section>

      {/* The campaign pipeline is the page's signature visual, so it sits on the dark canvas. */}
      <Section tone={c.lifecycle.visual ? "dark" : "white"} labelledBy="lifecycle-title" className="overflow-hidden">
        {c.lifecycle.visual && <div className="grid-bg-dark mask-fade-y pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />}
        <div className="relative">
          <SectionHeading
            id="lifecycle-title"
            tone={c.lifecycle.visual ? "dark" : "light"}
            eyebrow="What Trafficomm handles"
            title={<Title t={c.lifecycle.title} dark={Boolean(c.lifecycle.visual)} />}
            lead={c.lifecycle.lead}
          />
          <div className="mt-14">{c.lifecycle.visual === "campaign-pipeline" ? <CampaignPipeline /> : <LifecycleExplorer stages={c.lifecycle.stages} />}</div>
        </div>
      </Section>

      {c.platforms && (
        <Section tone="dark" labelledBy="svc-platforms-title" className="overflow-hidden">
          <div className="grid-bg-dark mask-radial pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end xl:gap-16">
              <SectionHeading id="svc-platforms-title" tone="dark" eyebrow="Platform experience" title={<Title t={c.platforms.title} dark />} />
              <p className="text-[1.06rem] leading-relaxed text-fog lg:pb-2">{c.platforms.lead}</p>
            </div>
            <div className="mt-14 lg:mt-12">
              <PlatformNetwork
                panelLabel={`${name} functions`}
                items={platforms
                  .filter((p) => c.platforms!.functions[p.slug])
                  .map(({ slug, name: pn, officialName, category }) => ({ slug, name: pn, officialName, category, ecosystem: c.platforms!.functions[slug], href: `/platforms/${slug}` }))}
              />
            </div>
            <p className="mt-12 max-w-3xl text-[0.82rem] leading-relaxed text-mute">
              Platform names and marks are trademarks of their respective owners. They indicate the platforms Trafficomm has operational experience with and do not imply partnership, certification or endorsement.
            </p>
          </div>
        </Section>
      )}

      {c.caseStudy && <FlagshipCase index={null} eyebrow={c.caseStudy.eyebrow} context={c.caseStudy.context} compact />}

      {c.integration && (
        <Section tone="paper" labelledBy="integration-title">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:items-center lg:gap-16">
            <SectionHeading id="integration-title" eyebrow="Agency integration" title={<Title t={c.integration.title} />} lead={c.integration.lead} />
            <AgencyIntegration agencyOwns={c.integration.agencyOwns} trafficommSupports={c.integration.trafficommSupports} />
          </div>
        </Section>
      )}

      {c.engagement && (
        <Section tone="paper" labelledBy="engagement-title">
          <SectionHeading id="engagement-title" eyebrow="Engagement models" title={<Title t={c.engagement.title} />} lead={c.engagement.lead} />
          <div className="mt-14">
            <EngagementModels models={c.engagement.models} />
          </div>
        </Section>
      )}

      <Section tone="white" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <SectionHeading id="faq-title" eyebrow="FAQ" title={`${name} questions`} />
            <div className="mt-12 hidden lg:block">
              <p className="eyebrow mb-4 text-steel">Related</p>
              <LinkList items={c.related} />
            </div>
          </div>
          <div>
            <FAQList faqs={c.faqs} />
            <div className="mt-12 lg:hidden">
              <p className="eyebrow mb-4 text-steel">Related</p>
              <LinkList items={c.related} />
            </div>
          </div>
        </div>
      </Section>

      <Conversion index={null} eyebrow={c.cta.eyebrow} title={c.cta.title} lead={c.cta.lead} />
      <JsonLd data={serviceSchema({ name, description: c.seo.description, path: `/services/${c.slug}`, serviceType: "Ad operations outsourcing" })} />
    </>
  );
}

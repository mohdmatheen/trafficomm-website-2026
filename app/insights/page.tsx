import type { Metadata } from "next";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CTABand } from "@/components/sections/shared/CTABand";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Section } from "@/components/ui/Section";
import type { ArticleCategory } from "@/data/types";
import { getArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Performance Lab — Insights From Behind the Campaign",
  description:
    "Guides, decision frameworks and market insight on ad operations outsourcing, agency operating models and GCC digital advertising from the Trafficomm operations team.",
  path: "/insights",
});

const formats: ArticleCategory[] = ["Industry Insight", "Report", "Benchmark", "Guide", "Case Study", "Research"];

export default async function InsightsPage() {
  const articles = await getArticles();
  const [lead, ...rest] = articles;
  // Only formats that actually have content are listed; empty categories are never shown.
  const present = formats.map((f) => ({ f, n: articles.filter((a) => a.category === f).length })).filter((x) => x.n > 0);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Performance Lab", path: "/insights" }]}
        eyebrow="Performance Lab"
        title={
          <>
            Insights from <span className="block text-steel/70">behind the campaign.</span>
          </>
        }
        lead="Operational thinking from the team that sets up, checks, optimizes and reports campaigns — practical guides, decision frameworks and market insight."
        meta={
          <ul className="flex flex-wrap gap-2" aria-label="Content formats">
            {present.map(({ f, n }) => (
              <li key={f} className="rounded-full bg-white px-3.5 py-2 text-[0.84rem] text-graphite ring-1 ring-line">
                {f}
                <span className="ml-2 font-mono text-[0.7rem] text-steel">{n}</span>
              </li>
            ))}
          </ul>
        }
      />
      <Section tone="paper" className="!pt-0">
        {lead && <ArticleCard article={lead} featured className="lg:grid lg:grid-cols-[1.3fr_1fr] [&>div:first-child]:lg:aspect-auto" />}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>
      <CTABand title="Want to see how this applies to your team?" />
    </>
  );
}

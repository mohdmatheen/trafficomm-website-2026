import { ReportCover } from "@/components/cards/ReportCover";
import { ArrowLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getArticles } from "@/lib/content";

export async function InsightsPreview() {
  const articles = (await getArticles()).slice(0, 3);
  return (
    <Section tone="paper" labelledBy="lab-title" className="overflow-hidden">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="lab-title"
          index="13"
          eyebrow="Performance Lab"
          title={
            <>
              Insights From <span className="block text-steel/70">Behind the Campaign.</span>
            </>
          }
          lead="Research, guides and market outlooks from the team that sets up, checks and reports campaigns every day."
        />
        <ArrowLink href="/insights" className="shrink-0 md:pb-3">
          All reports
        </ArrowLink>
      </div>
      {/* Mobile: swipeable report shelf. Desktop: editorial three-up grid. */}
      <ul className="-mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0" aria-label="Performance Lab reports">
        {articles.map((a, i) => (
          <li key={a.slug} className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
            <ReportCover article={a} index={i} className="h-full" />
          </li>
        ))}
      </ul>
    </Section>
  );
}

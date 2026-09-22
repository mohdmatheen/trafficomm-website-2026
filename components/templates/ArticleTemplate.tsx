import { ArticleCard } from "@/components/cards/ArticleCard";
import { ArticleBody } from "@/components/article/ArticleBody";
import { JsonLd, articleSchema } from "@/components/seo/JsonLd";
import { CTABand } from "@/components/sections/shared/CTABand";
import { LinkList } from "@/components/sections/shared/LinkList";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ArticleMotif } from "@/components/visualizations/ArticleMotif";
import type { Article } from "@/data/types";
import { formatDate, readingMinutes } from "@/lib/content";

export function ArticleTemplate({ article, related }: { article: Article; related: Article[] }) {
  const toc = article.body.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2" && Boolean(b.id));
  return (
    <article>
      <header data-hero="dark" className="relative overflow-hidden bg-ink pt-28 pb-14 text-white sm:pt-36 sm:pb-20">
        <div className="absolute inset-0 opacity-40" aria-hidden="true">
          <ArticleMotif motif={article.hero.motif} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" aria-hidden="true" />
        <div className="container-site relative">
          <Breadcrumbs
            tone="dark"
            items={[
              { name: "Performance Lab", path: "/insights" },
              { name: article.category, path: `/insights/${article.slug}` },
            ]}
          />
          <div className="mt-10 flex flex-wrap gap-2">
            <Badge tone="dark">{article.category}</Badge>
            <Badge tone="dark">{article.hero.kicker}</Badge>
          </div>
          <h1 className="mt-8 max-w-4xl text-h1">{article.title}</h1>
          <p className="mt-7 max-w-2xl text-lead text-fog">{article.dek}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line-dark pt-6 text-[0.88rem] text-fog">
            <span className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-line-dark-strong">
                <LogoMark className="w-4" inverted />
              </span>
              <span>
                <span className="block text-white">{article.author.name}</span>
                <span className="block text-[0.78rem] text-mute">{article.author.role}</span>
              </span>
            </span>
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em]">
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </span>
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em]">{readingMinutes(article)} min read</span>
          </div>
        </div>
      </header>

      <div className="bg-white">
        <div className="container-site grid grid-cols-1 gap-12 py-16 sm:py-20 lg:grid-cols-[14rem_minmax(0,44rem)_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            {toc.length > 0 && (
              <nav aria-label="On this page" className="sticky top-28">
                <p className="eyebrow mb-4 text-steel">On this page</p>
                <ol className="space-y-2.5 border-l border-line">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-[0.86rem] leading-snug text-steel transition-colors hover:border-signal hover:text-ink">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>
          <div>
            <ArticleBody blocks={article.body} />
            <div className="mt-14 flex flex-wrap gap-2 border-t border-line pt-8">
              {article.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            {article.links.length > 0 && (
              <nav aria-label="Related services" className="mt-10">
                <p className="eyebrow mb-4 text-steel">Where this applies</p>
                <LinkList items={article.links} />
              </nav>
            )}
            <div className="mt-10 rounded-[var(--radius-panel)] bg-ink p-7 text-white sm:p-9">
              <p className="eyebrow text-signal">From the operations team</p>
              <p className="mt-4 text-h3">Want to see how this applies to your team?</p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-fog">Request an operations assessment — we&apos;ll review your workflow, volumes and platforms.</p>
              <ButtonLink href="/contact" className="mt-7">
                Request an Operations Assessment
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <Section tone="paper" labelledBy="related-title">
          <SectionHeading id="related-title" eyebrow="Keep reading" title="Related insights" />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Section>
      )}

      <CTABand title="Talk to the operators behind the Performance Lab." />
      <JsonLd data={articleSchema(article)} />
    </article>
  );
}

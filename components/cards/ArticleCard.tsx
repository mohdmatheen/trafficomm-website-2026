import Link from "next/link";
import type { Article } from "@/data/types";
import { formatDate, readingMinutes } from "@/lib/content";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ArticleMotif } from "@/components/visualizations/ArticleMotif";

export function ArticleCard({ article, className, featured = false }: { article: Article; className?: string; featured?: boolean }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className={cn("group flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.3)]", className)}
    >
      <div className={cn("relative overflow-hidden bg-ink", featured ? "aspect-[16/8]" : "aspect-[16/9]")}>
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <ArticleMotif motif={article.hero.motif} />
        </div>
        <span className="eyebrow absolute left-5 top-5 !text-[0.68rem] text-fog">{article.hero.kicker}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-steel">
          <span className="text-signal-ink">{article.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes(article)} min</span>
        </div>
        <h3 className={cn("mt-4 leading-tight tracking-[-0.025em] text-ink", featured ? "text-[1.9rem]" : "text-[1.3rem]")}>{article.title}</h3>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-steel">{article.dek}</p>
        <span className="mt-auto flex items-center gap-2 pt-6 text-[0.96rem] font-medium text-ink">
          Read <ArrowUpRight className="text-signal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import type { CaseStudy } from "@/data/types";
import { cn } from "@/lib/cn";
import { ArrowRight } from "@/components/ui/Icons";
import { CaseMotif } from "@/components/visualizations/CaseMotif";
import { EvidenceMark } from "@/components/visual/EvidenceMark";

/**
 * `detailed` adds challenge and Trafficomm role lines for the case-study index.
 *
 * `as` sets the card title's heading level: h3 under a section heading, h2 on
 * the case-study index where the cards are the page's top-level content and an
 * h3 there would skip a level.
 */
export function CaseStudyCard({ cs, className, tone = "light", detailed = false, as: Title = "h3" }: { cs: CaseStudy; className?: string; tone?: "light" | "dark"; detailed?: boolean; as?: "h2" | "h3" }) {
  const dark = tone === "dark";
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1",
        dark ? "bg-ink-2 ring-1 ring-line-dark hover:ring-line-dark-strong" : "bg-white ring-1 ring-line hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.3)]",
        className,
      )}
    >
      <div className={cn("relative h-40 overflow-hidden border-b", dark ? "border-line-dark bg-ink-3" : "border-line bg-paper")}>
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <CaseMotif slug={cs.slug} tone={tone} />
        </div>
        <span className={cn("absolute left-4 top-4 rounded px-1.5 py-0.5 font-mono text-[0.72rem] uppercase tracking-[0.12em]", dark ? "bg-ink-3/90 text-mute" : "bg-paper/90 text-steel")}>
          Case {cs.number}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className={cn("eyebrow !text-[0.7rem]", dark ? "text-mute" : "text-steel")}>
          {cs.category} · {cs.market}
        </p>
        {/* Evidence first: the documented figure, its shape, and what it measures. */}
        <p className="mt-5 whitespace-nowrap text-stat text-signal">{cs.headlineStat.value}</p>
        <EvidenceMark value={cs.headlineStat.value} tone={tone} className="mt-3" />
        <p className={cn("eyebrow mt-3 !text-[0.7rem]", dark ? "text-fog" : "text-graphite")}>{cs.headlineStat.label}</p>
        <Title className={cn("mt-6 text-[1.35rem] leading-tight tracking-[-0.025em]", dark ? "text-white" : "text-ink")}>{cs.cardTitle}</Title>
        <p className={cn("mt-2 text-[0.96rem] leading-relaxed", dark ? "text-fog" : "text-steel")}>{cs.client}</p>
        {detailed && cs.metrics.length > 1 && (
          <ul className={cn("mt-5 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em]", dark ? "text-fog" : "text-steel")}>
            {cs.metrics.slice(1, 3).map((m) => (
              <li key={m.label} className="flex items-center gap-2">
                <span className={dark ? "text-white" : "text-ink"}>{m.value}</span>
                {m.label}
              </li>
            ))}
          </ul>
        )}
        {detailed && (
          <dl className={cn("mt-5 divide-y border-y text-[0.88rem] leading-snug", dark ? "divide-line-dark border-line-dark" : "divide-line border-line")}>
            {[
              ["Challenge", cs.scan.challenge],
              ["Trafficomm role", cs.scan.role],
            ].map(([k, v]) => (
              <div key={k} className="py-2.5">
                <dt className={cn("font-mono text-[0.66rem] uppercase tracking-[0.12em]", dark ? "text-mute" : "text-steel")}>{k}</dt>
                <dd className={cn("mt-1.5", dark ? "text-fog" : "text-graphite")}>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <span className={cn("mt-auto flex items-center gap-2 pt-7 text-[0.96rem] font-medium", dark ? "text-white" : "text-ink")}>
          View case study <ArrowRight className="text-signal transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

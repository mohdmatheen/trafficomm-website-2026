import Link from "next/link";
import type { Service } from "@/data/types";
import { cn } from "@/lib/cn";
import { ArrowRight } from "@/components/ui/Icons";
import { ServiceIllustrationFluid, serviceCaption } from "@/components/visual/ServiceIllustration";

/**
 * Service card: the service's own illustration, then the name, then what it
 * covers. Visual first — six cards that used to differ only in their text now
 * differ at a glance.
 *
 * The summary line is gone: the illustration and its caption say the same
 * thing in less space, and the scope line above already carries the buyer-
 * facing terms. The function chips stay — they are documented capability
 * terms, not decoration.
 */
export function ServiceModuleCard({ service, className }: { service: Service; className?: string }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line transition-[box-shadow,transform] duration-500",
        "hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.3)] hover:ring-line-strong",
        className,
      )}
    >
      <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-700 group-hover:scale-x-100" aria-hidden="true" />
      {/* Fixed height: one card's scope line wraps to two, and without this the
          illustrations below would sit at different heights across the row. */}
      <div className="flex min-h-[3.25rem] items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-[0.72rem] uppercase leading-snug tracking-[0.12em] text-steel">{service.scopeLine.join(" · ")}</span>
      </div>
      <div className="flex justify-center bg-paper px-5 py-6">
        <ServiceIllustrationFluid slug={service.slug} className="max-w-[15rem]" />
      </div>
      <div className="flex flex-1 flex-col border-t border-line p-5 pt-5">
        <h3 className="text-[1.45rem] leading-tight tracking-[-0.025em] text-ink">{service.name}</h3>
        <p className="mt-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-steel">{serviceCaption[service.slug]}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${service.name} functions`}>
          {service.functions.map((f) => (
            <li key={f} className="rounded-md bg-paper px-2 py-1 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-graphite">
              {f}
            </li>
          ))}
        </ul>
        <span className="mt-auto flex items-center gap-2 pt-7 text-[0.96rem] font-medium text-ink">
          Explore {service.name} <ArrowRight className="text-signal transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

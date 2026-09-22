import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

/** Standard inner-page hero: breadcrumbs, eyebrow, H1, lead, actions and optional visual. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  actions,
  aside,
  tone = "paper",
  meta,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  tone?: "paper" | "dark";
  meta?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section data-hero={dark ? "dark" : undefined} className={cn("relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pb-28", dark ? "bg-ink text-white" : "bg-paper")}>
      <div className={cn("mask-radial pointer-events-none absolute inset-0 opacity-50", dark ? "grid-bg-dark" : "grid-bg")} aria-hidden="true" />
      <div className="container-site relative">
        <Breadcrumbs items={crumbs} tone={dark ? "dark" : "light"} />
        <div className={cn("mt-10 grid gap-12", aside ? "lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16" : undefined)}>
          <div>
            <Eyebrow tone={dark ? "dark" : "light"} className="mb-6">
              {eyebrow}
            </Eyebrow>
            <h1 className={cn("text-h1", dark ? "text-white" : "text-ink")}>{title}</h1>
            {lead && <p className={cn("mt-7 max-w-2xl text-lead", dark ? "text-fog" : "text-steel")}>{lead}</p>}
            {actions && <div className="mt-10 flex flex-col gap-3 sm:flex-row">{actions}</div>}
            {meta && <div className="mt-10">{meta}</div>}
          </div>
          {aside && <div>{aside}</div>}
        </div>
      </div>
    </section>
  );
}

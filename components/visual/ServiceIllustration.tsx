import { cn } from "@/lib/cn";

/**
 * The approved service illustrations, supplied as finished artwork and used
 * exactly as delivered — geometry, colours and the single red outcome mark are
 * the designer's, not ours. Files live in /public/illustrations/services,
 * named by route slug so the mapping cannot drift.
 *
 * Each one answers "what is this service?" in a second: an ad unit clearing
 * three QA gates, a funnel ending in a conversion, a bid winning one
 * impression. The deeper systems on the service pages answer "how does
 * Trafficomm run it?" — these never replace those.
 *
 * Drawn in ink on light surfaces. They must not be placed on a dark section:
 * the #141414 strokes disappear. Decorative by default, because every use sits
 * beside the service name.
 */

const RATIO = 144 / 80;

export const serviceIllustrations: Record<string, string> = {
  "ad-operations": "/illustrations/services/ad-operations.svg",
  "performance-marketing": "/illustrations/services/performance-marketing.svg",
  programmatic: "/illustrations/services/programmatic.svg",
  measurement: "/illustrations/services/measurement.svg",
  reporting: "/illustrations/services/reporting.svg",
  "creative-adtech": "/illustrations/services/creative-adtech.svg",
};

/** What each illustration shows, for the line that sits beside it. */
export const serviceCaption: Record<string, string> = {
  "ad-operations": "Build → QA → Live, paced to target",
  "performance-marketing": "Audience narrows to conversion",
  programmatic: "Bid, scan inventory, win the impression",
  measurement: "Browser and server signals, validated",
  reporting: "KPIs over a trend, one insight marked",
  "creative-adtech": "Formats built, tagged and trafficked",
};

export function ServiceIllustration({ slug, width, className }: { slug: string; width: number; className?: string }) {
  const src = serviceIllustrations[slug];
  if (!src) return null;
  return (
    // Plain <img>: a pre-sized static SVG gains nothing from the image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={Math.round(width / RATIO)}
      loading="lazy"
      decoding="async"
      className={cn("block h-auto", className)}
      style={{ width, aspectRatio: "144 / 80" }}
    />
  );
}

/** Fills its container instead of a fixed width — for the panel-sized uses. */
export function ServiceIllustrationFluid({ slug, className }: { slug: string; className?: string }) {
  const src = serviceIllustrations[slug];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" aria-hidden="true" width={144} height={80} decoding="async" className={cn("block h-auto w-full", className)} style={{ aspectRatio: "144 / 80" }} />
  );
}

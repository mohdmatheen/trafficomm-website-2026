import { cn } from "@/lib/cn";

/**
 * Solutions answer a different question from services: not "what is the
 * work?" but "where does Trafficomm sit in my organisation?".
 *
 * So these are organisational layer diagrams, not process diagrams — nobody
 * should confuse them with the service glyphs. Trafficomm is always the middle
 * layer, and on white-label it sits *behind* the agency, which is the whole
 * proposition of that page.
 *
 * Labels come from the real solution routes in data/solutions.ts.
 */

type Layer = { label: string; kind?: "client" | "trafficomm" | "platform" };

const LAYERS: Record<string, { layers: Layer[]; behind?: boolean; caption: string }> = {
  "media-agencies": {
    layers: [
      { label: "Agency", kind: "client" },
      { label: "Trafficomm operations", kind: "trafficomm" },
      { label: "Platforms", kind: "platform" },
    ],
    caption: "Agency → Trafficomm operations → platforms",
  },
  "performance-agencies": {
    layers: [
      { label: "Strategy", kind: "client" },
      { label: "Trafficomm execution", kind: "trafficomm" },
      { label: "Client KPI", kind: "platform" },
    ],
    caption: "Strategy → Trafficomm execution → client KPI",
  },
  brands: {
    layers: [
      { label: "Brand team", kind: "client" },
      { label: "Trafficomm", kind: "trafficomm" },
      { label: "Ad platforms", kind: "platform" },
    ],
    caption: "Brand team → Trafficomm → ad platforms",
  },
  "publishers-adtech": {
    layers: [
      { label: "Inventory", kind: "client" },
      { label: "Trafficomm operations", kind: "trafficomm" },
      { label: "Ad server", kind: "platform" },
    ],
    caption: "Inventory → Trafficomm operations → ad server",
  },
  "white-label-ad-operations": {
    layers: [
      { label: "Your client", kind: "client" },
      { label: "Your agency", kind: "client" },
      { label: "Trafficomm", kind: "trafficomm" },
    ],
    behind: true,
    caption: "Your brand in front, Trafficomm behind it",
  },
};

export const solutionCaption = (slug: string) => LAYERS[slug]?.caption ?? "";

export function SolutionGlyph({ slug, full = false, dark = false, className }: { slug: string; full?: boolean; dark?: boolean; className?: string }) {
  const spec = LAYERS[slug];
  if (!spec) return null;
  const band = (l: Layer, i: number, last: boolean) => {
    const tf = l.kind === "trafficomm";
    // The white-label Trafficomm layer is drawn behind the agency, inset and dashed.
    const hidden = spec.behind && tf;
    return (
      <span
        key={l.label}
        className={cn(
          "relative flex items-center justify-center rounded-[3px] ring-1 ring-inset",
          full ? "h-8 px-3" : "h-3",
          hidden
            ? cn("z-0 border border-dashed", full ? "mx-8 -mt-7 pt-5" : "mx-4 -mt-3 pt-2", dark ? "border-signal/60 bg-ink-3 ring-0" : "border-signal/60 bg-white ring-0")
            : tf
              ? dark
                ? "bg-white text-ink ring-white"
                : "bg-ink text-white ring-ink"
              : dark
                ? "bg-white/[0.06] ring-line-dark"
                : "bg-paper ring-line",
          spec.behind && !tf && "relative z-10 shadow-[0_2px_10px_-4px_rgb(0_0_0/0.25)]",
        )}
        style={spec.behind && tf ? { order: 3 } : undefined}
      >
        {full && (
          <span className={cn("font-mono text-[0.6rem] uppercase tracking-[0.1em] sm:text-[0.64rem]", hidden && "self-end", tf && !hidden ? (dark ? "text-ink" : "text-white") : hidden ? "text-signal" : dark ? "text-fog" : "text-steel")}>
            {l.label}
          </span>
        )}
        {l.kind === "platform" && !full && <span className="block h-[3px] w-8 rounded-full bg-signal/70" />}
        {!last && !spec.behind && <span className={cn("absolute -bottom-[7px] left-1/2 h-[6px] w-px -translate-x-1/2", tf ? "bg-signal" : dark ? "bg-line-dark-strong" : "bg-line-strong")} aria-hidden="true" />}
      </span>
    );
  };
  return (
    <span className={cn("flex w-full flex-col", full ? "gap-3" : "gap-[7px]", className)} aria-hidden="true">
      {spec.layers.map((l, i) => band(l, i, i === spec.layers.length - 1))}
    </span>
  );
}

import { cn } from "@/lib/cn";

/**
 * Solutions answer a different question from services: not "what is the
 * work?" but "where does Trafficomm sit in my organisation?".
 *
 * The first version of these drew every solution as the same three stacked
 * bands, so five different operating models read as one shape. Each now has a
 * geometry that belongs to it alone, legible at menu size before the label is:
 *
 *   media agencies       one agency, one operations layer, many deliveries
 *   performance agencies a closed optimisation loop, not a top-to-bottom stack
 *   brands               Trafficomm joined alongside the team, extending its row
 *   publishers & adtech  an inventory grid served out through the ad server
 *   white-label          the agency in front, Trafficomm dashed behind it
 *
 * Labels come from the real solution routes in data/solutions.ts. The glyph is
 * always decorative; the link text is the accessible name.
 */

type Spec = {
  kind: "fanout" | "loop" | "extend" | "inventory" | "behind";
  caption: string;
  /** Row labels, top to bottom, for the full-size version. */
  rows: [string, string, string];
};

const SPECS: Record<string, Spec> = {
  "media-agencies": {
    kind: "fanout",
    caption: "Agency → Trafficomm operations → platforms",
    rows: ["Agency", "Trafficomm operations", "Platforms"],
  },
  "performance-agencies": {
    kind: "loop",
    caption: "Strategy → Trafficomm execution → client KPI → back again",
    rows: ["Strategy & KPIs", "Trafficomm execution", "Optimization loop"],
  },
  brands: {
    kind: "extend",
    caption: "Brand team, extended by Trafficomm → ad platforms",
    rows: ["Brand team", "Trafficomm", "Ad platforms"],
  },
  "publishers-adtech": {
    kind: "inventory",
    caption: "Inventory → Trafficomm operations → ad server",
    rows: ["Inventory", "Trafficomm operations", "Ad server"],
  },
  "white-label-ad-operations": {
    kind: "behind",
    caption: "Your brand in front, Trafficomm behind it",
    rows: ["Your client", "Your agency", "Trafficomm"],
  },
};

export const solutionCaption = (slug: string) => SPECS[slug]?.caption ?? "";

type Tone = { line: string; soft: string; text: string; solid: string; solidText: string };

const tone = (dark: boolean): Tone =>
  dark
    ? { line: "bg-line-dark-strong", soft: "bg-white/[0.06] ring-line-dark", text: "text-fog", solid: "bg-white ring-white", solidText: "text-ink" }
    : { line: "bg-line-strong", soft: "bg-paper ring-line", text: "text-steel", solid: "bg-ink ring-ink", solidText: "text-white" };

/** One horizontal band. `strong` marks the Trafficomm layer. */
function band(t: Tone, label: string, full: boolean, strong: boolean, extra?: string) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-[3px] ring-1 ring-inset",
        full ? "h-8 px-3" : "h-3",
        strong ? t.solid : t.soft,
        extra,
      )}
    >
      {full && <span className={cn("font-mono text-[0.6rem] uppercase tracking-[0.1em] sm:text-[0.64rem]", strong ? t.solidText : t.text)}>{label}</span>}
    </span>
  );
}

/** The short vertical tick that joins two bands. */
function link(t: Tone, full: boolean, red = false) {
  return <span className={cn("mx-auto block w-px", full ? "h-3" : "h-[6px]", red ? "bg-signal" : t.line)} aria-hidden="true" />;
}

export function SolutionGlyph({ slug, full = false, dark = false, className }: { slug: string; full?: boolean; dark?: boolean; className?: string }) {
  const spec = SPECS[slug];
  if (!spec) return null;
  const t = tone(dark);
  const [top, mid, bottom] = spec.rows;

  const body = () => {
    switch (spec.kind) {
      // One agency feeds one operations layer, which delivers into many places.
      case "fanout":
        return (
          <>
            {band(t, top, full, false, full ? "mx-auto w-3/5" : "mx-auto w-3/5")}
            {link(t, full)}
            {band(t, mid, full, true)}
            {link(t, full, true)}
            <span className={cn("flex items-end justify-between", full ? "h-8 gap-1.5" : "h-3 gap-1")}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={cn("flex-1 rounded-[2px] bg-signal/70", full ? "h-5" : "h-2")} style={{ height: full ? `${14 + (i % 2) * 10}px` : `${6 + (i % 2) * 4}px` }} />
              ))}
            </span>
            {full && <span className={cn("mt-1.5 text-center font-mono text-[0.6rem] uppercase tracking-[0.1em]", t.text)}>{bottom}</span>}
          </>
        );

      // A cycle, not a stack: the result feeds back into the target it was set against.
      case "loop":
        return (
          <span className={cn("relative block", full ? "pr-6" : "pr-3")}>
            {band(t, top, full, false)}
            {link(t, full)}
            {band(t, mid, full, true)}
            {link(t, full, true)}
            {band(t, bottom, full, false)}
            {/* The return path, drawn outside the stack so it reads as a cycle at any size. */}
            <span
              className={cn(
                "absolute right-0 rounded-r-[10px] border-y-2 border-r-2 border-signal",
                full ? "inset-y-4 w-5" : "inset-y-[6px] w-2.5",
              )}
              aria-hidden="true"
            />
          </span>
        );

      // Trafficomm joins the brand team's own row rather than sitting under it.
      case "extend":
        return (
          <>
            <span className={cn("flex items-stretch", full ? "h-8 gap-1" : "h-3 gap-[3px]")}>
              <span className={cn("flex flex-[1.1] items-center justify-center rounded-[3px] ring-1 ring-inset", t.soft)}>
                {full && <span className={cn("font-mono text-[0.6rem] uppercase tracking-[0.1em]", t.text)}>{top}</span>}
              </span>
              <span className={cn("self-center", full ? "h-px w-2 bg-signal" : "h-px w-1.5 bg-signal")} aria-hidden="true" />
              <span className={cn("flex flex-1 items-center justify-center rounded-[3px] border border-dashed border-signal/70", dark ? "bg-signal/10" : "bg-signal-soft")}>
                {full && <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-signal-ink">{mid}</span>}
              </span>
            </span>
            {link(t, full)}
            {band(t, bottom, full, false)}
          </>
        );

      // Many units of inventory, consolidated and served out through one system.
      case "inventory":
        return (
          <>
            <span className={cn("grid grid-cols-4", full ? "gap-1" : "gap-[3px]")}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <span key={i} className={cn("rounded-[2px] ring-1 ring-inset", full ? "h-3.5" : "h-[5px]", t.soft)} />
              ))}
            </span>
            {full && <span className={cn("mt-1.5 block text-center font-mono text-[0.6rem] uppercase tracking-[0.1em]", t.text)}>{top}</span>}
            {link(t, full)}
            {band(t, mid, full, true)}
            {link(t, full, true)}
            {band(t, bottom, full, false, "border-l-2 border-signal")}
          </>
        );

      // The agency stays in front; Trafficomm is the layer nobody sees.
      case "behind":
        return (
          <>
            {band(t, top, full, false, "relative z-10 w-4/5")}
            {link(t, full)}
            <span className={cn("relative block", full ? "pb-7" : "pb-2.5")}>
              {/* Trafficomm sits behind: dashed, inset, and only its lower edge shows. */}
              <span
                className={cn(
                  "absolute inset-x-4 flex items-end justify-center rounded-[3px] border border-dashed border-signal/70",
                  full ? "top-7 h-8 pb-1" : "top-[9px] h-3.5",
                  dark ? "bg-ink-3" : "bg-white",
                )}
              >
                {full && <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-signal">{bottom}</span>}
              </span>
              {band(t, mid, full, false, "relative z-10 shadow-[0_2px_10px_-4px_rgb(0_0_0/0.35)]")}
            </span>
          </>
        );
    }
  };

  return (
    <span className={cn("block w-full", className)} aria-hidden="true">
      {body()}
    </span>
  );
}

import { cn } from "@/lib/cn";

/**
 * A miniature of each service's actual operating model.
 *
 * One vocabulary, six shapes: the rail that Ad Operations runs on, the
 * manifold Performance reads, the lanes Programmatic delivers through, the
 * signal path Measurement validates, the interface Reporting produces and the
 * formats Creative ships. They are deliberately *not* six icons — a visitor
 * should be able to tell the services apart by shape alone.
 *
 * `mini` is for navigation and cards; `full` adds the labels and is used where
 * the glyph has to carry the explanation on its own. Every glyph is decorative:
 * the service name and descriptor always sit beside it as real text.
 *
 * Nothing here reproduces a service page's own visual system — these are
 * previews, and they stay small on purpose.
 */

type Props = { slug: string; full?: boolean; dark?: boolean; className?: string };

const CELL = "rounded-[3px] ring-1 ring-inset";

/** Mono micro-label. Rendered only in the full size. */
const L = ({ children, dark, className }: { children: React.ReactNode; dark?: boolean; className?: string }) => (
  <span className={cn("block font-mono text-[0.58rem] uppercase leading-tight tracking-[0.1em] sm:text-[0.62rem]", dark ? "text-fog" : "text-steel", className)}>{children}</span>
);

function AdOps({ full, dark }: { full: boolean; dark: boolean }) {
  const steps = ["Brief", "Build", "QA", "Live"];
  return (
    <div className="w-full">
      <div className="relative grid grid-cols-4 items-start gap-2">
        <span className={cn("absolute left-[12%] right-[12%] top-[5px] h-px", dark ? "bg-line-dark-strong" : "bg-line-strong")} aria-hidden="true" />
        <span className="absolute left-[12%] top-[5px] h-[2px] w-[76%] origin-left bg-signal" aria-hidden="true" />
        {steps.map((s, i) => (
          <span key={s} className="relative flex flex-col items-center gap-2">
            <span className={cn("size-[11px] rounded-full", i === 3 ? "bg-signal" : dark ? "bg-white" : "bg-ink")} />
            {full && <L dark={dark}>{s}</L>}
          </span>
        ))}
      </div>
      {full && (
        <p className={cn("mt-4 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.1em]", dark ? "text-white" : "text-ink")}>
          <span className="size-1.5 rounded-full bg-signal" />
          Campaign live on your approval
        </p>
      )}
    </div>
  );
}

function Manifold({ full, dark }: { full: boolean; dark: boolean }) {
  const signals = ["Audience", "Creative", "Budget", "Structure"];
  const x = [12.5, 37.5, 62.5, 87.5];
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-1.5">
        {signals.map((s) => (
          <span key={s} className={cn(CELL, "flex items-center justify-center px-1", full ? "h-6" : "h-2.5", dark ? "bg-white/[0.06] ring-line-dark" : "bg-paper ring-line")}>
            {full && <L dark={dark} className="truncate">{s}</L>}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 100 22" preserveAspectRatio="none" className={cn("w-full", full ? "h-5" : "h-3")} aria-hidden="true">
        {x.map((v) => (
          <line key={v} x1={v} y1="0" x2={v} y2="12" className="stroke-signal opacity-60" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1={x[0]} y1="12" x2={x[3]} y2="12" className="stroke-signal opacity-45" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <line x1="50" y1="12" x2="50" y2="22" className="stroke-signal" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className={cn("flex items-center justify-center rounded-[3px]", full ? "h-7" : "h-3", dark ? "bg-white text-ink" : "bg-ink text-white")}>
        {full ? <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em]">One KPI · CPA</span> : <span className="block h-[2px] w-8 bg-signal" />}
      </span>
    </div>
  );
}

function Lanes({ full, dark }: { full: boolean; dark: boolean }) {
  const nodes = [
    { label: "Plan", lane: 0 },
    { label: "DV360", lane: 1 },
    { label: "CM360", lane: 1 },
    { label: "Supply", lane: 2 },
  ];
  const laneNames = ["Agency", "Trafficomm", "Supply"];
  const cx = (i: number) => ((i + 0.5) / 4) * 100;
  const cy = (l: number) => (l + 0.5) * (100 / 3);
  return (
    <div className={cn("grid w-full gap-x-2", full ? "grid-cols-[4.5rem_1fr]" : "grid-cols-1")}>
      {full && (
        <div className="grid grid-rows-3">
          {laneNames.map((n) => (
            <span key={n} className="flex items-center">
              <L dark={dark}>{n}</L>
            </span>
          ))}
        </div>
      )}
      <div className={cn("relative grid grid-cols-4 grid-rows-3", full ? "h-[5.5rem]" : "h-9")}>
        <div className="pointer-events-none absolute inset-0 grid grid-rows-3" aria-hidden="true">
          {laneNames.map((n, i) => (
            <span key={n} className={cn("rounded-[3px]", i === 1 && (dark ? "bg-white/[0.06]" : "bg-paper ring-1 ring-inset ring-line"))} />
          ))}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
          {nodes.slice(0, -1).map((n, i) => {
            const mid = (cx(i) + cx(i + 1)) / 2;
            return (
              <path
                key={n.label}
                d={`M ${cx(i)} ${cy(n.lane)} L ${mid} ${cy(n.lane)} L ${mid} ${cy(nodes[i + 1].lane)} L ${cx(i + 1)} ${cy(nodes[i + 1].lane)}`}
                fill="none"
                className="stroke-signal opacity-80"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {nodes.map((n, i) => (
          <span key={n.label} className="relative z-10 flex items-center justify-center p-0.5" style={{ gridColumn: i + 1, gridRow: n.lane + 1 }}>
            <span className={cn(CELL, "flex w-full items-center justify-center px-1", full ? "h-6" : "h-3.5", dark ? "bg-ink-2 ring-line-dark-strong" : "bg-white ring-line-strong")}>
              {full && <L dark={dark} className="truncate">{n.label}</L>}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SignalPath({ full, dark }: { full: boolean; dark: boolean }) {
  const node = (label: string, key?: string) => (
    <span key={key ?? label} className={cn(CELL, "flex items-center justify-center px-1", full ? "h-6" : "h-3.5", dark ? "bg-white/[0.06] ring-line-dark-strong" : "bg-paper ring-line-strong")}>
      {full && <L dark={dark} className="truncate">{label}</L>}
    </span>
  );
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1">
      {node("Event")}
      <span className={cn("h-px w-3", dark ? "bg-line-dark-strong" : "bg-ink/30")} aria-hidden="true" />
      {node("GTM")}
      <span className="h-px w-3 bg-signal" aria-hidden="true" />
      <span className="grid gap-1">
        {node("GA4")}
        {node("Server")}
      </span>
      <span className="h-px w-3 bg-signal" aria-hidden="true" />
      <span className={cn(CELL, "flex items-center justify-center px-1 ring-signal", full ? "h-6" : "h-3", dark ? "bg-signal-soft/10" : "bg-signal-soft/10")}>
        {full && <L dark={dark} className="truncate !text-ink dark:!text-white">Validate</L>}
      </span>
    </div>
  );
}

function Dashboard({ full, dark }: { full: boolean; dark: boolean }) {
  const kpis = [
    { k: "Spend", v: "$48.2K" },
    { k: "CPA", v: "$38.90" },
    { k: "ROAS", v: "3.2x" },
  ];
  const bars = [62, 44, 28];
  return (
    <div className={cn("w-full overflow-hidden rounded-[4px] ring-1", dark ? "bg-ink-2 ring-line-dark" : "bg-white ring-line")}>
      <div className={cn("grid grid-cols-3 gap-px", dark ? "bg-line-dark" : "bg-line")}>
        {kpis.map((kpi) => (
          <span key={kpi.k} className={cn("px-2 py-1.5", dark ? "bg-ink-2" : "bg-white")}>
            {full ? (
              <>
                <L dark={dark}>{kpi.k}</L>
                <span className={cn("mt-0.5 block font-mono text-[0.78rem] tabular", dark ? "text-white" : "text-ink")}>{kpi.v}</span>
              </>
            ) : (
              <>
                <span className={cn("block h-[3px] w-6 rounded-full", dark ? "bg-white/25" : "bg-ink/20")} />
                <span className={cn("mt-1 block h-[5px] w-8 rounded-full", dark ? "bg-white/70" : "bg-ink/70")} />
              </>
            )}
          </span>
        ))}
      </div>
      <div className={cn("flex items-end gap-2 border-t px-2 py-2", dark ? "border-line-dark" : "border-line")}>
        <svg viewBox="0 0 100 26" preserveAspectRatio="none" className={cn("w-1/2", full ? "h-8" : "h-4")} aria-hidden="true">
          <path d="M2 20 L18 16 L34 18 L50 11 L66 13 L82 7 L98 4" fill="none" className="stroke-signal" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <line x1="2" y1="14" x2="98" y2="14" className={dark ? "stroke-white/25" : "stroke-ink/20"} strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="flex w-1/2 flex-col gap-1">
          {bars.map((b, i) => (
            <span key={b} className={cn("block h-[5px] rounded-full", i === 0 ? "bg-signal" : dark ? "bg-white/25" : "bg-ink/25")} style={{ width: `${b}%` }} />
          ))}
        </span>
      </div>
      {full && (
        <p className={cn("flex items-center gap-2 border-t px-2 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.1em]", dark ? "border-line-dark text-fog" : "border-line text-steel")}>
          Platforms <span className="text-signal">→</span> Data <span className="text-signal">→</span> Insight
        </p>
      )}
    </div>
  );
}

function Formats({ full, dark }: { full: boolean; dark: boolean }) {
  const specs = [
    { size: "300 × 250", w: 300, h: 250 },
    { size: "728 × 90", w: 728, h: 90 },
    { size: "9:16", w: 540, h: 960 },
  ];
  const max = full ? 74 : 22;
  return (
    <div className={cn("flex w-full items-end", full ? "gap-3" : "gap-1.5")}>
      {specs.map((s) => {
        const k = max / Math.max(s.w, s.h);
        return (
          <span key={s.size} className="flex flex-col items-center gap-1.5">
            <span className={cn("flex flex-col justify-between p-[2px]", dark ? "bg-white/[0.06] ring-1 ring-inset ring-line-dark" : "bg-paper ring-1 ring-inset ring-line")} style={{ width: s.w * k, height: s.h * k }}>
              <span className={cn("block flex-1", dark ? "bg-white/15" : "bg-ink/12")} />
              <span className="mt-[2px] block h-[3px] w-1/2 bg-signal" />
            </span>
            {full && <L dark={dark}>{s.size}</L>}
          </span>
        );
      })}
      <span className={cn("mb-1 h-px flex-1 bg-signal/70", !full && "min-w-[5px]")} aria-hidden="true" />
      <span className={cn(CELL, "mb-0.5 flex items-center", full ? "px-2 py-1" : "p-[3px]", dark ? "bg-ink-2 ring-line-dark" : "bg-white ring-line")}>
        {full ? <L dark={dark}>Ad server</L> : <span className={cn("block size-1.5 rounded-[2px]", dark ? "bg-white/50" : "bg-ink/50")} />}
      </span>
    </div>
  );
}

const GLYPHS: Record<string, (p: { full: boolean; dark: boolean }) => React.ReactElement> = {
  "ad-operations": AdOps,
  "performance-marketing": Manifold,
  programmatic: Lanes,
  measurement: SignalPath,
  reporting: Dashboard,
  "creative-adtech": Formats,
};

/** What each glyph is showing, for the text that sits beside it. */
export const glyphCaption: Record<string, string> = {
  "ad-operations": "Brief → Build → QA → Live",
  "performance-marketing": "Signals → one KPI",
  programmatic: "Plan → DV360 → CM360 → Supply",
  measurement: "Event → GTM → GA4 / server → Validate",
  reporting: "Platforms → Data → Insight",
  "creative-adtech": "Formats → QA → Trafficked",
};

export function ServiceGlyph({ slug, full = false, dark = false, className }: Props) {
  const G = GLYPHS[slug];
  if (!G) return null;
  return (
    <span className={cn("flex items-center", full ? "block" : "h-10 w-[4.5rem] overflow-hidden", className)} aria-hidden="true">
      <G full={full} dark={dark} />
    </span>
  );
}

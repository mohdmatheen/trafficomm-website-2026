import world from "@/data/world-dots.json";
import { markets } from "@/data/site";
import { MarketsMap, type MapMarket } from "./MarketsMap";

/** Grid units → SVG units. */
const S = 6;

type WorldData = {
  cols: number;
  rows: number;
  dots: [number, number][];
  byCountry: Record<string, number[]>;
  centroids: Record<string, [number, number]>;
};

const data = world as unknown as WorldData;

// Manual label anchors (grid units) keep the tightly clustered Gulf markets legible.
const LABELS: Record<string, { x: number; y: number; anchor: "start" | "middle" | "end" }> = {
  lb: { x: 101, y: 18, anchor: "end" },
  kw: { x: 112.5, y: 15, anchor: "middle" },
  sa: { x: 104, y: 35, anchor: "end" },
  qa: { x: 119.5, y: 17.5, anchor: "start" },
  ae: { x: 123, y: 21.5, anchor: "start" },
  au: { x: 150, y: 44, anchor: "end" },
};

/**
 * Server component: builds the base dot map once as a single path string
 * (≈3,800 dots, one DOM node, streamed as children) and hands market geometry to the client overlay.
 */
export function WorldMap() {
  // Zero-length segments + round caps draw each dot in ~10 bytes of path data.
  const dotPath = (c: number, row: number) => `M${c * S + S / 2} ${row * S + S / 2}h0`;
  const base = data.dots.map(([c, row]) => dotPath(c, row)).join("");

  const toXY = ([c, row]: [number, number]) => ({ x: c * S + S / 2, y: row * S + S / 2 });

  const mapMarkets: MapMarket[] = markets.map((m) => {
    const idx = data.byCountry[m.code] ?? [];
    const l = LABELS[m.code];
    return {
      code: m.code,
      name: m.name,
      center: toXY(data.centroids[m.code]),
      path: idx.map((i) => dotPath(...data.dots[i])).join(""),
      label: { x: l.x * S, y: l.y * S, anchor: l.anchor },
    };
  });

  const hub = toXY(data.centroids.in);

  return (
    <MarketsMap width={data.cols * S} height={data.rows * S} markets={mapMarkets} hub={hub}>
      <path d={base} fill="none" stroke="#0c0c0d" strokeOpacity="0.27" strokeWidth="3" strokeLinecap="round" />
    </MarketsMap>
  );
}

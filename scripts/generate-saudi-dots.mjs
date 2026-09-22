// Generates a fine dot grid of Saudi Arabia (data/saudi-dots.json) for the
// Performance Lab report cover. Run once: `node scripts/generate-saudi-dots.mjs`.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains, geoBounds } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/countries-50m.json"), "utf8"));
const sa = feature(topo, topo.objects.countries).features.find((f) => f.id === "682");
const [[lon0, lat0], [lon1, lat1]] = geoBounds(sa);
const STEP = 0.42;
const dots = [];
for (let lat = lat1; lat >= lat0; lat -= STEP) {
  for (let lon = lon0; lon <= lon1; lon += STEP) {
    if (geoContains(sa, [lon, lat])) dots.push([+((lon - lon0) / STEP).toFixed(1), +((lat1 - lat) / STEP).toFixed(1)]);
  }
}
const cols = Math.ceil((lon1 - lon0) / STEP) + 1;
const rows = Math.ceil((lat1 - lat0) / STEP) + 1;
writeFileSync(new URL("../data/saudi-dots.json", import.meta.url), JSON.stringify({ cols, rows, dots }));
console.log(`saudi dots: ${dots.length} (${cols}x${rows})`);

// Generates a compact dot-grid world map (data/world-dots.json) from Natural Earth
// 110m land/country shapes. Run once: `node scripts/generate-world-dots.mjs`.
// Output is committed so the site ships no geo libraries at runtime.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains, geoCentroid } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/countries-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);
const countries = feature(topo, topo.objects.countries);

const STEP = 2;
const LON_MIN = -180;
const LAT_MAX = 80;
const LAT_MIN = -58;
const cols = Math.round(360 / STEP);
const rows = Math.round((LAT_MAX - LAT_MIN) / STEP);

// Markets supported + the centralized operations hub (India), by ISO 3166-1 numeric id.
const TRACKED = { "682": "sa", "784": "ae", "634": "qa", "414": "kw", "422": "lb", "036": "au", "356": "in" };

const dots = [];
const byCountry = Object.fromEntries(Object.values(TRACKED).map((k) => [k, []]));
const tracked = countries.features.filter((f) => TRACKED[f.id]);

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const lon = LON_MIN + c * STEP + STEP / 2;
    const lat = LAT_MAX - r * STEP - STEP / 2;
    if (!geoContains(land, [lon, lat])) continue;
    dots.push([c, r]);
    for (const f of tracked) {
      if (geoContains(f, [lon, lat])) byCountry[TRACKED[f.id]].push(dots.length - 1);
    }
  }
}

const centroids = {};
for (const f of tracked) {
  const [lon, lat] = geoCentroid(f);
  centroids[TRACKED[f.id]] = [
    +((lon - LON_MIN) / STEP).toFixed(2),
    +((LAT_MAX - lat) / STEP).toFixed(2),
  ];
}

writeFileSync(
  new URL("../data/world-dots.json", import.meta.url),
  JSON.stringify({ cols, rows, dots, byCountry, centroids }),
);
console.log(`dots: ${dots.length}`, Object.fromEntries(Object.entries(byCountry).map(([k, v]) => [k, v.length])));

// Static base layer: the full dot field as one cacheable SVG, so it never ships inside page HTML.
const S = 6;
const d = dots.map(([c, r]) => `M${c * S + S / 2} ${r * S + S / 2}h0`).join("");
mkdirSync(new URL("../public/maps/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../public/maps/world-dots.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols * S} ${rows * S}"><path d="${d}" fill="none" stroke="#0c0c0d" stroke-opacity="0.27" stroke-width="3" stroke-linecap="round"/></svg>`,
);

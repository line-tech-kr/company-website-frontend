/**
 * Regenerate src/components/company/world-map-paths.ts from the Natural Earth
 * 110m admin_0 countries GeoJSON. Path data is bundled into the source tree so
 * the company page renders without a network fetch.
 *
 * Run: pnpm tsx scripts/build-world-map-paths.ts
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SOURCE =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/cultural/ne_110m_admin_0_countries.json";

type Coord = [number, number];
type Ring = Coord[];
type Geometry =
  | { type: "Polygon"; coordinates: Ring[] }
  | { type: "MultiPolygon"; coordinates: Ring[][] };
type Feature = {
  properties: {
    ISO_A2?: string;
    ISO_A2_EH?: string;
    WB_A2?: string;
    ADM0_A3?: string;
  };
  geometry: Geometry;
};

/**
 * Natural Earth 110m has a long-standing data quirk: a few sovereign states
 * carry "-99" in every ISO_A2-shaped field. Hardcode the ones that have a
 * real ISO 3166-1 assignment so they aren't dropped from the map.
 */
const ADM0_A3_FALLBACK: Record<string, string> = { NOR: "NO" };
type FeatureCollection = { features: Feature[] };

const VIEW_W = 1000;
const VIEW_H = 500;
function project(lon: number, lat: number): [string, string] {
  const x = ((lon + 180) * (VIEW_W / 360)).toFixed(2);
  const y = ((90 - lat) * (VIEW_H / 180)).toFixed(2);
  return [x, y];
}
function ringToD(ring: Ring): string {
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = project(ring[i][0], ring[i][1]);
    d += (i === 0 ? "M" : "L") + x + " " + y;
  }
  return d + "Z";
}

async function main() {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const geo: FeatureCollection = await res.json();

  function pickIso(p: Feature["properties"]): string | undefined {
    for (const candidate of [p.ISO_A2, p.ISO_A2_EH, p.WB_A2]) {
      if (candidate && candidate !== "-99") return candidate;
    }
    if (p.ADM0_A3) return ADM0_A3_FALLBACK[p.ADM0_A3];
    return undefined;
  }

  const out: Record<string, string> = {};
  for (const f of geo.features) {
    const iso = pickIso(f.properties);
    if (!iso) continue;
    const g = f.geometry;
    let d = "";
    if (g.type === "Polygon") d = ringToD(g.coordinates[0]);
    else if (g.type === "MultiPolygon")
      d = g.coordinates.map((p) => ringToD(p[0])).join("");
    out[iso] = (out[iso] ?? "") + d;
  }

  const sorted = Object.keys(out)
    .sort()
    .reduce<Record<string, string>>((a, k) => ((a[k] = out[k]), a), {});

  const header =
    "/* Auto-generated from Natural Earth 110m admin_0 countries (public domain).\n" +
    ` * Equirectangular projection into ${VIEW_W}×${VIEW_H} viewBox (lon/lat → x/y).\n` +
    ` * Source: ${SOURCE}\n` +
    " * Regenerate with: pnpm tsx scripts/build-world-map-paths.ts\n" +
    " */\n";
  const body = `export const COUNTRY_PATHS: Record<string, string> = ${JSON.stringify(sorted)};\n`;

  const target = resolve("src/components/company/world-map-paths.ts");
  writeFileSync(target, header + body);
  console.log(`wrote ${target} (${Object.keys(sorted).length} countries)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

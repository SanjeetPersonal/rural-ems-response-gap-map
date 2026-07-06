import { writeFileSync, existsSync, mkdirSync } from "fs";
import { HIFLD_EMS_STATIONS_URL, HIFLD_FIRE_STATIONS_URL } from "./sources.ts";
import { fetchJson } from "./lib/http.ts";

interface ArcgisFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] } | null;
  properties: Record<string, unknown>;
}

interface ArcgisFeatureCollection {
  type: "FeatureCollection";
  properties?: { exceededTransferLimit?: boolean };
  features: ArcgisFeature[];
}

const OUT_FIELDS = "NAME,ADDRESS,CITY,STATE,ZIP,COUNTY,NAICSDESCR";

async function fetchAllPages(
  layerUrl: string,
  stationType: "EMS" | "FIRE"
): Promise<ArcgisFeature[]> {
  const metadata = await fetchJson<{ maxRecordCount?: number }>(
    `${layerUrl}?f=json`
  );
  const pageSize = metadata.maxRecordCount ?? 1000;

  const all: ArcgisFeature[] = [];
  let offset = 0;

  for (;;) {
    const url =
      `${layerUrl}/query?where=1%3D1&outFields=${OUT_FIELDS}&outSR=4326` +
      `&f=geojson&resultOffset=${offset}&resultRecordCount=${pageSize}`;
    const page = await fetchJson<ArcgisFeatureCollection>(url);

    for (const f of page.features) {
      all.push({ ...f, properties: { ...f.properties, STATION_TYPE: stationType } });
    }

    console.log(
      `  [${stationType}] offset=${offset} -> +${page.features.length} (total ${all.length})`
    );

    if (page.features.length < pageSize) break;
    offset += pageSize;
  }

  return all;
}

async function main() {
  const outDir = new URL("./raw", import.meta.url);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  console.log("Fetching HIFLD EMS stations...");
  const ems = await fetchAllPages(HIFLD_EMS_STATIONS_URL, "EMS");
  writeFileSync(
    new URL("./ems_stations.geojson", outDir),
    JSON.stringify({ type: "FeatureCollection", features: ems })
  );
  console.log(`Saved ${ems.length} EMS stations.`);

  console.log("Fetching HIFLD Fire stations...");
  const fire = await fetchAllPages(HIFLD_FIRE_STATIONS_URL, "FIRE");
  writeFileSync(
    new URL("./fire_stations.geojson", outDir),
    JSON.stringify({ type: "FeatureCollection", features: fire })
  );
  console.log(`Saved ${fire.length} Fire stations.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

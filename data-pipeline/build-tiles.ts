import { createWriteStream, readFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import * as shapefile from "shapefile";
import { resolveFromScript } from "./lib/paths.ts";
import type { ZipEstimate } from "./compute-estimate.ts";

async function main() {
  const rawDir = resolveFromScript(import.meta.url, "raw", "zcta_boundaries");
  const intermediateDir = resolveFromScript(import.meta.url, "intermediate");
  if (!existsSync(intermediateDir)) mkdirSync(intermediateDir, { recursive: true });

  const estimates: ZipEstimate[] = JSON.parse(
    readFileSync(path.join(intermediateDir, "estimates.json"), "utf-8")
  );
  const byZip = new Map(estimates.map((e) => [e.zip, e]));

  const shpPath = path.join(rawDir, "cb_2020_us_zcta520_500k.shp");
  const dbfPath = path.join(rawDir, "cb_2020_us_zcta520_500k.dbf");
  const source = await shapefile.open(shpPath, dbfPath);

  const outPath = path.join(intermediateDir, "zcta_joined.geojsonl");
  const out = createWriteStream(outPath);

  let written = 0;
  let skippedNoEstimate = 0;

  for (;;) {
    const result = await source.read();
    if (result.done) break;

    const feature = result.value;
    const zip = (feature.properties as Record<string, string>)?.ZCTA5CE20;
    const estimate = zip ? byZip.get(zip) : undefined;

    if (!estimate) {
      skippedNoEstimate++;
      continue;
    }

    const joined = {
      type: "Feature" as const,
      geometry: feature.geometry,
      properties: {
        zip,
        estMinutes: estimate.estMinutes,
        bucketId: estimate.bucketId,
        lowConfidence: estimate.lowConfidence,
      },
    };
    out.write(JSON.stringify(joined) + "\n");
    written++;
  }

  await new Promise<void>((resolve) => out.end(resolve));

  console.log(`Joined ${written} ZCTA polygons with estimates (skipped ${skippedNoEstimate} with no matching estimate)`);
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

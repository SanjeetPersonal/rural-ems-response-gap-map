import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import unzipper from "unzipper";
import { CENSUS_ZCTA_BOUNDARY_URL } from "./sources.ts";
import { fetchBuffer } from "./lib/http.ts";
import { resolveFromScript } from "./lib/paths.ts";

async function main() {
  const outDir = resolveFromScript(import.meta.url, "raw", "zcta_boundaries");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  console.log("Downloading Census ZCTA cartographic boundary shapefile (~65MB)...");
  const zipBuffer = await fetchBuffer(CENSUS_ZCTA_BOUNDARY_URL);
  const directory = await unzipper.Open.buffer(zipBuffer);

  for (const entry of directory.files) {
    if (entry.type !== "File") continue;
    const content = await entry.buffer();
    const outPath = path.join(outDir, entry.path);
    writeFileSync(outPath, content);
    console.log(`  extracted ${entry.path} (${content.length} bytes)`);
  }

  console.log(`Done -> ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

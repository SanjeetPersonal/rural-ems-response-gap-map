import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import unzipper from "unzipper";
import { CENSUS_GAZETTEER_ZCTA_URL } from "./sources.ts";
import { fetchBuffer } from "./lib/http.ts";
import { resolveFromScript } from "./lib/paths.ts";

async function main() {
  const outDir = resolveFromScript(import.meta.url, "raw");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  console.log("Downloading Census ZCTA Gazetteer file...");
  const zipBuffer = await fetchBuffer(CENSUS_GAZETTEER_ZCTA_URL);
  const directory = await unzipper.Open.buffer(zipBuffer);

  const txtEntry = directory.files.find((f) => f.path.endsWith(".txt"));
  if (!txtEntry) throw new Error("No .txt file found inside Gazetteer zip");

  const content = await txtEntry.buffer();
  const outPath = path.join(outDir, "zcta_centroids.txt");
  writeFileSync(outPath, content);
  console.log(`Saved ${txtEntry.path} -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

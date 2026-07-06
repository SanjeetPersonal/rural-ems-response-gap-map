import { writeFileSync, existsSync, mkdirSync } from "fs";
import unzipper from "unzipper";
import { CENSUS_GAZETTEER_ZCTA_URL } from "./sources.ts";
import { fetchBuffer } from "./lib/http.ts";

async function main() {
  const outDir = new URL("./raw", import.meta.url);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  console.log("Downloading Census ZCTA Gazetteer file...");
  const zipBuffer = await fetchBuffer(CENSUS_GAZETTEER_ZCTA_URL);
  const directory = await unzipper.Open.buffer(zipBuffer);

  const txtEntry = directory.files.find((f) => f.path.endsWith(".txt"));
  if (!txtEntry) throw new Error("No .txt file found inside Gazetteer zip");

  const content = await txtEntry.buffer();
  const outPath = new URL("./zcta_centroids.txt", outDir);
  writeFileSync(outPath, content);
  console.log(`Saved ${txtEntry.path} -> data-pipeline/raw/zcta_centroids.txt`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

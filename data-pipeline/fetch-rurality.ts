import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { RUCA_ZIP_2020_CSV_URL } from "./sources.ts";
import { fetchText } from "./lib/http.ts";
import { resolveFromScript } from "./lib/paths.ts";

async function main() {
  const outDir = resolveFromScript(import.meta.url, "raw");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  console.log("Downloading USDA ERS 2020 RUCA zip-code crosswalk...");
  const csv = await fetchText(RUCA_ZIP_2020_CSV_URL);
  const outPath = path.join(outDir, "ruca_zip.csv");
  writeFileSync(outPath, csv);
  const rowCount = csv.trim().split("\n").length - 1;
  console.log(`Saved ${rowCount} rows -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

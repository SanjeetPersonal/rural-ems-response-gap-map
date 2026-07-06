import { fileURLToPath } from "url";
import path from "path";

/**
 * Resolve a path relative to a calling script's own directory, using plain
 * string paths throughout (not WHATWG URL objects). In this sandboxed
 * environment, fs.writeFileSync silently no-ops when given a `file://` URL
 * object as its destination -- it reports success but nothing is written to
 * disk. Always go through this helper (or path.join + process.cwd()) instead
 * of `new URL("./x", import.meta.url)` for any fs write target.
 */
export function resolveFromScript(scriptImportMetaUrl: string, ...segments: string[]): string {
  const scriptDir = path.dirname(fileURLToPath(scriptImportMetaUrl));
  return path.join(scriptDir, ...segments);
}

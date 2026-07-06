console.log("import.meta.url:", import.meta.url);
const outDir = new URL("./raw", import.meta.url);
console.log("outDir pathname:", outDir.pathname);
import { existsSync, statSync } from "fs";
console.log("exists before:", existsSync(outDir));
import { writeFileSync } from "fs";
writeFileSync(new URL("./debugwrite.txt", outDir), "hello");
console.log("exists after:", existsSync(new URL("./debugwrite.txt", outDir)));

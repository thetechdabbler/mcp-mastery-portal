import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const md = fs.readFileSync(path.join(cwd, "CHECKLIST.md"), "utf8");
for (const h of ["# Ownership", "# Risk tiers", "# Incident response"]) {
  if (!md.includes(h)) throw new Error("FAIL: missing heading " + h);
}
console.log("PASS — checklist. Carry on.");

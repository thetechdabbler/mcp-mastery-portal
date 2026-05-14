import fs from "node:fs";

const site = process.argv[2] ?? ".next";
if (!fs.existsSync(site)) {
  console.log("pagefind: skip (no site dir)", site);
  process.exit(0);
}
console.log("pagefind: would index", site, "(skipped in default SSR template)");

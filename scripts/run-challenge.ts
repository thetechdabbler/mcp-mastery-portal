import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const pos = args.filter((a) => !a.startsWith("--"));
const slugArg = pos[0];

function runOne(slug: string) {
  const manifestPath = path.join(root, "content", "challenges", `${slug}.json`);
  if (!fs.existsSync(manifestPath)) {
    console.error("Unknown challenge slug:", slug);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const dir = path.join(root, "challenges", manifest.packageDir);
  const proc = spawn("node", ["--import", "tsx", "tests/validate.ts"], { cwd: dir, stdio: "inherit", env: process.env });
  proc.on("exit", (code) => process.exit(code ?? 1));
}

if (flags.has("--all")) {
  const files = fs.readdirSync(path.join(root, "content", "challenges")).filter((f) => f.endsWith(".json"));
  let i = 0;
  const next = () => {
    if (i >= files.length) {
      console.log("PASS — all challenges.");
      process.exit(0);
    }
    const slug = files[i]?.replace(/\.json$/, "");
    i += 1;
    if (!slug) return next();
    console.log("==>", slug);
    const manifest = JSON.parse(fs.readFileSync(path.join(root, "content", "challenges", `${slug}.json`), "utf8"));
    const dir = path.join(root, "challenges", manifest.packageDir);
    const proc = spawn("node", ["--import", "tsx", "tests/validate.ts"], { cwd: dir, stdio: "inherit", env: process.env });
    proc.on("exit", (code) => {
      if (code !== 0) process.exit(code ?? 1);
      next();
    });
  };
  next();
} else if (!slugArg) {
  console.error("Usage: tsx scripts/run-challenge.ts <slug> | --all [--watch] [--verbose] [--json]");
  process.exit(1);
} else {
  runOne(slugArg);
}

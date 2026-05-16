import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { challengeManifestSchema } from "../lib/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const args = process.argv.slice(2);
const trackIdx = args.indexOf("--track");
const track =
  trackIdx >= 0 && args[trackIdx + 1] === "agentcore" ? "agentcore" : "mcp";
const slugArg = args.find((a) => !a.startsWith("--") && a !== "agentcore");

const manifestDir =
  track === "agentcore"
    ? path.join(root, "content", "agentcore", "challenges")
    : path.join(root, "content", "challenges");
const challengesRoot =
  track === "agentcore" ? path.join(root, "challenges", "agentcore") : path.join(root, "challenges");

function uvBin(): string {
  const local = path.join(root, "node_modules", ".bin", "uv");
  return fs.existsSync(local) ? local : "uv";
}

function runValidator(slug: string, onExit: (code: number | null) => void) {
  const manifestPath = path.join(manifestDir, `${slug}.json`);
  if (!fs.existsSync(manifestPath)) {
    console.error("Unknown challenge slug:", slug, `(track: ${track})`);
    process.exit(1);
  }
  const manifest = challengeManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, "utf8")));
  const dir = path.join(challengesRoot, manifest.packageDir);
  const runner = manifest.runner ?? "node";
  const proc =
    runner === "python"
      ? spawn(uvBin(), ["run", "python", "tests/validate.py"], { cwd: dir, stdio: "inherit", env: process.env })
      : spawn("node", ["--import", "tsx", "tests/validate.ts"], { cwd: dir, stdio: "inherit", env: process.env });
  proc.on("exit", onExit);
}

if (args.includes("--all")) {
  const files = fs.readdirSync(manifestDir).filter((f) => f.endsWith(".json"));
  let i = 0;
  const next = () => {
    if (i >= files.length) {
      console.log(`PASS — all ${track} challenges.`);
      process.exit(0);
    }
    const slug = files[i]?.replace(/\.json$/, "");
    i += 1;
    if (!slug) return next();
    console.log("==>", slug);
    runValidator(slug, (code) => {
      if (code !== 0) process.exit(code ?? 1);
      next();
    });
  };
  next();
} else if (!slugArg) {
  console.error(
    "Usage: tsx scripts/run-challenge.ts <slug> [--track agentcore] | --all [--track agentcore]",
  );
  process.exit(1);
} else {
  runValidator(slugArg, (code) => process.exit(code ?? 1));
}

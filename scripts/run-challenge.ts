import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { challengeManifestSchema } from "../lib/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const args = process.argv.slice(2);

function stripTrackFlags(argv: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--track") {
      i += 1;
      continue;
    }
    out.push(a!);
  }
  return out;
}

const trackIdx = args.indexOf("--track");
const trackArg = trackIdx >= 0 ? args[trackIdx + 1] : undefined;
const track: "mcp" | "agentcore" | "langchain" =
  trackArg === "agentcore" ? "agentcore" : trackArg === "langchain" ? "langchain" : "mcp";

const positional = stripTrackFlags(args);
const slugArg = positional.find((a) => !a.startsWith("--"));

const manifestDir =
  track === "agentcore"
    ? path.join(root, "content", "agentcore", "challenges")
    : track === "langchain"
      ? path.join(root, "content", "langchain", "challenges")
      : path.join(root, "content", "challenges");
const challengesRoot =
  track === "agentcore"
    ? path.join(root, "challenges", "agentcore")
    : track === "langchain"
      ? path.join(root, "challenges", "langchain")
      : path.join(root, "challenges");

function uvBin(): string {
  const local = path.join(root, "node_modules", ".bin", "uv");
  return fs.existsSync(local) ? local : "uv";
}

function pythonValidatorEnv(): NodeJS.ProcessEnv {
  return { ...process.env, PYTHONDONTWRITEBYTECODE: "1" };
}

function uvIsUsable(): boolean {
  const bin = uvBin();
  const result = spawnSync(bin, ["--version"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return result.status === 0;
}

function resolveSystemPython(): string {
  for (const cmd of ["python3", "python"]) {
    const result = spawnSync(cmd, ["-c", "import sys; sys.exit(0)"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (result.status === 0) return cmd;
  }
  console.error(
    "LangChain Python validators require Python on PATH (tried python3, then python) when uv is unavailable.",
  );
  process.exit(1);
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
  let proc: ReturnType<typeof spawn>;
  if (runner === "python") {
    const env = pythonValidatorEnv();
    const useUv = track !== "langchain" || uvIsUsable();
    proc = useUv
      ? spawn(uvBin(), ["run", "python", "tests/validate.py"], { cwd: dir, stdio: "inherit", env })
      : spawn(resolveSystemPython(), ["tests/validate.py"], { cwd: dir, stdio: "inherit", env });
  } else {
    proc = spawn("node", ["--import", "tsx", "tests/validate.ts"], { cwd: dir, stdio: "inherit", env: process.env });
  }
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
    "Usage: tsx scripts/run-challenge.ts <slug> [--track agentcore|langchain] | --all [--track agentcore|langchain]",
  );
  process.exit(1);
} else {
  runValidator(slugArg, (code) => process.exit(code ?? 1));
}

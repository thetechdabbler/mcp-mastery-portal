#!/usr/bin/env node
/**
 * Compile `content/diagrams/<id>.d2` → `public/diagrams/<id>.svg` using the D2 CLI.
 * Prepends DIAGRAM_STYLE_PRELUDE (repo-wide defaults).
 *
 * Requires: `d2` on PATH (see CONTRIBUTING.md).
 * Icon URLs in sources should use `scripts/diagram-icon-urls.mjs` as the palette reference.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { BRAND_ICONS, ROLE_ICONS } from "./diagram-icon-urls.mjs";

void ROLE_ICONS;
void BRAND_ICONS;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDirs = [
  path.join(root, "content", "diagrams"),
  path.join(root, "content", "agentcore", "diagrams"),
  path.join(root, "content", "langchain", "diagrams"),
];
const outDir = path.join(root, "public", "diagrams");

/** Applied before every diagram (D2 glob `***`). */
export const DIAGRAM_STYLE_PRELUDE = `***.style.border-radius: 8
***.style.font-size: 14
***.style.stroke-width: 2
`;

/**
 * @param {string} cmd
 * @param {string[]} args
 * @returns {Promise<void>}
 */
function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

/**
 * @param {string} srcPath
 * @param {string} outPath
 */
async function isStale(srcPath, outPath) {
  try {
    const [srcStat, outStat] = await Promise.all([fs.stat(srcPath), fs.stat(outPath)]);
    return srcStat.mtimeMs > outStat.mtimeMs;
  } catch {
    return true;
  }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  try {
    await new Promise((resolve, reject) => {
      const child = spawn("d2", ["version"], { stdio: "ignore" });
      child.on("error", reject);
      child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("d2 version failed"))));
    });
  } catch {
    console.error(
      "D2 CLI not found. Install: https://d2lang.com/tour/install (e.g. `brew install d2` on macOS).",
    );
    process.exit(1);
  }

  let rendered = 0;
  let skipped = 0;
  let totalSources = 0;

  for (const srcDir of srcDirs) {
    let entries;
    try {
      entries = await fs.readdir(srcDir);
    } catch {
      continue;
    }
    const d2Files = entries.filter((f) => f.endsWith(".d2") && !f.startsWith("_"));
    totalSources += d2Files.length;

    for (const file of d2Files) {
      const id = file.replace(/\.d2$/, "");
      const srcPath = path.join(srcDir, file);
      const outPath = path.join(outDir, `${id}.svg`);
      const body = await fs.readFile(srcPath, "utf8");
      const combined = `${DIAGRAM_STYLE_PRELUDE}\n${body}`;
      const tmpPath = path.join(outDir, `.tmp-${id}.d2`);
      if (!(await isStale(srcPath, outPath))) {
        skipped += 1;
        continue;
      }
      await fs.writeFile(tmpPath, combined, "utf8");
      try {
        await run("d2", [tmpPath, outPath]);
        rendered += 1;
      } finally {
        await fs.unlink(tmpPath).catch(() => {});
      }
    }
  }

  if (totalSources === 0) {
    console.warn("No .d2 files in diagram source dirs");
    return;
  }

  console.log(`diagrams: rendered ${rendered}, skipped ${skipped}, total sources ${totalSources}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

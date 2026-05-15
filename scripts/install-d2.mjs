#!/usr/bin/env node
/**
 * Ensure the `d2` CLI is available before `render-diagrams.mjs` runs.
 *
 * - Local dev: assumes `d2` is on PATH (e.g. `brew install d2`); no-op.
 * - Vercel build (or any Linux env without d2): downloads the official
 *   release tarball and drops the binary into `node_modules/.bin/d2`,
 *   which npm scripts already have on PATH.
 *
 * Pinned to D2 v0.7.1 to match `.github/workflows/ci.yml`.
 */

import { spawnSync } from "node:child_process";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const D2_VERSION = "v0.7.1";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const binDir = path.join(root, "node_modules", ".bin");
const targetBin = path.join(binDir, "d2");

function hasSystemD2() {
  const probe = spawnSync("d2", ["version"], { stdio: "ignore" });
  return probe.status === 0;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function platformSlug() {
  const platform = os.platform();
  const arch = os.arch();
  if (platform === "linux" && arch === "x64") return "linux-amd64";
  if (platform === "linux" && arch === "arm64") return "linux-arm64";
  if (platform === "darwin" && arch === "x64") return "macos-amd64";
  if (platform === "darwin" && arch === "arm64") return "macos-arm64";
  return null;
}

async function downloadAndExtract(url, destBin) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    throw new Error(`Download failed: ${res.status} ${res.statusText} for ${url}`);
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "d2-install-"));
  const tarPath = path.join(tmpDir, "d2.tar");

  await pipeline(res.body, zlib.createGunzip(), createWriteStream(tarPath));

  const extract = spawnSync("tar", ["-xf", tarPath, "-C", tmpDir], { stdio: "inherit" });
  if (extract.status !== 0) {
    throw new Error("tar extraction failed");
  }

  const entries = await fs.readdir(tmpDir, { withFileTypes: true });
  const d2Dir = entries.find((e) => e.isDirectory() && e.name.startsWith("d2-"));
  if (!d2Dir) throw new Error("Could not find extracted d2 directory");
  const srcBin = path.join(tmpDir, d2Dir.name, "bin", "d2");

  await fs.mkdir(path.dirname(destBin), { recursive: true });
  await fs.copyFile(srcBin, destBin);
  await fs.chmod(destBin, 0o755);
  await fs.rm(tmpDir, { recursive: true, force: true });
}

async function main() {
  if (hasSystemD2()) {
    return;
  }

  if (await fileExists(targetBin)) {
    const probe = spawnSync(targetBin, ["version"], { stdio: "ignore" });
    if (probe.status === 0) {
      return;
    }
  }

  const slug = platformSlug();
  if (!slug) {
    console.error(
      `install-d2: no prebuilt D2 binary for ${os.platform()}/${os.arch()}. ` +
        `Install D2 manually (https://d2lang.com/tour/install) and re-run.`,
    );
    process.exit(1);
  }

  const url = `https://github.com/terrastruct/d2/releases/download/${D2_VERSION}/d2-${D2_VERSION}-${slug}.tar.gz`;
  console.log(`install-d2: downloading ${D2_VERSION} for ${slug}…`);
  await downloadAndExtract(url, targetBin);
  console.log(`install-d2: installed → ${path.relative(root, targetBin)}`);
}

main().catch((err) => {
  console.error("install-d2: failed", err);
  process.exit(1);
});

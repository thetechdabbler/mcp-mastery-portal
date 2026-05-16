#!/usr/bin/env node
/**
 * Ensure `uv` is available for Python labs/challenges.
 * Local dev: uses system `uv` if present; otherwise downloads a pinned release into node_modules/.bin.
 */

import { spawnSync } from "node:child_process";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
const UV_VERSION = "0.6.14";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const binDir = path.join(root, "node_modules", ".bin");
const targetBin = path.join(binDir, "uv");

function hasUv() {
  const probe = spawnSync("uv", ["--version"], { stdio: "ignore" });
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

function platformAsset() {
  const platform = os.platform();
  const arch = os.arch();
  if (platform === "linux" && arch === "x64") return "uv-x86_64-unknown-linux-gnu.tar.gz";
  if (platform === "linux" && arch === "arm64") return "uv-aarch64-unknown-linux-gnu.tar.gz";
  if (platform === "darwin" && arch === "arm64") return "uv-aarch64-apple-darwin.tar.gz";
  if (platform === "darwin" && arch === "x64") return "uv-x86_64-apple-darwin.tar.gz";
  return null;
}

async function downloadUv(destBin) {
  const asset = platformAsset();
  if (!asset) {
    throw new Error(`No uv binary for ${os.platform()}/${os.arch()}`);
  }
  const url = `https://github.com/astral-sh/uv/releases/download/${UV_VERSION}/${asset}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status} for ${url}`);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "uv-install-"));
  const tarPath = path.join(tmpDir, "uv.tar.gz");
  await pipeline(res.body, createWriteStream(tarPath));

  const extract = spawnSync("tar", ["-xzf", tarPath, "-C", tmpDir], { stdio: "inherit" });
  if (extract.status !== 0) throw new Error("tar extraction failed");

  const entries = await fs.readdir(tmpDir, { withFileTypes: true });
  const uvDir = entries.find((e) => e.isDirectory() && e.name.startsWith("uv-"));
  const srcBin = uvDir
    ? path.join(tmpDir, uvDir.name, "uv")
    : path.join(tmpDir, "uv");
  if (!(await fileExists(srcBin))) {
    throw new Error("uv binary not found in archive");
  }
  await fs.mkdir(path.dirname(destBin), { recursive: true });
  await fs.copyFile(srcBin, destBin);
  await fs.chmod(destBin, 0o755);
  await fs.rm(tmpDir, { recursive: true, force: true });
}

async function main() {
  if (hasUv()) return;
  if (await fileExists(targetBin)) {
    const probe = spawnSync(targetBin, ["--version"], { stdio: "ignore" });
    if (probe.status === 0) return;
  }
  console.log(`install-uv: downloading uv ${UV_VERSION}…`);
  await downloadUv(targetBin);
  console.log(`install-uv: installed → ${path.relative(root, targetBin)}`);
}

main().catch((err) => {
  console.error("install-uv: failed", err);
  process.exit(1);
});

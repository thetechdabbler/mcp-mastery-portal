import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = path.join(root, "packages", "mcp-curriculum-server");

const proc = spawn("node", ["--import", "tsx", "src/start.ts"], {
  cwd: pkg,
  stdio: "inherit",
  env: { ...process.env, MCP_CONTENT_ROOT: path.join(root, "content") },
});

setTimeout(() => {
  proc.kill("SIGTERM");
  console.log("smoke: curriculum server started OK");
  process.exit(0);
}, 1500);

proc.on("exit", (code, sig) => {
  if (sig === "SIGTERM") return;
  if (code && code !== 0) process.exit(code);
});

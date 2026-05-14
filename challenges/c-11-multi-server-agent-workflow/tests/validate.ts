import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["--import", "tsx", "src/index.ts"], cwd, stderr: "inherit" });
const client = new Client({ name: "validator", version: "0.0.1" });
await client.connect(transport);
const tools = await client.listTools();
const names = tools.tools.map((t) => t.name).sort().join(",");
if (!names.includes("planner_plan") || !names.includes("executor_run")) throw new Error("FAIL: tools " + names);
await client.close();
console.log("PASS — challenge ok. Carry on.");

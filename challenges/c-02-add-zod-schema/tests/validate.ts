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
const bad = await client.callTool({ name: "mul", arguments: { a: "2", b: 3 } });
if (!bad.isError) throw new Error("FAIL: expected tool error for bad types");
const good = await client.callTool({ name: "mul", arguments: { a: 2, b: 3 } });
if (!JSON.stringify(good).includes("6")) throw new Error("FAIL: expected 6");
await client.close();
console.log("PASS — challenge ok. Carry on.");

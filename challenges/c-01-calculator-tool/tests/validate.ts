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
const r = await client.callTool({ name: "add", arguments: { a: 2, b: 3 } });
if (!JSON.stringify(r).includes("5")) throw new Error("FAIL: expected 5");
await client.close();
console.log("PASS — challenge ok. Carry on.");

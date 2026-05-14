import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "challenges");

const valHeader = `import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const transport = new StdioClientTransport({ command: "npx", args: ["tsx", "src/index.ts"], cwd, stderr: "inherit" });
const client = new Client({ name: "validator", version: "0.0.1" });
await client.connect(transport);
`;

const valFooter = `await client.close();
console.log("PASS — challenge ok. Carry on.");
`;

const challenges = [
  {
    dir: "c-01-calculator-tool",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-01-calculator-tool", version: "1.0.0" });
server.registerTool("add", { description: "Add", inputSchema: { a: z.number(), b: z.number() } }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const r = await client.callTool({ name: "add", arguments: { a: 2, b: 3 } });
if (!JSON.stringify(r).includes("5")) throw new Error("FAIL: expected 5");
` +
      valFooter,
  },
  {
    dir: "c-02-add-zod-schema",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-02", version: "1.0.0" });
server.registerTool("mul", { description: "Mul", inputSchema: { a: z.number(), b: z.number() } }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a * b) }],
}));
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const bad = await client.callTool({ name: "mul", arguments: { a: "2", b: 3 } });
if (!bad.isError) throw new Error("FAIL: expected tool error for bad types");
const good = await client.callTool({ name: "mul", arguments: { a: 2, b: 3 } });
if (!JSON.stringify(good).includes("6")) throw new Error("FAIL: expected 6");
` +
      valFooter,
  },
  {
    dir: "c-03-unsafe-to-readonly-resource",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const server = new McpServer({ name: "c-03", version: "1.0.0" });
server.registerResource(
  "doc",
  "docs://readme",
  { description: "Readme", mimeType: "text/plain" },
  async () => ({
    contents: [{ uri: "docs://readme", mimeType: "text/plain", text: "hello docs" }],
  }),
);
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const rr = await client.readResource({ uri: "docs://readme" });
const t = rr.contents?.[0]?.text;
if (!t?.includes("hello")) throw new Error("FAIL: resource");
` +
      valFooter,
  },
  {
    dir: "c-04-pr-review-prompt",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-04", version: "1.0.0" });
server.registerPrompt(
  "pr_review",
  { description: "PR review", argsSchema: { title: z.string(), diff: z.string() } },
  async ({ title, diff }) => ({
    messages: [{ role: "user", content: { type: "text", text: "Review PR: " + title + "\\n" + diff } }],
  }),
);
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const p = await client.getPrompt({ name: "pr_review", arguments: { title: "x", diff: "y" } });
if (!p.messages?.length) throw new Error("FAIL: prompt");
` +
      valFooter,
  },
  {
    dir: "c-05-debug-capability-negotiation",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-05", version: "1.0.0" });
server.registerTool("noop", { description: "noop", inputSchema: {} }, async () => ({
  content: [{ type: "text", text: "ok" }],
}));
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const caps = client.getServerCapabilities();
if (!caps?.tools) throw new Error("FAIL: tools capability");
` +
      valFooter,
  },
  {
    dir: "c-06-structured-errors",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-06", version: "1.0.0" });
server.registerTool(
  "need_pos",
  { description: "positive", inputSchema: { n: z.number() } },
  async ({ n }) => {
    if (n <= 0) return { isError: true, content: [{ type: "text", text: "BAD_INPUT" }] };
    return { content: [{ type: "text", text: String(n) }] };
  },
);
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const bad = await client.callTool({ name: "need_pos", arguments: { n: -1 } });
if (!bad.isError) throw new Error("FAIL: isError");
` +
      valFooter,
  },
  {
    dir: "c-07-audit-log-middleware",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-07", version: "1.0.0" });
server.registerTool(
  "audited_echo",
  { description: "echo", inputSchema: { msg: z.string() } },
  async ({ msg }) => {
    console.error(JSON.stringify({ AUDIT: true, tool: "audited_echo" }));
    return { content: [{ type: "text", text: "AUDIT_OK:" + msg }] };
  },
);
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const r = await client.callTool({ name: "audited_echo", arguments: { msg: "x" } });
if (!JSON.stringify(r).includes("AUDIT_OK")) throw new Error("FAIL: echo");
` +
      valFooter,
  },
  {
    dir: "c-08-prevent-path-traversal",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "node:path";
const ROOT = "/tmp";
const server = new McpServer({ name: "c-08", version: "1.0.0" });
server.registerTool(
  "read_path",
  { description: "read", inputSchema: { p: z.string() } },
  async ({ p }) => {
    if (p.includes("..")) return { isError: true, content: [{ type: "text", text: "TRAVERSAL" }] };
    const resolved = path.resolve(ROOT, p);
    if (!resolved.startsWith(path.resolve(ROOT))) {
      return { isError: true, content: [{ type: "text", text: "OUTSIDE_ROOT" }] };
    }
    return { content: [{ type: "text", text: "ok:" + resolved }] };
  },
);
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const bad = await client.callTool({ name: "read_path", arguments: { p: "../etc/passwd" } });
if (!bad.isError) throw new Error("FAIL: traversal");
const ok = await client.callTool({ name: "read_path", arguments: { p: "safe.txt" } });
if (ok.isError) throw new Error("FAIL: safe path");
` +
      valFooter,
  },
  {
    dir: "c-09-human-approval-write",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-09", version: "1.0.0" });
server.registerTool(
  "write_file",
  {
    description: "write",
    inputSchema: { path: z.string(), content: z.string(), approved: z.literal("YES") },
  },
  async () => ({ content: [{ type: "text", text: "written" }] }),
);
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const bad = await client.callTool({
  name: "write_file",
  arguments: { path: "x", content: "y", approved: "NO" },
});
if (!bad.isError) throw new Error("FAIL: approval required");
const good = await client.callTool({
  name: "write_file",
  arguments: { path: "x", content: "y", approved: "YES" },
});
if (good.isError) throw new Error("FAIL: should succeed");
` +
      valFooter,
  },
  {
    dir: "c-10-enterprise-governance-checklist",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-10", version: "1.0.0" });
server.registerTool("noop", { description: "noop", inputSchema: {} }, async () => ({
  content: [{ type: "text", text: "ok" }],
}));
await server.connect(new StdioServerTransport());
`,
    validate: `import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const md = fs.readFileSync(path.join(cwd, "CHECKLIST.md"), "utf8");
for (const h of ["# Ownership", "# Risk tiers", "# Incident response"]) {
  if (!md.includes(h)) throw new Error("FAIL: missing heading " + h);
}
console.log("PASS — checklist. Carry on.");
`,
  },
  {
    dir: "c-11-multi-server-agent-workflow",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-11", version: "1.0.0" });
server.registerTool("planner_plan", { description: "plan", inputSchema: { goal: z.string() } }, async ({ goal }) => ({
  content: [{ type: "text", text: "plan:" + goal }],
}));
server.registerTool(
  "executor_run",
  { description: "run", inputSchema: { cmd: z.string() } },
  async ({ cmd }) => ({ content: [{ type: "text", text: "run:" + cmd }] }),
);
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `const tools = await client.listTools();
const names = tools.tools.map((t) => t.name).sort().join(",");
if (!names.includes("planner_plan") || !names.includes("executor_run")) throw new Error("FAIL: tools " + names);
` +
      valFooter,
  },
  {
    dir: "c-12-capstone-internal-dev-assistant",
    src: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-12", version: "1.0.0" });
server.registerResource(
  "code",
  "code://search",
  { description: "search", mimeType: "text/plain" },
  async () => ({
    contents: [{ uri: "code://search", mimeType: "text/plain", text: "matches: none" }],
  }),
);
server.registerTool(
  "write_file",
  {
    description: "write",
    inputSchema: { path: z.string(), content: z.string(), approved: z.literal("YES") },
  },
  async () => ({ content: [{ type: "text", text: "ok" }] }),
);
await server.connect(new StdioServerTransport());
`,
    validate:
      valHeader +
      `await client.readResource({ uri: "code://search" });
const bad = await client.callTool({ name: "write_file", arguments: { path: "a", content: "b", approved: "NO" } });
if (!bad.isError) throw new Error("FAIL: write needs approval");
` +
      valFooter,
  },
];

for (const c of challenges) {
  fs.writeFileSync(path.join(root, c.dir, "src", "index.ts"), c.src, "utf8");
  fs.writeFileSync(path.join(root, c.dir, "tests", "validate.ts"), c.validate, "utf8");
}

fs.writeFileSync(
  path.join(root, "c-10-enterprise-governance-checklist", "CHECKLIST.md"),
  `# Ownership
Who owns catalog entries.

# Risk tiers
Low medium high.

# Incident response
Pager rotations and rollback.
`,
  "utf8",
);

console.log("Wrote all challenge implementations");

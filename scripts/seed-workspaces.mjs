import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const labTsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "NodeNext",
    moduleResolution: "NodeNext",
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    types: ["node"],
  },
  include: ["src/**/*.ts", "solution/**/*.ts"],
};

const labPkg = (name) =>
  JSON.stringify(
    {
      name,
      private: true,
      type: "module",
      scripts: {
        start: "tsx src/server.ts",
        solution: "tsx solution/server.ts",
        typecheck: "tsc -p tsconfig.json",
      },
      dependencies: {
        "@modelcontextprotocol/sdk": "^1.29.0",
        zod: "^3.25.0",
      },
      devDependencies: {
        "@types/node": "^22.10.0",
        tsx: "^4.19.0",
        typescript: "^5.8.0",
      },
    },
    null,
    2,
  );

const helloServer = `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({ name: "hello-lab", version: "0.1.0" });

server.registerTool(
  "ping",
  { description: "Health check", inputSchema: {} },
  async () => ({
    content: [{ type: "text", text: "pong" }],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
`;

const labs = [
  "lab-01-hello-mcp-server",
  "lab-02-tool-with-schema-validation",
  "lab-03-readonly-resource-server",
  "lab-04-prompt-template-server",
  "lab-05-stdio-debugging",
  "lab-06-streamable-http-server",
  "lab-07-secure-file-reader-tool",
  "lab-08-human-approval-write-tool",
  "lab-09-observability-and-audit-log",
  "lab-10-capstone-enterprise-mcp-server",
];

for (const lab of labs) {
  const base = path.join(root, "labs", lab);
  fs.mkdirSync(path.join(base, "src"), { recursive: true });
  fs.mkdirSync(path.join(base, "solution"), { recursive: true });
  fs.writeFileSync(path.join(base, "package.json"), labPkg(lab), "utf8");
  fs.writeFileSync(path.join(base, "tsconfig.json"), JSON.stringify(labTsconfig, null, 2), "utf8");
  fs.writeFileSync(path.join(base, "README.md"), `# ${lab}\n\nRun: \`npm start\` in this folder.\n\nSolution: \`npm run solution\`\n`, "utf8");
  const starter = lab === "lab-01-hello-mcp-server" ? helloServer : helloServer.replace("hello-lab", lab);
  fs.writeFileSync(path.join(base, "src", "server.ts"), starter, "utf8");
  fs.writeFileSync(path.join(base, "solution", "server.ts"), starter, "utf8");
}

const challengeNames = [
  "c-01-calculator-tool",
  "c-02-add-zod-schema",
  "c-03-unsafe-to-readonly-resource",
  "c-04-pr-review-prompt",
  "c-05-debug-capability-negotiation",
  "c-06-structured-errors",
  "c-07-audit-log-middleware",
  "c-08-prevent-path-traversal",
  "c-09-human-approval-write",
  "c-10-enterprise-governance-checklist",
  "c-11-multi-server-agent-workflow",
  "c-12-capstone-internal-dev-assistant",
];

const calcServer = `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "challenge-calculator", version: "0.1.0" });

server.registerTool(
  "add",
  {
    description: "Add integers",
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
`;

const validateCalc = `import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "src/index.ts"],
  cwd: root,
  stderr: "inherit",
});

const client = new Client({ name: "validator", version: "0.0.1" });
await client.connect(transport);
const tools = await client.listTools();
const add = tools.tools.find((t) => t.name === "add");
if (!add) throw new Error("FAIL: missing add tool");
const res = await client.callTool({ name: "add", arguments: { a: 2, b: 3 } });
const text = JSON.stringify(res);
if (!text.includes("5")) throw new Error("FAIL: expected 5 in result, got " + text);
await client.close();
console.log("PASS — calculator. Carry on.");
`;

for (const c of challengeNames) {
  const base = path.join(root, "challenges", c);
  fs.mkdirSync(path.join(base, "src"), { recursive: true });
  fs.mkdirSync(path.join(base, "tests"), { recursive: true });
  fs.writeFileSync(path.join(base, "package.json"), labPkg(c), "utf8");
  fs.writeFileSync(path.join(base, "tsconfig.json"), JSON.stringify(labTsconfig, null, 2), "utf8");
  fs.writeFileSync(
    path.join(base, "README.md"),
    `# ${c}\n\nValidator: \`npx tsx tests/validate.ts\`\n`,
    "utf8",
  );
  if (c === "c-01-calculator-tool") {
    fs.writeFileSync(path.join(base, "src", "index.ts"), calcServer, "utf8");
    fs.writeFileSync(path.join(base, "tests", "validate.ts"), validateCalc, "utf8");
  } else {
    fs.writeFileSync(path.join(base, "src", "index.ts"), calcServer, "utf8");
    fs.writeFileSync(path.join(base, "tests", "validate.ts"), validateCalc, "utf8");
  }
}

console.log("Seeded labs and challenge stubs");

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

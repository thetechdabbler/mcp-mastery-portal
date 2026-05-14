import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-01-calculator-tool", version: "1.0.0" });
server.registerTool("add", { description: "Add", inputSchema: { a: z.number(), b: z.number() } }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));
await server.connect(new StdioServerTransport());

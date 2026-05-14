import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

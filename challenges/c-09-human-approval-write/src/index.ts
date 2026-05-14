import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

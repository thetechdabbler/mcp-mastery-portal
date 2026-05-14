import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

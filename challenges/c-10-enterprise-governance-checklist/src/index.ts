import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const server = new McpServer({ name: "c-10", version: "1.0.0" });
server.registerTool("noop", { description: "noop", inputSchema: {} }, async () => ({
  content: [{ type: "text", text: "ok" }],
}));
await server.connect(new StdioServerTransport());

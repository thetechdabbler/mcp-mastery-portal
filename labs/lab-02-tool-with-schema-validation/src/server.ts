import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({ name: "lab-02-tool-with-schema-validation", version: "0.1.0" });

server.registerTool(
  "ping",
  { description: "Health check", inputSchema: {} },
  async () => ({
    content: [{ type: "text", text: "pong" }],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);

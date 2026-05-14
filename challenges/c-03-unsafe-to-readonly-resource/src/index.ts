import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

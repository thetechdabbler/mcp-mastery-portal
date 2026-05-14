import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

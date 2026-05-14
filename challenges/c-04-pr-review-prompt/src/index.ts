import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "c-04", version: "1.0.0" });
server.registerPrompt(
  "pr_review",
  { description: "PR review", argsSchema: { title: z.string(), diff: z.string() } },
  async ({ title, diff }) => ({
    messages: [{ role: "user", content: { type: "text", text: "Review PR: " + title + "\n" + diff } }],
  }),
);
await server.connect(new StdioServerTransport());

import fs from "node:fs";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const contentRoot =
  process.env.MCP_CONTENT_ROOT ?? path.join(process.cwd(), "..", "..", "content");
const chaptersDir = path.join(contentRoot, "chapters");

const server = new McpServer({ name: "mcp-curriculum-server", version: "1.0.0" });

server.registerResource(
  "chapters",
  "curriculum://chapters",
  { description: "List chapter files", mimeType: "application/json" },
  async () => {
    const files = fs.existsSync(chaptersDir)
      ? fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".mdx"))
      : [];
    return {
      contents: [
        {
          uri: "curriculum://chapters",
          mimeType: "application/json",
          text: JSON.stringify(files, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  "search_curriculum",
  {
    description: "Search chapter sources for a substring",
    inputSchema: { q: z.string().min(1) },
  },
  async ({ q }) => {
    const hits: string[] = [];
    if (fs.existsSync(chaptersDir)) {
      for (const f of fs.readdirSync(chaptersDir).filter((x) => x.endsWith(".mdx"))) {
        const t = fs.readFileSync(path.join(chaptersDir, f), "utf8");
        if (t.toLowerCase().includes(q.toLowerCase())) hits.push(f);
      }
    }
    return { content: [{ type: "text", text: JSON.stringify(hits) }] };
  },
);

server.registerTool(
  "recommend_next_chapter",
  {
    description: "Recommend next slug from completed list",
    inputSchema: { completed: z.array(z.string()) },
  },
  async ({ completed }) => {
    const files = fs.existsSync(chaptersDir)
      ? fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".mdx")).sort()
      : [];
    const next = files.find((f) => !completed.includes(f.replace(/\.mdx$/, "")));
    return { content: [{ type: "text", text: next ?? "done" }] };
  },
);

await server.connect(new StdioServerTransport());

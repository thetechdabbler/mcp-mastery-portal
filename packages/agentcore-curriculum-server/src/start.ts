import fs from "node:fs";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const contentRoot =
  process.env.AGENTCORE_CONTENT_ROOT ?? path.join(process.cwd(), "..", "..", "content", "agentcore");
const chaptersDir = path.join(contentRoot, "chapters");

const server = new McpServer({ name: "agentcore-curriculum-server", version: "1.0.0" });

server.registerResource(
  "chapters",
  "agentcore://chapters",
  { description: "List AgentCore track chapter files", mimeType: "application/json" },
  async () => {
    const files = fs.existsSync(chaptersDir)
      ? fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".mdx"))
      : [];
    return {
      contents: [
        {
          uri: "agentcore://chapters",
          mimeType: "application/json",
          text: JSON.stringify(files, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  "search_agentcore_curriculum",
  {
    description: "Search AgentCore chapter sources for a substring",
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
  "recommend_next_agentcore_chapter",
  {
    description: "Recommend next AgentCore slug from completed list",
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

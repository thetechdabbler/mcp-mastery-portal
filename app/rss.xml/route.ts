import { getAllAgentcoreChapters } from "@/lib/agentcore-content";
import { getAllChapters } from "@/lib/content";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [chapters, acChapters] = await Promise.all([getAllChapters(), getAllAgentcoreChapters()]);
  const mcpItems = chapters
    .map(
      (c) => `
    <item>
      <title>${escapeXml(c.frontmatter.title)}</title>
      <link>${base}/chapters/${c.frontmatter.slug}</link>
      <guid>${base}/chapters/${c.frontmatter.slug}</guid>
      <category>MCP</category>
      <pubDate>${new Date(c.frontmatter.lastReviewed).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");
  const acItems = acChapters
    .map(
      (c) => `
    <item>
      <title>${escapeXml(c.frontmatter.title)}</title>
      <link>${base}/agentcore/chapters/${c.frontmatter.slug}</link>
      <guid>${base}/agentcore/chapters/${c.frontmatter.slug}</guid>
      <category>AgentCore</category>
      <pubDate>${new Date(c.frontmatter.lastReviewed).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>MCP Mastery Portal</title>
    <link>${base}</link>
    <description>MCP + AgentCore curriculum chapters</description>
    ${mcpItems}
    ${acItems}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

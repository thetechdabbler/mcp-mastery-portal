import { getAllChapters } from "@/lib/content";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const chapters = await getAllChapters();
  const items = chapters
    .map(
      (c) => `
    <item>
      <title>${escapeXml(c.frontmatter.title)}</title>
      <link>${base}/chapters/${c.frontmatter.slug}</link>
      <guid>${base}/chapters/${c.frontmatter.slug}</guid>
      <pubDate>${new Date(c.frontmatter.lastReviewed).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>MCP Mastery Portal</title>
    <link>${base}</link>
    <description>MCP curriculum chapters</description>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

import { ImageResponse } from "next/og";
import { getAgentcoreChapterBySlug } from "@/lib/agentcore-content";
import { getChapterBySlug } from "@/lib/content";

export const runtime = "nodejs";

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const url = new URL(req.url);
  const track = url.searchParams.get("track") === "agentcore" ? "agentcore" : "mcp";
  const doc =
    track === "agentcore" ? await getAgentcoreChapterBySlug(slug) : await getChapterBySlug(slug);
  if (!doc) return new Response("Not found", { status: 404 });
  const fm = doc.frontmatter;
  const footer =
    track === "agentcore" && "langgraphVersion" in fm
      ? `LangGraph ${fm.langgraphVersion}`
      : "specVersion" in fm
        ? `Spec ${fm.specVersion}`
        : "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 48,
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "ui-sans-serif, system-ui",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.8 }}>
          {track === "agentcore" ? "AgentCore" : "MCP"} · Chapter {fm.order}
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, marginTop: 12 }}>{fm.title}</div>
        <div style={{ fontSize: 24, marginTop: 16, opacity: 0.85 }}>{fm.subtitle ?? ""}</div>
        <div style={{ marginTop: "auto", fontSize: 22, opacity: 0.7 }}>{footer}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

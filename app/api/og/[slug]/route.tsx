import { ImageResponse } from "next/og";
import { getChapterBySlug } from "@/lib/content";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const doc = await getChapterBySlug(slug);
  if (!doc) return new Response("Not found", { status: 404 });
  const fm = doc.frontmatter;
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
        <div style={{ fontSize: 28, opacity: 0.8 }}>Chapter {fm.order}</div>
        <div style={{ fontSize: 52, fontWeight: 800, marginTop: 12 }}>{fm.title}</div>
        <div style={{ fontSize: 24, marginTop: 16, opacity: 0.85 }}>{fm.subtitle ?? ""}</div>
        <div style={{ marginTop: "auto", fontSize: 22, opacity: 0.7 }}>Spec {fm.specVersion}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

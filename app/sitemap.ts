import type { MetadataRoute } from "next";
import { getAllAgentcoreChapters } from "@/lib/agentcore-content";
import { getAllChapters } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [chapters, acChapters] = await Promise.all([getAllChapters(), getAllAgentcoreChapters()]);
  const staticRoutes = [
    "",
    "/chapters",
    "/labs",
    "/challenges",
    "/reference",
    "/security",
    "/capstone",
    "/about",
    "/playground",
    "/inspector",
    "/anti-patterns",
    "/agentcore",
    "/agentcore/chapters",
    "/agentcore/labs",
    "/agentcore/challenges",
    "/agentcore/reference",
    "/agentcore/playbook",
    "/agentcore/capstone",
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
  const ch = chapters.map((c) => ({
    url: `${base}/chapters/${c.frontmatter.slug}`,
    lastModified: new Date(c.frontmatter.lastReviewed),
  }));
  const ac = acChapters.map((c) => ({
    url: `${base}/agentcore/chapters/${c.frontmatter.slug}`,
    lastModified: new Date(c.frontmatter.lastReviewed),
  }));
  return [...staticRoutes, ...ch, ...ac];
}

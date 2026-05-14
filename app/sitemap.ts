import type { MetadataRoute } from "next";
import { getAllChapters } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const chapters = await getAllChapters();
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
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
  const ch = chapters.map((c) => ({
    url: `${base}/chapters/${c.frontmatter.slug}`,
    lastModified: new Date(c.frontmatter.lastReviewed),
  }));
  return [...staticRoutes, ...ch];
}

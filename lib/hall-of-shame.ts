import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { CHAPTERS_DIR } from "@/lib/content-paths";
import type { HallOfShameEntry } from "@/lib/types";

const BLOCK_RE =
  /<HallOfShame\b([^>]*)>([\s\S]*?)<\/HallOfShame>/gi;

function parseAttrs(raw: string): { tag: string; title?: string } {
  const tagM = /tag\s*=\s*["']([^"']+)["']/.exec(raw);
  const titleM = /title\s*=\s*["']([^"']+)["']/.exec(raw);
  const out: { tag: string; title?: string } = { tag: tagM?.[1] ?? "general" };
  const title = titleM?.[1];
  if (title !== undefined) {
    out.title = title;
  }
  return out;
}

export async function collectHallOfShameFromDisk(): Promise<HallOfShameEntry[]> {
  const files = await fs.readdir(CHAPTERS_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const out: HallOfShameEntry[] = [];
  for (const file of mdxFiles) {
    const full = path.join(CHAPTERS_DIR, file);
    const raw = await fs.readFile(full, "utf8");
    const { data, content } = matter(raw);
    const slug = typeof data.slug === "string" ? data.slug : file.replace(/\.mdx$/, "");
    const chapterTitle = typeof data.title === "string" ? data.title : slug;
    let m: RegExpExecArray | null;
    const re = new RegExp(BLOCK_RE.source, BLOCK_RE.flags);
    while ((m = re.exec(content)) !== null) {
      const attrs = parseAttrs(m[1] ?? "");
      const entry: HallOfShameEntry = {
        tag: attrs.tag,
        chapterSlug: slug,
        chapterTitle,
        bodyMarkdown: (m[2] ?? "").trim(),
      };
      if (attrs.title !== undefined) {
        entry.title = attrs.title;
      }
      out.push(entry);
    }
  }
  return out.sort((a, b) => a.tag.localeCompare(b.tag) || a.chapterSlug.localeCompare(b.chapterSlug));
}

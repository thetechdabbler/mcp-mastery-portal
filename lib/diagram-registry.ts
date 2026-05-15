import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { CHAPTERS_DIR, SECURITY_PLAYBOOK_PATH } from "@/lib/content-paths";

export type DiagramEntry = {
  id: string;
  chapterSlug: string;
  chapterTitle: string;
};

const ID_RE = /<Diagram\b[^>]*\bid=["']([^"']+)["']/gi;

function collectIdsFromMdxContent(content: string, chapterSlug: string, chapterTitle: string, out: DiagramEntry[]) {
  let m: RegExpExecArray | null;
  const re = new RegExp(ID_RE.source, ID_RE.flags);
  while ((m = re.exec(content)) !== null) {
    const id = m[1];
    if (id) out.push({ id, chapterSlug, chapterTitle });
  }
}

export async function collectDiagramIds(): Promise<DiagramEntry[]> {
  const out: DiagramEntry[] = [];
  const files = await fs.readdir(CHAPTERS_DIR);
  for (const file of files.filter((f) => f.endsWith(".mdx"))) {
    const full = path.join(CHAPTERS_DIR, file);
    const raw = await fs.readFile(full, "utf8");
    const { data, content } = matter(raw);
    const slug = typeof data.slug === "string" ? data.slug : file.replace(/\.mdx$/, "");
    const chapterTitle = typeof data.title === "string" ? data.title : slug;
    collectIdsFromMdxContent(content, slug, chapterTitle, out);
  }

  const playbookPath = SECURITY_PLAYBOOK_PATH;
  try {
    const raw = await fs.readFile(playbookPath, "utf8");
    const { content } = matter(raw);
    collectIdsFromMdxContent(content, "security-playbook", "Security Playbook", out);
  } catch {
    // optional file
  }
  return out;
}

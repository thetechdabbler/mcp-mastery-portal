import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  CHALLENGES_DIR,
  CHALLENGES_MANIFEST_DIR,
  CHAPTERS_DIR,
  LABS_DIR,
} from "@/lib/content-paths";
import {
  type ChallengeManifest,
  challengeManifestSchema,
  chapterFrontmatterSchema,
  type ChapterDoc,
  type ChapterFrontmatter,
} from "@/lib/types";

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

export async function getChapterSlugs(): Promise<string[]> {
  const files = await readDirSafe(CHAPTERS_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

export async function getChapterBySlug(slug: string): Promise<ChapterDoc | null> {
  const filePath = path.join(CHAPTERS_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = chapterFrontmatterSchema.parse(data);
    if (frontmatter.slug !== slug) {
      throw new Error(`Frontmatter slug mismatch for ${slug}`);
    }
    return { frontmatter, body: content.trim(), filePath };
  } catch {
    return null;
  }
}

export async function getAllChapters(): Promise<ChapterDoc[]> {
  const slugs = await getChapterSlugs();
  const out: ChapterDoc[] = [];
  for (const slug of slugs) {
    const doc = await getChapterBySlug(slug);
    if (doc) out.push(doc);
  }
  out.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  return out;
}

export function getAdjacentChapters(
  chapters: ChapterDoc[],
  slug: string,
): { prev?: ChapterDoc; next?: ChapterDoc } {
  const idx = chapters.findIndex((c) => c.frontmatter.slug === slug);
  if (idx < 0) return {};
  const out: { prev?: ChapterDoc; next?: ChapterDoc } = {};
  if (idx > 0) {
    const p = chapters[idx - 1];
    if (p) out.prev = p;
  }
  if (idx < chapters.length - 1) {
    const n = chapters[idx + 1];
    if (n) out.next = n;
  }
  return out;
}

export type LabMeta = {
  slug: string;
  title: string;
  dirName: string;
  readme: string;
  starterCode: string;
};

export async function getLabSlugs(): Promise<string[]> {
  const dirs = await readDirSafe(LABS_DIR);
  return dirs.filter((d) => d.startsWith("lab-")).sort();
}

export async function getLabBySlug(slug: string): Promise<LabMeta | null> {
  const dirs = await readDirSafe(LABS_DIR);
  const dirName =
    dirs.find((d) => d === slug) ??
    dirs.find((d) => d.replace(/^lab-\d+-/, "") === slug) ??
    dirs.find((d) => d.includes(slug));
  if (!dirName) return null;
  const base = path.join(LABS_DIR, dirName);
  let readme = "";
  let starterCode = "";
  try {
    readme = await fs.readFile(path.join(base, "README.md"), "utf8");
  } catch {
    readme = "_No README yet._";
  }
  try {
    starterCode = await fs.readFile(path.join(base, "src", "server.ts"), "utf8");
  } catch {
    starterCode = "// starter not found";
  }
  const title = dirName
    .replace(/^lab-\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { slug: dirName, title, dirName, readme, starterCode };
}

export async function getAllLabs(): Promise<LabMeta[]> {
  const slugs = await getLabSlugs();
  const labs: LabMeta[] = [];
  for (const s of slugs) {
    const lab = await getLabBySlug(s);
    if (lab) labs.push(lab);
  }
  return labs.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getChallengeManifests(): Promise<ChallengeManifest[]> {
  const files = await readDirSafe(CHALLENGES_MANIFEST_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const out: ChallengeManifest[] = [];
  for (const f of jsonFiles.sort()) {
    const raw = await fs.readFile(path.join(CHALLENGES_MANIFEST_DIR, f), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    out.push(challengeManifestSchema.parse(parsed));
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getChallengeBySlug(slug: string): Promise<ChallengeManifest | null> {
  const all = await getChallengeManifests();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function readChallengeReadme(slug: string): Promise<string> {
  const manifest = await getChallengeBySlug(slug);
  if (!manifest) return "";
  const readmePath = path.join(CHALLENGES_DIR, manifest.packageDir, "README.md");
  try {
    return await fs.readFile(readmePath, "utf8");
  } catch {
    return "";
  }
}

export function isChapterStale(fm: ChapterFrontmatter): boolean {
  const d = new Date(fm.lastReviewed);
  if (Number.isNaN(d.getTime())) return true;
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return days > 180;
}

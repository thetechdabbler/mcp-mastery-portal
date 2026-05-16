import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  AGENTCORE_CHALLENGES_DIR,
  AGENTCORE_CHALLENGES_MANIFEST_DIR,
  AGENTCORE_CHAPTERS_DIR,
  AGENTCORE_LABS_DIR,
} from "@/lib/content-paths";
import {
  type AgentcoreChapterDoc,
  type AgentcoreChapterFrontmatter,
  agentcoreChapterFrontmatterSchema,
  type ChallengeManifest,
  challengeManifestSchema,
} from "@/lib/types";

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

async function readFirstPythonFile(dir: string): Promise<string> {
  const srcDir = path.join(dir, "src");
  try {
    const files = await fs.readdir(srcDir);
    const py = files.find((f) => f.endsWith(".py"));
    if (py) return await fs.readFile(path.join(srcDir, py), "utf8");
  } catch {
    // fall through
  }
  return "# starter not found";
}

export async function getAgentcoreChapterSlugs(): Promise<string[]> {
  const files = await readDirSafe(AGENTCORE_CHAPTERS_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

export async function getAgentcoreChapterBySlug(slug: string): Promise<AgentcoreChapterDoc | null> {
  const filePath = path.join(AGENTCORE_CHAPTERS_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = agentcoreChapterFrontmatterSchema.parse(data);
    if (frontmatter.slug !== slug) {
      throw new Error(`Frontmatter slug mismatch for ${slug}`);
    }
    return { frontmatter, body: content.trim(), filePath };
  } catch {
    return null;
  }
}

export async function getAllAgentcoreChapters(): Promise<AgentcoreChapterDoc[]> {
  const slugs = await getAgentcoreChapterSlugs();
  const out: AgentcoreChapterDoc[] = [];
  for (const slug of slugs) {
    const doc = await getAgentcoreChapterBySlug(slug);
    if (doc) out.push(doc);
  }
  out.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  return out;
}

export function getAdjacentAgentcoreChapters(
  chapters: AgentcoreChapterDoc[],
  slug: string,
): { prev?: AgentcoreChapterDoc; next?: AgentcoreChapterDoc } {
  const idx = chapters.findIndex((c) => c.frontmatter.slug === slug);
  if (idx < 0) return {};
  const out: { prev?: AgentcoreChapterDoc; next?: AgentcoreChapterDoc } = {};
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

export type AgentcoreLabMeta = {
  slug: string;
  title: string;
  dirName: string;
  readme: string;
  starterCode: string;
  pyproject: string;
};

export async function getAgentcoreLabSlugs(): Promise<string[]> {
  const dirs = await readDirSafe(AGENTCORE_LABS_DIR);
  return dirs.filter((d) => d.startsWith("lab-")).sort();
}

export async function getAgentcoreLabBySlug(slug: string): Promise<AgentcoreLabMeta | null> {
  const dirs = await readDirSafe(AGENTCORE_LABS_DIR);
  const dirName =
    dirs.find((d) => d === slug) ??
    dirs.find((d) => d.replace(/^lab-\d+-/, "") === slug) ??
    dirs.find((d) => d.includes(slug));
  if (!dirName) return null;
  const base = path.join(AGENTCORE_LABS_DIR, dirName);
  let readme = "";
  let pyproject = "";
  try {
    readme = await fs.readFile(path.join(base, "README.md"), "utf8");
  } catch {
    readme = "_No README yet._";
  }
  try {
    pyproject = await fs.readFile(path.join(base, "pyproject.toml"), "utf8");
  } catch {
    pyproject = "# pyproject.toml not found";
  }
  const starterCode = await readFirstPythonFile(base);
  const title = dirName
    .replace(/^lab-\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { slug: dirName, title, dirName, readme, starterCode, pyproject };
}

export async function getAllAgentcoreLabs(): Promise<AgentcoreLabMeta[]> {
  const slugs = await getAgentcoreLabSlugs();
  const labs: AgentcoreLabMeta[] = [];
  for (const s of slugs) {
    const lab = await getAgentcoreLabBySlug(s);
    if (lab) labs.push(lab);
  }
  return labs.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getAgentcoreChallengeManifests(): Promise<ChallengeManifest[]> {
  const files = await readDirSafe(AGENTCORE_CHALLENGES_MANIFEST_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const out: ChallengeManifest[] = [];
  for (const f of jsonFiles.sort()) {
    const raw = await fs.readFile(path.join(AGENTCORE_CHALLENGES_MANIFEST_DIR, f), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    out.push(challengeManifestSchema.parse(parsed));
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getAgentcoreChallengeBySlug(slug: string): Promise<ChallengeManifest | null> {
  const all = await getAgentcoreChallengeManifests();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function readAgentcoreChallengeReadme(slug: string): Promise<string> {
  const manifest = await getAgentcoreChallengeBySlug(slug);
  if (!manifest) return "";
  const readmePath = path.join(AGENTCORE_CHALLENGES_DIR, manifest.packageDir, "README.md");
  try {
    return await fs.readFile(readmePath, "utf8");
  } catch {
    return "";
  }
}

export function isAgentcoreChapterStale(fm: AgentcoreChapterFrontmatter): boolean {
  const d = new Date(fm.lastReviewed);
  if (Number.isNaN(d.getTime())) return true;
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return days > 180;
}

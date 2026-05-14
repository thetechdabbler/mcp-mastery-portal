import {
  getAllChapters,
  getAllLabs,
  getChallengeManifests,
} from "@/lib/content";

export type SearchHit = {
  type: "chapter" | "lab" | "challenge";
  title: string;
  href: string;
  snippet: string;
};

export async function localSearch(query: string): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  const chapters = await getAllChapters();
  for (const c of chapters) {
    const hay = `${c.frontmatter.title} ${c.body}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        type: "chapter",
        title: c.frontmatter.title,
        href: `/chapters/${c.frontmatter.slug}`,
        snippet: c.body.slice(0, 140).replace(/\s+/g, " "),
      });
    }
  }
  const labs = await getAllLabs();
  for (const l of labs) {
    const hay = `${l.title} ${l.readme}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        type: "lab",
        title: l.title,
        href: `/labs/${l.slug}`,
        snippet: l.readme.slice(0, 140).replace(/\s+/g, " "),
      });
    }
  }
  const challenges = await getChallengeManifests();
  for (const ch of challenges) {
    const hay = `${ch.title} ${ch.summary}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        type: "challenge",
        title: ch.title,
        href: `/challenges/${ch.slug}`,
        snippet: ch.summary,
      });
    }
  }
  return hits.slice(0, 24);
}

import {
  getAllChapters,
  getAllLabs,
  getChallengeManifests,
} from "@/lib/content";
import {
  getAgentcoreChallengeManifests,
  getAllAgentcoreChapters,
  getAllAgentcoreLabs,
} from "@/lib/agentcore-content";

export type SearchHit = {
  type: "chapter" | "lab" | "challenge";
  track: "mcp" | "agentcore";
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
        track: "mcp",
        title: c.frontmatter.title,
        href: `/chapters/${c.frontmatter.slug}`,
        snippet: c.body.slice(0, 140).replace(/\s+/g, " "),
      });
    }
  }

  const acChapters = await getAllAgentcoreChapters();
  for (const c of acChapters) {
    const hay = `${c.frontmatter.title} ${c.body}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        type: "chapter",
        track: "agentcore",
        title: c.frontmatter.title,
        href: `/agentcore/chapters/${c.frontmatter.slug}`,
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
        track: "mcp",
        title: l.title,
        href: `/labs/${l.slug}`,
        snippet: l.readme.slice(0, 140).replace(/\s+/g, " "),
      });
    }
  }

  const acLabs = await getAllAgentcoreLabs();
  for (const l of acLabs) {
    const hay = `${l.title} ${l.readme}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        type: "lab",
        track: "agentcore",
        title: l.title,
        href: `/agentcore/labs/${l.slug}`,
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
        track: "mcp",
        title: ch.title,
        href: `/challenges/${ch.slug}`,
        snippet: ch.summary,
      });
    }
  }

  const acChallenges = await getAgentcoreChallengeManifests();
  for (const ch of acChallenges) {
    const hay = `${ch.title} ${ch.summary}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        type: "challenge",
        track: "agentcore",
        title: ch.title,
        href: `/agentcore/challenges/${ch.slug}`,
        snippet: ch.summary,
      });
    }
  }

  return hits.slice(0, 32);
}

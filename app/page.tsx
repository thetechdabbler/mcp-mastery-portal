import fs from "node:fs/promises";
import { PortalHub, type TrackHubStats } from "@/components/portal-hub";
import {
  getAgentcoreChallengeManifests,
  getAllAgentcoreChapters,
  getAllAgentcoreLabs,
} from "@/lib/agentcore-content";
import {
  getLangchainChallengeManifests,
  getAllLangchainChapters,
  getAllLangchainLabs,
} from "@/lib/langchain-content";
import { getAllChapters, getAllLabs, getChallengeManifests } from "@/lib/content";
import { AGENTCORE_TAGLINES_PATH, CONTENT_ROOT, LANGCHAIN_TAGLINES_PATH } from "@/lib/content-paths";
import path from "node:path";

async function randomTagline(filePath: string, fallback: string): Promise<string> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const taglines = JSON.parse(raw) as string[];
    return taglines[Math.floor(Math.random() * taglines.length)] ?? fallback;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [
    mcpChapters,
    mcpLabs,
    mcpChallenges,
    acChapters,
    acLabs,
    acChallenges,
    lcChapters,
    lcLabs,
    lcChallenges,
  ] = await Promise.all([
    getAllChapters(),
    getAllLabs(),
    getChallengeManifests(),
    getAllAgentcoreChapters(),
    getAllAgentcoreLabs(),
    getAgentcoreChallengeManifests(),
    getAllLangchainChapters(),
    getAllLangchainLabs(),
    getLangchainChallengeManifests(),
  ]);

  const mcpTaglinesPath = path.join(CONTENT_ROOT, "taglines.json");
  const stats: TrackHubStats[] = [
    {
      id: "mcp",
      chapters: mcpChapters.length,
      labs: mcpLabs.length,
      challenges: mcpChallenges.length,
      tagline: await randomTagline(mcpTaglinesPath, "MCP Mastery Portal"),
    },
    {
      id: "agentcore",
      chapters: acChapters.length,
      labs: acLabs.length,
      challenges: acChallenges.length,
      tagline: await randomTagline(AGENTCORE_TAGLINES_PATH, "Multi-Agent AgentCore Track"),
    },
    {
      id: "langchain",
      chapters: lcChapters.length,
      labs: lcLabs.length,
      challenges: lcChallenges.length,
      tagline: await randomTagline(LANGCHAIN_TAGLINES_PATH, "Runnables are not optional."),
    },
  ];

  return <PortalHub stats={stats} />;
}

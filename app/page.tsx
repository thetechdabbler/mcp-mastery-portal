import fs from "node:fs/promises";
import { PortalHub, type TrackHubStats } from "@/components/portal-hub";
import {
  getAgentcoreChallengeManifests,
  getAllAgentcoreChapters,
  getAllAgentcoreLabs,
} from "@/lib/agentcore-content";
import { getAllChapters, getAllLabs, getChallengeManifests } from "@/lib/content";
import { AGENTCORE_TAGLINES_PATH, CONTENT_ROOT } from "@/lib/content-paths";
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
  const [mcpChapters, mcpLabs, mcpChallenges, acChapters, acLabs, acChallenges] = await Promise.all([
    getAllChapters(),
    getAllLabs(),
    getChallengeManifests(),
    getAllAgentcoreChapters(),
    getAllAgentcoreLabs(),
    getAgentcoreChallengeManifests(),
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
  ];

  return <PortalHub stats={stats} />;
}

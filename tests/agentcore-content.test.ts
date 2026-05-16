import { describe, expect, it } from "vitest";
import {
  getAgentcoreChapterBySlug,
  getAllAgentcoreChapters,
  getAllAgentcoreLabs,
  getAgentcoreChallengeManifests,
} from "@/lib/agentcore-content";
import { collectAgentcoreDiagramIds } from "@/lib/agentcore-diagram-registry";
import { collectDiagramIds } from "@/lib/diagram-registry";

describe("agentcore content", () => {
  it("loads 10 chapters with agentcore track", async () => {
    const chapters = await getAllAgentcoreChapters();
    expect(chapters.length).toBe(10);
    expect(chapters[0]?.frontmatter.track).toBe("agentcore");
    expect(chapters[0]?.frontmatter.agentcoreFeatures.length).toBeGreaterThan(0);
  });

  it("resolves chapter by slug", async () => {
    const doc = await getAgentcoreChapterBySlug("01-multi-agent-primer");
    expect(doc?.frontmatter.title).toContain("Multi-Agent");
  });

  it("lists labs and python challenges", async () => {
    const labs = await getAllAgentcoreLabs();
    expect(labs.length).toBe(10);
    const challenges = await getAgentcoreChallengeManifests();
    expect(challenges.length).toBe(12);
    expect(challenges.every((c) => c.runner === "python")).toBe(true);
  });

  it("has globally unique diagram ids across MCP and AgentCore tracks", async () => {
    const mcp = await collectDiagramIds();
    const ac = await collectAgentcoreDiagramIds();
    const ids = new Set<string>();
    for (const d of [...mcp, ...ac]) {
      expect(ids.has(d.id), `duplicate diagram id: ${d.id}`).toBe(false);
      ids.add(d.id);
    }
  });
});

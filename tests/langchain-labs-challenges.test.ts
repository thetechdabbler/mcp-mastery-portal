import { describe, expect, it } from "vitest";
import { getAllLangchainLabs, getLangchainChallengeManifests } from "@/lib/langchain-content";

describe("langchain labs and challenges", () => {
  it("lists four offline labs", async () => {
    const labs = await getAllLangchainLabs();
    expect(labs.length).toBe(4);
    expect(labs.every((l) => l.slug.startsWith("lab-"))).toBe(true);
  });

  it("lists four python challenges with manifests", async () => {
    const challenges = await getLangchainChallengeManifests();
    expect(challenges.length).toBe(4);
    expect(challenges.every((c) => c.runner === "python")).toBe(true);
    const slugs = new Set(challenges.map((c) => c.slug));
    expect(slugs.has("runnable-contract")).toBe(true);
    expect(slugs.has("rag-citations")).toBe(true);
    expect(slugs.has("hitl-approval")).toBe(true);
    expect(slugs.has("capstone-assistant")).toBe(true);
  });
});

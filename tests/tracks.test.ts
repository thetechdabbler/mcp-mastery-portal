import { describe, expect, it } from "vitest";
import {
  describeDestinationPath,
  getTrackFromPathname,
  isTrackSwitchFallback,
  needsTrackSwitchConfirm,
  translatePathToTrack,
} from "@/lib/tracks";

describe("translatePathToTrack", () => {
  it("maps agentcore chapters index to mcp chapters", () => {
    expect(translatePathToTrack("/agentcore/chapters", "mcp")).toBe("/chapters");
  });

  it("maps agentcore chapter slug to mcp chapter path", () => {
    expect(translatePathToTrack("/agentcore/chapters/01-multi-agent-primer", "mcp")).toBe(
      "/chapters/01-multi-agent-primer",
    );
  });

  it("maps mcp labs to agentcore labs", () => {
    expect(translatePathToTrack("/labs", "agentcore")).toBe("/agentcore/labs");
  });

  it("maps portal hubs", () => {
    expect(translatePathToTrack("/", "agentcore")).toBe("/agentcore");
    expect(translatePathToTrack("/", "langchain")).toBe("/langchain");
    expect(translatePathToTrack("/agentcore", "mcp")).toBe("/");
    expect(translatePathToTrack("/langchain", "mcp")).toBe("/");
  });

  it("falls back mcp-only routes to agentcore chapters", () => {
    expect(translatePathToTrack("/security", "agentcore")).toBe("/agentcore/chapters");
    expect(translatePathToTrack("/playground", "agentcore")).toBe("/agentcore/chapters");
  });

  it("falls back agentcore playbook to mcp chapters", () => {
    expect(translatePathToTrack("/agentcore/playbook", "mcp")).toBe("/chapters");
  });

  it("maps langchain chapters to other tracks", () => {
    expect(translatePathToTrack("/langchain/chapters/13-security-and-guardrails", "mcp")).toBe(
      "/chapters/13-security-and-guardrails",
    );
    expect(translatePathToTrack("/langchain/chapters/13-security-and-guardrails", "agentcore")).toBe(
      "/agentcore/chapters/13-security-and-guardrails",
    );
  });

  it("falls back missing langchain sections to target chapters", () => {
    expect(translatePathToTrack("/playground", "langchain")).toBe("/langchain/chapters");
    expect(translatePathToTrack("/langchain/playbook", "mcp")).toBe("/chapters");
  });

  it("returns same path when already on target track", () => {
    expect(translatePathToTrack("/chapters", "mcp")).toBe("/chapters");
  });
});

describe("getTrackFromPathname", () => {
  it("detects agentcore prefix", () => {
    expect(getTrackFromPathname("/agentcore/chapters").id).toBe("agentcore");
    expect(getTrackFromPathname("/langchain/chapters").id).toBe("langchain");
    expect(getTrackFromPathname("/chapters").id).toBe("mcp");
  });
});

describe("needsTrackSwitchConfirm", () => {
  it("requires confirm on cross-track content pages", () => {
    expect(needsTrackSwitchConfirm("/agentcore/chapters", "mcp")).toBe(true);
  });

  it("skips confirm on hub paths", () => {
    expect(needsTrackSwitchConfirm("/", "agentcore")).toBe(false);
    expect(needsTrackSwitchConfirm("/", "langchain")).toBe(false);
    expect(needsTrackSwitchConfirm("/agentcore", "mcp")).toBe(false);
    expect(needsTrackSwitchConfirm("/langchain", "mcp")).toBe(false);
  });
});

describe("isTrackSwitchFallback", () => {
  it("detects security to agentcore fallback", () => {
    expect(isTrackSwitchFallback("/security", "agentcore")).toBe(true);
    expect(isTrackSwitchFallback("/security", "langchain")).toBe(true);
  });

  it("detects direct chapter mapping as non-fallback", () => {
    expect(isTrackSwitchFallback("/agentcore/chapters", "mcp")).toBe(false);
  });
});

describe("describeDestinationPath", () => {
  it("labels destination chapters", () => {
    const d = describeDestinationPath("/agentcore/chapters", "mcp");
    expect(d.sectionLabel).toBe("Chapters");
  });
});

export type TrackId = "mcp" | "agentcore";

export type TrackLink = { href: string; label: string };

export type TrackConfig = {
  id: TrackId;
  label: string;
  shortLabel: string;
  description: string;
  homeHref: string;
  startHref: string;
  chaptersIndexHref: string;
  links: TrackLink[];
};

export const PREFERRED_TRACK_STORAGE_KEY = "mcp-mastery-preferred-track";

export const TRACKS: TrackConfig[] = [
  {
    id: "mcp",
    label: "MCP Mastery",
    shortLabel: "MCP",
    description: "Model Context Protocol from zero to production — tools, resources, prompts, and security.",
    homeHref: "/",
    startHref: "/chapters/01-what-is-mcp",
    chaptersIndexHref: "/chapters",
    links: [
      { href: "/chapters", label: "Chapters" },
      { href: "/labs", label: "Labs" },
      { href: "/challenges", label: "Challenges" },
      { href: "/reference", label: "Reference" },
      { href: "/security", label: "Security" },
      { href: "/capstone", label: "Capstone" },
      { href: "/playground", label: "Playground" },
      { href: "/inspector", label: "Inspector" },
      { href: "/anti-patterns", label: "Anti-patterns" },
    ],
  },
  {
    id: "agentcore",
    label: "Multi-Agent (AgentCore)",
    shortLabel: "AgentCore",
    description: "LangGraph orchestration on AWS Bedrock AgentCore with MCP tool integration.",
    homeHref: "/agentcore",
    startHref: "/agentcore/chapters/01-multi-agent-primer",
    chaptersIndexHref: "/agentcore/chapters",
    links: [
      { href: "/agentcore/chapters", label: "Chapters" },
      { href: "/agentcore/labs", label: "Labs" },
      { href: "/agentcore/challenges", label: "Challenges" },
      { href: "/agentcore/reference", label: "Reference" },
      { href: "/agentcore/playbook", label: "Playbook" },
      { href: "/agentcore/capstone", label: "Capstone" },
    ],
  },
];

const TRACK_BY_ID = new Map(TRACKS.map((t) => [t.id, t]));

export const DEFAULT_TRACK_ID: TrackId = "mcp";

export function getTrack(id: TrackId): TrackConfig {
  const track = TRACK_BY_ID.get(id);
  if (!track) throw new Error(`Unknown track: ${id}`);
  return track;
}

export function isTrackId(value: string): value is TrackId {
  return TRACK_BY_ID.has(value as TrackId);
}

/** Longest-prefix wins so future tracks like `/agentcore-pro` do not collide. */
export function getTrackFromPathname(pathname: string): TrackConfig {
  const sorted = [...TRACKS].sort((a, b) => b.homeHref.length - a.homeHref.length);
  for (const track of sorted) {
    if (track.id === "mcp") continue;
    if (pathname === track.homeHref || pathname.startsWith(`${track.homeHref}/`)) {
      return track;
    }
  }
  return getTrack("mcp");
}

export function chapterPathForTrack(trackId: TrackId, slug: string): string {
  const track = getTrack(trackId);
  return track.id === "mcp"
    ? `/chapters/${slug}`
    : `/agentcore/chapters/${slug}`;
}

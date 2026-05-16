export type TrackId = "mcp" | "agentcore" | "langchain";

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
export const SKIP_TRACK_CONFIRM_STORAGE_KEY = "mcp-mastery-skip-track-confirm";

/** Portal hubs where track choice is intentional — no confirm dialog. */
export const TRACK_HUB_PATHS = ["/", "/agentcore", "/langchain"] as const;

const SECTION_LABELS: Record<string, string> = {
  chapters: "Chapters",
  labs: "Labs",
  challenges: "Challenges",
  reference: "Reference",
  security: "Security",
  capstone: "Capstone",
  playground: "Playground",
  inspector: "Inspector",
  "anti-patterns": "Anti-patterns",
  playbook: "Playbook",
};

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
  {
    id: "langchain",
    label: "LangChain & LangGraph",
    shortLabel: "LangChain",
    description: "Zero to hero with LangChain and LangGraph — runnables, retrieval, agents, and production.",
    homeHref: "/langchain",
    startHref: "/langchain/chapters/01-what-is-langchain",
    chaptersIndexHref: "/langchain/chapters",
    links: [
      { href: "/langchain/chapters", label: "Chapters" },
      { href: "/langchain/labs", label: "Labs" },
      { href: "/langchain/challenges", label: "Challenges" },
      { href: "/langchain/reference", label: "Reference" },
      { href: "/langchain/playbook", label: "Playbook" },
      { href: "/langchain/capstone", label: "Capstone" },
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
  return track.id === "mcp" ? `/chapters/${slug}` : `${track.homeHref}/chapters/${slug}`;
}

function pathSuffix(pathname: string): string {
  const current = getTrackFromPathname(pathname);
  if (current.id !== "mcp") {
    if (pathname === current.homeHref) return "";
    return pathname.slice(current.homeHref.length) || "";
  }
  return pathname === "/" ? "" : pathname;
}

function buildPathFromSuffix(suffix: string, targetTrackId: TrackId): string {
  const track = getTrack(targetTrackId);
  if (targetTrackId !== "mcp") {
    if (!suffix) return track.homeHref;
    return `${track.homeHref}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
  }
  if (!suffix) return track.homeHref;
  return suffix;
}

function sectionKeyForTrack(pathname: string, track: TrackConfig): string | undefined {
  const suffix =
    track.id === "mcp"
      ? pathname === "/"
        ? ""
        : pathname
      : pathname === track.homeHref
        ? ""
        : pathname.slice(track.homeHref.length);
  return suffix.split("/").filter(Boolean)[0];
}

function targetTrackHasSection(targetTrack: TrackConfig, sectionKey: string | undefined): boolean {
  if (!sectionKey) return true;
  return targetTrack.links.some((link) => sectionKeyForTrack(link.href, targetTrack) === sectionKey);
}

function applyCrossTrackFallbacks(
  pathname: string,
  targetTrackId: TrackId,
  candidate: string,
): string {
  const current = getTrackFromPathname(pathname);
  if (current.id === targetTrackId) return pathname;
  const target = getTrack(targetTrackId);
  if (!targetTrackHasSection(target, sectionKeyForTrack(candidate, target))) return target.chaptersIndexHref;

  return candidate;
}

/** Map current URL to the equivalent path on another track (with section fallbacks). */
export function translatePathToTrack(pathname: string, targetTrackId: TrackId): string {
  const current = getTrackFromPathname(pathname);
  if (current.id === targetTrackId) return pathname;
  const suffix = pathSuffix(pathname);
  const candidate = buildPathFromSuffix(suffix, targetTrackId);
  return applyCrossTrackFallbacks(pathname, targetTrackId, candidate);
}

/** True when translation uses a chapters-index fallback instead of a direct section map. */
export function isTrackSwitchFallback(pathname: string, targetTrackId: TrackId): boolean {
  const current = getTrackFromPathname(pathname);
  if (current.id === targetTrackId) return false;
  const suffix = pathSuffix(pathname);
  const direct = buildPathFromSuffix(suffix, targetTrackId);
  return translatePathToTrack(pathname, targetTrackId) !== direct;
}

export function isTrackHubPath(pathname: string): boolean {
  return (TRACK_HUB_PATHS as readonly string[]).includes(pathname);
}

export function needsTrackSwitchConfirm(pathname: string, targetTrackId: TrackId): boolean {
  const current = getTrackFromPathname(pathname);
  if (current.id === targetTrackId) return false;
  if (isTrackHubPath(pathname)) return false;
  return true;
}

export type PathDescription = {
  sectionLabel: string;
  destinationLabel: string;
};

export function describePathForTrack(pathname: string): PathDescription {
  const parts = pathname.split("/").filter(Boolean);
  const current = getTrackFromPathname(pathname);
  const offset = current.id === "mcp" ? 0 : 1;
  const sectionKey = parts[offset];
  const sectionLabel = sectionKey
    ? (SECTION_LABELS[sectionKey] ?? sectionKey.replace(/-/g, " "))
    : "Home";
  const slug = parts[offset + 1];
  const detail =
    sectionKey === "chapters" && slug
      ? ` (${slug})`
      : sectionKey === "labs" || sectionKey === "challenges"
        ? slug
          ? ` (${slug})`
          : ""
        : "";
  return {
    sectionLabel: `${sectionLabel}${detail}`,
    destinationLabel: sectionLabel,
  };
}

export function describeDestinationPath(pathname: string, targetTrackId: TrackId): PathDescription {
  const href = translatePathToTrack(pathname, targetTrackId);
  return describePathForTrack(href);
}

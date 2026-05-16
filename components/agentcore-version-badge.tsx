import { Badge } from "@/components/ui/badge";
import type { AgentcoreChapterFrontmatter } from "@/lib/types";

export function AgentcoreVersionBadge({ fm }: { fm: AgentcoreChapterFrontmatter }) {
  const stale =
    Number.isFinite(Date.parse(fm.lastReviewed)) &&
    (Date.now() - Date.parse(fm.lastReviewed)) / (1000 * 60 * 60 * 24) > 180;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Badge variant="secondary">LangGraph {fm.langgraphVersion}</Badge>
      <Badge variant="outline">Python {fm.pythonVersion}</Badge>
      {fm.agentcoreFeatures.map((f) => (
        <Badge key={f} variant="outline">
          {f}
        </Badge>
      ))}
      <Badge variant="outline">Reviewed {fm.lastReviewed}</Badge>
      {stale ? (
        <Badge variant="destructive">Stale review (&gt;180d) — verify against latest AgentCore docs</Badge>
      ) : null}
    </div>
  );
}
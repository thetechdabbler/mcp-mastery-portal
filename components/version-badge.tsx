import { Badge } from "@/components/ui/badge";
import type { ChapterFrontmatter } from "@/lib/types";

export function VersionBadge({ fm }: { fm: ChapterFrontmatter }) {
  const stale =
    Number.isFinite(Date.parse(fm.lastReviewed)) &&
    (Date.now() - Date.parse(fm.lastReviewed)) / (1000 * 60 * 60 * 24) > 180;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Badge variant="secondary">Spec {fm.specVersion}</Badge>
      <Badge variant="outline">SDK {fm.sdkVersion}</Badge>
      <Badge variant="outline">Reviewed {fm.lastReviewed}</Badge>
      {stale ? (
        <Badge variant="destructive">Stale review (&gt;180d) — verify against latest spec</Badge>
      ) : null}
    </div>
  );
}

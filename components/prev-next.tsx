import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ChapterDoc } from "@/lib/types";

export function PrevNext({ prev, next }: { prev?: ChapterDoc | undefined; next?: ChapterDoc | undefined }) {
  return (
    <div className="mt-10 flex flex-wrap justify-between gap-3 border-t pt-6">
      {prev ? (
        <Button asChild variant="outline">
          <Link href={`/chapters/${prev.frontmatter.slug}`}>← {prev.frontmatter.title}</Link>
        </Button>
      ) : (
        <span />
      )}
      {next ? (
        <Button asChild variant="outline">
          <Link href={`/chapters/${next.frontmatter.slug}`}>{next.frontmatter.title} →</Link>
        </Button>
      ) : null}
    </div>
  );
}

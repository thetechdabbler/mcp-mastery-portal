import Link from "next/link";
import { Button } from "@/components/ui/button";

type ChapterLike = { frontmatter: { slug: string; title: string } };

export function PrevNext({
  prev,
  next,
  basePath = "/chapters",
}: {
  prev?: ChapterLike | undefined;
  next?: ChapterLike | undefined;
  basePath?: string;
}) {
  return (
    <div className="mt-10 flex flex-wrap justify-between gap-3 border-t pt-6">
      {prev ? (
        <Button asChild variant="outline">
          <Link href={`${basePath}/${prev.frontmatter.slug}`}>← {prev.frontmatter.title}</Link>
        </Button>
      ) : (
        <span />
      )}
      {next ? (
        <Button asChild variant="outline">
          <Link href={`${basePath}/${next.frontmatter.slug}`}>{next.frontmatter.title} →</Link>
        </Button>
      ) : null}
    </div>
  );
}

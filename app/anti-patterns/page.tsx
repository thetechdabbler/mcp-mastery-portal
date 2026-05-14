import { collectHallOfShameFromDisk } from "@/lib/hall-of-shame";
import Link from "next/link";

export const metadata = { title: "Anti-patterns" };

export default async function AntiPatternsPage() {
  const items = await collectHallOfShameFromDisk();
  const grouped = new Map<string, typeof items>();
  for (const it of items) {
    const arr = grouped.get(it.tag) ?? [];
    arr.push(it);
    grouped.set(it.tag, arr);
  }
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">32 ways to ship a bad MCP server</h1>
      <p className="mb-6 text-muted-foreground">Click any to learn how not to be #33. (Count is aspirational.)</p>
      <div className="space-y-10">
        {[...grouped.entries()].map(([tag, arr]) => (
          <section key={tag}>
            <h2 className="mb-3 text-xl font-semibold capitalize">{tag}</h2>
            <div className="space-y-4">
              {arr.map((e, i) => (
                <article key={`${e.chapterSlug}-${i}`} className="rounded-lg border bg-card p-4 text-sm">
                  <p className="mb-2 text-xs text-muted-foreground">
                    From{" "}
                    <Link className="underline" href={`/chapters/${e.chapterSlug}`}>
                      {e.chapterTitle}
                    </Link>
                  </p>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-xs">{e.bodyMarkdown}</pre>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

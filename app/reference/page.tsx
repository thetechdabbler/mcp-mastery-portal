import { collectDiagramIds } from "@/lib/diagram-registry";
import { getGlossary } from "@/lib/glossary";
import Link from "next/link";

export const metadata = { title: "Reference" };

export default async function ReferencePage() {
  const [glossary, diagrams] = await Promise.all([getGlossary(), collectDiagramIds()]);
  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Reference</h1>
        <p className="text-muted-foreground">Glossary terms (auto-linked from chapters) + diagram index.</p>
      </div>
      <section id="diagrams">
        <h2 className="mb-3 text-2xl font-semibold">Diagram atlas</h2>
        <ul className="space-y-2 text-sm">
          {diagrams.map((d) => (
            <li key={`${d.chapterSlug}-${d.id}`}>
              <Link className="underline" href={`/chapters/${d.chapterSlug}#diagram-${d.id}`}>
                {d.id}
              </Link>{" "}
              <span className="text-muted-foreground">— {d.chapterTitle}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-3 text-2xl font-semibold">Glossary</h2>
        <div className="space-y-4">
          {glossary.map((g) => (
            <div key={g.slug} id={`term-${g.slug}`} className="scroll-mt-28 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">{g.term}</h3>
              <p className="text-sm text-muted-foreground">{g.definition}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

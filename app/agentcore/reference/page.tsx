import Link from "next/link";
import { collectAgentcoreDiagramIds } from "@/lib/agentcore-diagram-registry";
import { getAgentcoreGlossary } from "@/lib/agentcore-glossary";

export const metadata = { title: "AgentCore Reference" };

export default async function AgentcoreReferencePage() {
  const [glossary, diagrams] = await Promise.all([getAgentcoreGlossary(), collectAgentcoreDiagramIds()]);
  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-3xl font-bold">AgentCore Reference</h1>
        <p className="text-muted-foreground">Glossary + diagram atlas for the multi-agent track.</p>
      </div>
      <section id="diagrams">
        <h2 className="mb-3 text-2xl font-semibold">Diagram atlas</h2>
        <ul className="space-y-2 text-sm">
          {diagrams.map((d) => (
            <li key={`${d.chapterSlug}-${d.id}`}>
              <Link className="underline" href={`/agentcore/chapters/${d.chapterSlug}#diagram-${d.id}`}>
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

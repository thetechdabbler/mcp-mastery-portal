import Link from "next/link";
import { collectLangchainDiagramIds } from "@/lib/langchain-diagram-registry";
import { getLangchainGlossary } from "@/lib/langchain-glossary";

export const metadata = { title: "LangChain & LangGraph Reference" };

export default async function LangchainReferencePage() {
  const [glossary, diagrams] = await Promise.all([getLangchainGlossary(), collectLangchainDiagramIds()]);
  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-3xl font-bold">LangChain & LangGraph Reference</h1>
        <p className="text-muted-foreground">
          Glossary, diagram atlas, and the APIs you will actually touch when the demo graduates into a system.
        </p>
      </div>
      <section>
        <h2 className="mb-3 text-2xl font-semibold">Version posture</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="border px-3 py-2">Stack</th>
                <th className="border px-3 py-2">Pinned in chapters</th>
                <th className="border px-3 py-2">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">LangChain</td>
                <td className="border px-3 py-2 font-mono">0.3.x</td>
                <td className="border px-3 py-2">Runnable-first APIs, fewer legacy chain ghosts.</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">LangGraph</td>
                <td className="border px-3 py-2 font-mono">0.2.x</td>
                <td className="border px-3 py-2">StateGraph, interrupts, checkpointers, and the good stuff.</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Python</td>
                <td className="border px-3 py-2 font-mono">3.11+</td>
                <td className="border px-3 py-2">Modern async ergonomics without pretending 3.8 is fine forever.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section id="diagrams">
        <h2 className="mb-3 text-2xl font-semibold">Diagram atlas</h2>
        <ul className="space-y-2 text-sm">
          {diagrams.map((d) => (
            <li key={`${d.chapterSlug}-${d.id}`}>
              <Link className="underline" href={`/langchain/chapters/${d.chapterSlug}#diagram-${d.id}`}>
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

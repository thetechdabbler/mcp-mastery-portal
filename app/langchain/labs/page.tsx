import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllLangchainLabs } from "@/lib/langchain-content";

export const metadata = { title: "LangChain Labs" };

export default async function LangchainLabsPage() {
  const labs = await getAllLangchainLabs();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">LangChain Labs</h1>
      <p className="mb-6 text-muted-foreground">
        Four offline arcs — Runnable contracts, toy RAG with citations, a human-in-the-loop state machine, and a stitched
        capstone assistant — each runnable with uv, each test-backed so you cannot lie with confidence.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {labs.length ? (
          labs.map((l) => (
            <Link key={l.slug} href={`/langchain/labs/${l.slug}`}>
              <Card className="h-full transition hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg">{l.title}</CardTitle>
                  <CardDescription className="font-mono text-xs">{l.slug}</CardDescription>
                </CardHeader>
                <CardContent className="line-clamp-3 text-sm text-muted-foreground">{l.readme.slice(0, 200)}</CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No labs found</CardTitle>
              <CardDescription>If this card shows up, something peeled the `lab-*` dirs off disk.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

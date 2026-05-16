import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLangchainChallengeManifests } from "@/lib/langchain-content";

export const metadata = { title: "LangChain Challenges" };

export default async function LangchainChallengesPage() {
  const challenges = await getLangchainChallengeManifests();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">LangChain Challenges</h1>
      <p className="mb-6 text-muted-foreground">
        Validators are Python, local, and rude in the best way. Run a single challenge with{" "}
        <code className="rounded bg-muted px-1">npm run challenge -- &lt;slug&gt; --track langchain</code>
        {" "}or all LangChain challenges with{" "}
        <code className="rounded bg-muted px-1">npm run challenge -- --all --track langchain</code>.
        {" "}Do not use <code className="rounded bg-muted px-1">npm run challenge -- --all</code> alone — it defaults
        to the MCP track, not LangChain.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.length ? (
          challenges.map((c) => (
            <Link key={c.slug} href={`/langchain/challenges/${c.slug}`}>
              <Card className="h-full transition hover:bg-muted/40">
                <CardHeader>
                  <div className="mb-1 flex gap-2">
                    <Badge>{c.difficulty}</Badge>
                    <Badge variant="outline">{c.runner}</Badge>
                  </div>
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                  <CardDescription>~{c.estMinutes} min</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{c.summary}</CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No challenges listed</CardTitle>
              <CardDescription>
                Manifest JSON under <code className="text-xs">content/langchain/challenges/</code> should define these —
                go fix the filesystem, not your excuses.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

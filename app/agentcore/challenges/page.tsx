import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAgentcoreChallengeManifests } from "@/lib/agentcore-content";

export const metadata = { title: "AgentCore Challenges" };

export default async function AgentcoreChallengesPage() {
  const challenges = await getAgentcoreChallengeManifests();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">AgentCore Challenges</h1>
      <p className="mb-6 text-muted-foreground">
        Run with{" "}
        <code className="rounded bg-muted px-1">npm run challenge -- &lt;slug&gt; --track agentcore</code>
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((c) => (
          <Link key={c.slug} href={`/agentcore/challenges/${c.slug}`}>
            <Card className="h-full transition hover:bg-muted/40">
              <CardHeader>
                <div className="mb-1 flex gap-2">
                  <Badge>{c.difficulty}</Badge>
                  <Badge variant="outline">python</Badge>
                </div>
                <CardTitle className="text-lg">{c.title}</CardTitle>
                <CardDescription>~{c.estMinutes} min</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{c.summary}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

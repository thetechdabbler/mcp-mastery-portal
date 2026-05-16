import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllAgentcoreChapters } from "@/lib/agentcore-content";

export const metadata = { title: "AgentCore Chapters" };

export default async function AgentcoreChaptersPage() {
  const chapters = await getAllAgentcoreChapters();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">AgentCore Chapters</h1>
      <p className="mb-6 text-muted-foreground">
        LangGraph <span className="font-mono">^0.4</span> · Python <span className="font-mono">≥3.11</span> · AWS
        Bedrock AgentCore
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((c) => (
          <Link key={c.frontmatter.slug} href={`/agentcore/chapters/${c.frontmatter.slug}`}>
            <Card className="h-full transition hover:bg-muted/40">
              <CardHeader>
                <div className="mb-1 flex flex-wrap gap-2">
                  <Badge variant="outline">#{c.frontmatter.order}</Badge>
                  <Badge>{c.frontmatter.difficulty}</Badge>
                </div>
                <CardTitle className="text-lg">{c.frontmatter.title}</CardTitle>
                <CardDescription>~{c.frontmatter.estMinutes} min</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {c.frontmatter.subtitle ?? c.frontmatter.objectives[0]}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

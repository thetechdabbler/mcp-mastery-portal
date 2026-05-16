import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllAgentcoreLabs } from "@/lib/agentcore-content";

export const metadata = { title: "AgentCore Labs" };

export default async function AgentcoreLabsPage() {
  const labs = await getAllAgentcoreLabs();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">AgentCore Labs</h1>
      <p className="mb-6 text-muted-foreground">Python workspaces (uv). Labs 1–3 are local mocks; 4–10 use AWS.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {labs.map((l) => (
          <Link key={l.slug} href={`/agentcore/labs/${l.slug}`}>
            <Card className="h-full transition hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-lg">{l.title}</CardTitle>
                <CardDescription className="font-mono text-xs">{l.slug}</CardDescription>
              </CardHeader>
              <CardContent className="line-clamp-3 text-sm text-muted-foreground">{l.readme.slice(0, 200)}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

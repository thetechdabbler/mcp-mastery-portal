import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChallengeManifests } from "@/lib/content";

export const metadata = { title: "Challenges" };

export default async function ChallengesPage() {
  const list = await getChallengeManifests();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Challenges</h1>
      <p className="mb-6 text-muted-foreground">Run validators with `npm run challenge -- &lt;slug&gt;` from repo root.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((c) => (
          <Link key={c.slug} href={`/challenges/${c.slug}`}>
            <Card className="h-full transition hover:bg-muted/40">
              <CardHeader>
                <div className="mb-1 flex gap-2">
                  <Badge>{c.difficulty}</Badge>
                  <span className="text-xs text-muted-foreground">~{c.estMinutes} min</span>
                </div>
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{c.summary}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

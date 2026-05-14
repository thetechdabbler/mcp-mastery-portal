import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllChapters } from "@/lib/content";

export const metadata = { title: "Chapters" };

export default async function ChaptersIndexPage() {
  const chapters = await getAllChapters();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Chapters</h1>
      <p className="mb-6 text-muted-foreground">
        Spec <span className="font-mono">2025-11-25</span> · SDK <span className="font-mono">^1.29</span>
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((c) => (
          <Link key={c.frontmatter.slug} href={`/chapters/${c.frontmatter.slug}`}>
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

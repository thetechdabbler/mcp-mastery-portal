import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllLabs } from "@/lib/content";

export const metadata = { title: "Labs" };

export default async function LabsPage() {
  const labs = await getAllLabs();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Labs</h1>
      <p className="mb-6 text-muted-foreground">Each lab is an npm workspace with starter and solution.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {labs.map((l) => (
          <Link key={l.slug} href={`/labs/${l.slug}`}>
            <Card className="h-full transition hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-lg">{l.title}</CardTitle>
                <Badge variant="outline">{l.slug}</Badge>
              </CardHeader>
              <CardContent className="line-clamp-4 text-sm text-muted-foreground">{l.readme}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ResumeReading } from "@/components/resume-reading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllChapters, getAllLabs, getChallengeManifests } from "@/lib/content";
import fs from "node:fs/promises";
import path from "node:path";

export default async function HomePage() {
  const [chapters, labs, challenges, taglinesRaw] = await Promise.all([
    getAllChapters(),
    getAllLabs(),
    getChallengeManifests(),
    fs.readFile(path.join(process.cwd(), "content", "taglines.json"), "utf8").catch(() => "[]"),
  ]);
  const taglines = JSON.parse(taglinesRaw) as string[];
  const tagline = taglines[Math.floor(Math.random() * taglines.length)] ?? "MCP Mastery Portal";

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Course</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">MCP Mastery Portal</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/chapters">Start at chapter 1</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/playground">Open playground</Link>
          </Button>
        </div>
      </section>
      <ResumeReading />
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{chapters.length} chapters</CardTitle>
            <CardDescription>Theory + diagrams + quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/chapters">Browse</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labs.length} labs</CardTitle>
            <CardDescription>Runnable Node workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/labs">Browse</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{challenges.length} challenges</CardTitle>
            <CardDescription>Automated validators</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/challenges">Browse</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

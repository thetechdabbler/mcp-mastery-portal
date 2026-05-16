import fs from "node:fs/promises";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLangchainChallengeManifests,
  getAllLangchainChapters,
  getAllLangchainLabs,
} from "@/lib/langchain-content";
import { LANGCHAIN_TAGLINES_PATH } from "@/lib/content-paths";

export const metadata = { title: "LangChain & LangGraph" };

export default async function LangchainHomePage() {
  const [chapters, labs, challenges, taglinesRaw] = await Promise.all([
    getAllLangchainChapters(),
    getAllLangchainLabs(),
    getLangchainChallengeManifests(),
    fs.readFile(LANGCHAIN_TAGLINES_PATH, "utf8").catch(() => "[]"),
  ]);
  const taglines = JSON.parse(taglinesRaw) as string[];
  const tagline = taglines[Math.floor(Math.random() * taglines.length)] ?? "Runnables are not optional.";

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Track</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">LangChain & LangGraph</h1>
        <p className="mt-1 text-sm text-muted-foreground">LangChain · LangGraph · LangServe · LangSmith</p>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/langchain/chapters">Start at chapter 1</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Portal home</Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{chapters.length} chapters</CardTitle>
            <CardDescription>Zero-to-hero framework theory, with fewer demo-day lies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/langchain/chapters">Browse</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labs.length} labs</CardTitle>
            <CardDescription>Coming in v2. For now, chapters include notebook-ready exercises.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/langchain/labs">Browse</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{challenges.length} challenges</CardTitle>
            <CardDescription>Validators land after the curriculum. Shocking restraint, really.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/langchain/challenges">Browse</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

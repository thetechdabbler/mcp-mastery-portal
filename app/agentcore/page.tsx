import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAgentcoreChallengeManifests,
  getAllAgentcoreChapters,
  getAllAgentcoreLabs,
} from "@/lib/agentcore-content";
import fs from "node:fs/promises";
import { AGENTCORE_TAGLINES_PATH } from "@/lib/content-paths";

export const metadata = { title: "Multi-Agent (AgentCore)" };

export default async function AgentcoreHomePage() {
  const [chapters, labs, challenges, taglinesRaw] = await Promise.all([
    getAllAgentcoreChapters(),
    getAllAgentcoreLabs(),
    getAgentcoreChallengeManifests(),
    fs.readFile(AGENTCORE_TAGLINES_PATH, "utf8").catch(() => "[]"),
  ]);
  const taglines = JSON.parse(taglinesRaw) as string[];
  const tagline = taglines[Math.floor(Math.random() * taglines.length)] ?? "Multi-Agent AgentCore Track";

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Track</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Multi-Agent Systems</h1>
        <p className="mt-1 text-sm text-muted-foreground">AWS Bedrock AgentCore · LangGraph · MCP</p>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/agentcore/chapters">Start at chapter 1</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">MCP track home</Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{chapters.length} chapters</CardTitle>
            <CardDescription>AgentCore + LangGraph theory</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/agentcore/chapters">Browse</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labs.length} labs</CardTitle>
            <CardDescription>Python (uv) workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/agentcore/labs">Browse</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{challenges.length} challenges</CardTitle>
            <CardDescription>Python validators</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/agentcore/challenges">Browse</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

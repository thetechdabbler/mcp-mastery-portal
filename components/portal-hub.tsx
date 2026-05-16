"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeReading } from "@/components/resume-reading";
import { TrackSwitcher } from "@/components/track-switcher";
import { useTrack } from "@/components/track-provider";
import { getTrack, type TrackId } from "@/lib/tracks";
import { cn } from "@/lib/utils";

export type TrackHubStats = {
  id: TrackId;
  chapters: number;
  labs: number;
  challenges: number;
  tagline: string;
};

type PortalHubProps = {
  stats: TrackHubStats[];
};

export function PortalHub({ stats }: PortalHubProps) {
  const { activeTrackId } = useTrack();

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Portal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">MCP Mastery Portal</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Choose a curriculum track. The header switcher navigates to the matching section on the other track
          (with a confirmation when you leave deep content).
        </p>
        <div className="mt-5">
          <TrackSwitcher variant="hero" navigateOnSelect />
        </div>
      </section>

      <ResumeReading />

      <section className="grid gap-4 md:grid-cols-2">
        {stats.map((s) => (
          <TrackCard key={s.id} trackStats={s} highlighted={s.id === activeTrackId} />
        ))}
      </section>

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shared tools</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/playground">Playground</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/inspector">Inspector</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/about">About</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function TrackCard({
  trackStats,
  highlighted,
}: {
  trackStats: TrackHubStats;
  highlighted: boolean;
}) {
  const track = getTrack(trackStats.id);

  return (
    <Card
      className={cn(
        "h-full transition",
        highlighted ? "border-primary ring-1 ring-primary/20" : "hover:bg-muted/40",
      )}
    >
      <CardHeader>
        <CardTitle className="text-xl">{track.label}</CardTitle>
        <CardDescription>{track.description}</CardDescription>
        <p className="pt-2 text-sm italic text-muted-foreground">{trackStats.tagline}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="grid grid-cols-3 gap-2 text-center text-sm">
          <li className="rounded-md border bg-muted/30 px-2 py-2">
            <span className="block text-lg font-bold">{trackStats.chapters}</span>
            <span className="text-xs text-muted-foreground">chapters</span>
          </li>
          <li className="rounded-md border bg-muted/30 px-2 py-2">
            <span className="block text-lg font-bold">{trackStats.labs}</span>
            <span className="text-xs text-muted-foreground">labs</span>
          </li>
          <li className="rounded-md border bg-muted/30 px-2 py-2">
            <span className="block text-lg font-bold">{trackStats.challenges}</span>
            <span className="text-xs text-muted-foreground">challenges</span>
          </li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="flex-1 sm:flex-none">
            <Link href={track.startHref}>Start chapter 1</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 sm:flex-none">
            <Link href={track.chaptersIndexHref}>Browse chapters</Link>
          </Button>
          {track.id !== "mcp" ? (
            <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto">
              <Link href={track.homeHref}>Track home</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

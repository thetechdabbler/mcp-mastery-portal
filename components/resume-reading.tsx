"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTrack } from "@/components/track-provider";
import {
  chapterPathForTrack,
  getTrack,
  type TrackId,
} from "@/lib/tracks";

const LS_KEY = "mcp-mastery-resume";

type ResumeState = {
  track: TrackId;
  slug: string;
  title: string;
  scrollY?: number;
};

export function ResumeReading() {
  const { activeTrackId } = useTrack();
  const [state, setState] = React.useState<ResumeState | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ResumeState;
      if (!parsed.track || !parsed.slug) return;
      setState(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  if (!state || state.track !== activeTrackId) return null;

  const track = getTrack(state.track);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pick up where you left off · {track.shortLabel}
        </p>
        <p className="text-sm font-medium">{state.title}</p>
      </div>
      <Button asChild>
        <Link href={chapterPathForTrack(state.track, state.slug)}>Continue chapter</Link>
      </Button>
    </div>
  );
}

export function recordResumeChapter(track: TrackId, slug: string, title: string) {
  try {
    const payload: ResumeState = { track, slug, title };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

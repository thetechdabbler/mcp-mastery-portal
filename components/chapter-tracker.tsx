"use client";

import * as React from "react";
import { recordResumeChapter } from "@/components/resume-reading";
import type { TrackId } from "@/lib/tracks";

export function ChapterTracker({
  slug,
  title,
  track = "mcp",
}: {
  slug: string;
  title: string;
  track?: TrackId;
}) {
  React.useEffect(() => {
    recordResumeChapter(track, slug, title);
  }, [slug, title, track]);
  return null;
}

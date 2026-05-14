"use client";

import * as React from "react";
import { recordResumeChapter } from "@/components/resume-reading";

export function ChapterTracker({ slug, title }: { slug: string; title: string }) {
  React.useEffect(() => {
    recordResumeChapter(slug, title);
  }, [slug, title]);
  return null;
}

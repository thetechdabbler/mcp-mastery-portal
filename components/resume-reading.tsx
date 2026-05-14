"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LS_KEY = "mcp-mastery-resume";

type ResumeState = { slug: string; title: string; scrollY?: number };

export function ResumeReading() {
  const [state, setState] = React.useState<ResumeState | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      setState(JSON.parse(raw) as ResumeState);
    } catch {
      /* ignore */
    }
  }, []);

  if (!state) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pick up where you left off
        </p>
        <p className="text-sm font-medium">{state.title}</p>
      </div>
      <Button asChild>
        <Link href={`/chapters/${state.slug}`}>Continue chapter</Link>
      </Button>
    </div>
  );
}

export function recordResumeChapter(slug: string, title: string) {
  try {
    const payload: ResumeState = { slug, title };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

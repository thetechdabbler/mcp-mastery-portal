"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  describeDestinationPath,
  describePathForTrack,
  getTrack,
  getTrackFromPathname,
  isTrackSwitchFallback,
  SKIP_TRACK_CONFIRM_STORAGE_KEY,
  type TrackId,
} from "@/lib/tracks";

export type TrackSwitchPending = {
  targetId: TrackId;
  href: string;
  fromPathname: string;
};

type TrackSwitchDialogProps = {
  pending: TrackSwitchPending | null;
  onCancel: () => void;
  onConfirm: (skipFuture: boolean) => void;
};

function readSkipConfirm(): boolean {
  try {
    return localStorage.getItem(SKIP_TRACK_CONFIRM_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function TrackSwitchDialog({ pending, onCancel, onConfirm }: TrackSwitchDialogProps) {
  const [skipFuture, setSkipFuture] = React.useState(false);

  React.useEffect(() => {
    if (pending) setSkipFuture(false);
  }, [pending]);

  if (!pending) return null;

  const current = getTrackFromPathname(pending.fromPathname);
  const target = getTrack(pending.targetId);
  const fromDesc = describePathForTrack(pending.fromPathname);
  const toDesc = describeDestinationPath(pending.fromPathname, pending.targetId);
  const fallback = isTrackSwitchFallback(pending.fromPathname, pending.targetId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="track-switch-title"
        className="w-full max-w-md rounded-lg border bg-card p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="track-switch-title" className="text-lg font-semibold">
          Switch to {target.label}?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          You&apos;re leaving the <span className="font-medium text-foreground">{current.shortLabel}</span>{" "}
          track ({fromDesc.sectionLabel}). You&apos;ll go to{" "}
          <span className="font-medium text-foreground">{toDesc.sectionLabel}</span> on the{" "}
          {target.shortLabel} track.
        </p>
        {fallback ? (
          <p className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
            This page has no direct equivalent on the other track; you&apos;ll land on Chapters instead.
          </p>
        ) : null}
        <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={skipFuture}
            onChange={(e) => setSkipFuture(e.target.checked)}
            className="rounded border"
          />
          Don&apos;t ask again
        </label>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onConfirm(skipFuture)}>
            Switch track
          </Button>
        </div>
      </div>
    </div>
  );
}

export function shouldSkipTrackConfirm(): boolean {
  return readSkipConfirm();
}

export function persistSkipTrackConfirm(): void {
  try {
    localStorage.setItem(SKIP_TRACK_CONFIRM_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

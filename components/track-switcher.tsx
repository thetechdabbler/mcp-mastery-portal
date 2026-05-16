"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getTrackFromPathname,
  needsTrackSwitchConfirm,
  TRACKS,
  translatePathToTrack,
  type TrackId,
} from "@/lib/tracks";
import { useTrack } from "@/components/track-provider";
import {
  TrackSwitchDialog,
  persistSkipTrackConfirm,
  shouldSkipTrackConfirm,
  type TrackSwitchPending,
} from "@/components/track-switch-dialog";

type TrackSwitcherProps = {
  variant?: "header" | "hero";
  /** Hero only: navigate to track home on select (no confirm). */
  navigateOnSelect?: boolean;
  className?: string;
};

export function TrackSwitcher({
  variant = "header",
  navigateOnSelect = false,
  className,
}: TrackSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameTrack = getTrackFromPathname(pathname);
  const { activeTrackId } = useTrack();
  const [pending, setPending] = React.useState<TrackSwitchPending | null>(null);
  const selectedTrackId = navigateOnSelect ? activeTrackId : pathnameTrack.id;

  const navigateTo = React.useCallback(
    (href: string) => {
      if (href !== pathname) router.push(href);
    },
    [pathname, router],
  );

  const onSelect = (id: TrackId) => {
    if (pathnameTrack.id === id) return;

    if (navigateOnSelect) {
      const track = TRACKS.find((t) => t.id === id);
      if (track) navigateTo(track.homeHref);
      return;
    }

    const href = translatePathToTrack(pathname, id);
    if (href === pathname) return;

    if (needsTrackSwitchConfirm(pathname, id) && !shouldSkipTrackConfirm()) {
      setPending({ targetId: id, href, fromPathname: pathname });
      return;
    }

    navigateTo(href);
  };

  const handleConfirm = (skipFuture: boolean) => {
    if (!pending) return;
    if (skipFuture) persistSkipTrackConfirm();
    navigateTo(pending.href);
    setPending(null);
  };

  return (
    <>
      <div
        role="tablist"
        aria-label="Curriculum track"
        className={cn(
          "inline-flex rounded-lg border bg-muted/40 p-0.5",
          variant === "hero" && "p-1",
          className,
        )}
      >
        {TRACKS.map((track) => {
          const selected = selectedTrackId === track.id;
          return (
            <button
              key={track.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelect(track.id)}
              className={cn(
                "rounded-md font-medium transition-colors",
                variant === "header" && "px-2.5 py-1 text-xs",
                variant === "hero" && "px-4 py-2 text-sm",
                selected
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {track.shortLabel}
            </button>
          );
        })}
      </div>
      {variant === "header" ? (
        <TrackSwitchDialog
          pending={pending}
          onCancel={() => setPending(null)}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}

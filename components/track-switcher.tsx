"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { TRACKS, type TrackId } from "@/lib/tracks";
import { useTrack } from "@/components/track-provider";

type TrackSwitcherProps = {
  variant?: "header" | "hero";
  /** Navigate to track home when selection changes (header: false). */
  navigateOnSelect?: boolean;
  className?: string;
};

export function TrackSwitcher({
  variant = "header",
  navigateOnSelect = false,
  className,
}: TrackSwitcherProps) {
  const router = useRouter();
  const { activeTrackId, setActiveTrack } = useTrack();

  const onSelect = (id: TrackId) => {
    if (id === activeTrackId) return;
    setActiveTrack(id);
    if (navigateOnSelect) {
      const track = TRACKS.find((t) => t.id === id);
      if (track) router.push(track.homeHref);
    }
  };

  return (
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
        const selected = track.id === activeTrackId;
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
  );
}

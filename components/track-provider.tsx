"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  getTrack,
  getTrackFromPathname,
  isTrackId,
  PREFERRED_TRACK_STORAGE_KEY,
  type TrackConfig,
  type TrackId,
} from "@/lib/tracks";

type TrackContextValue = {
  activeTrack: TrackConfig;
  activeTrackId: TrackId;
  setActiveTrack: (id: TrackId) => void;
};

const TrackContext = React.createContext<TrackContextValue | null>(null);

function readStoredTrack(): TrackId | null {
  try {
    const raw = localStorage.getItem(PREFERRED_TRACK_STORAGE_KEY);
    if (raw && isTrackId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function TrackProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathnameTrack = React.useMemo(() => getTrackFromPathname(pathname), [pathname]);
  const isHub = pathname === "/";

  const [activeTrackId, setActiveTrackId] = React.useState<TrackId>(pathnameTrack.id);

  React.useEffect(() => {
    if (isHub) {
      const stored = readStoredTrack();
      if (stored) setActiveTrackId(stored);
      return;
    }
    setActiveTrackId(pathnameTrack.id);
  }, [isHub, pathname, pathnameTrack.id]);

  React.useEffect(() => {
    try {
      localStorage.setItem(PREFERRED_TRACK_STORAGE_KEY, activeTrackId);
    } catch {
      /* ignore */
    }
  }, [activeTrackId]);

  const setActiveTrack = React.useCallback((id: TrackId) => {
    setActiveTrackId(id);
  }, []);

  const value = React.useMemo(
    () => ({
      activeTrack: getTrack(activeTrackId),
      activeTrackId,
      setActiveTrack,
    }),
    [activeTrackId, setActiveTrack],
  );

  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
}

export function useTrack(): TrackContextValue {
  const ctx = React.useContext(TrackContext);
  if (!ctx) throw new Error("useTrack must be used within TrackProvider");
  return ctx;
}

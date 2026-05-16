"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackProvider } from "@/components/track-provider";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <TrackProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <SiteFooter />
      </div>
    </TrackProvider>
  );
}

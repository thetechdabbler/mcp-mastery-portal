"use client";

import Link from "next/link";
import { SearchDialog } from "@/components/search-dialog";
import { TrackSwitcher } from "@/components/track-switcher";
import { useTrack } from "@/components/track-provider";

export function SiteHeader() {
  const { activeTrack } = useTrack();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight">
            MCP Mastery
          </Link>
          <TrackSwitcher variant="header" />
        </div>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-muted-foreground">
          {activeTrack.links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <SearchDialog />
        </nav>
      </div>
    </header>
  );
}

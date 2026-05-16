"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTrackFromPathname } from "@/lib/tracks";
import { cn } from "@/lib/utils";

export function TrackSubnav() {
  const pathname = usePathname();
  const activeTrack = getTrackFromPathname(pathname);

  return (
    <div className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {activeTrack.shortLabel}
        </span>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-muted-foreground">
          {activeTrack.links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn("hover:text-foreground", active && "text-foreground")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

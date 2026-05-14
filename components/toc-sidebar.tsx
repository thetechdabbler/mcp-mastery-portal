"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TocSidebar({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = React.useState<string | undefined>();

  React.useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [headings]);

  return (
    <nav className="sticky top-24 hidden max-h-[70vh] w-56 shrink-0 overflow-y-auto text-sm xl:block">
      <p className="mb-2 font-semibold text-muted-foreground">On this page</p>
      <ul className="space-y-1 border-l pl-3">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block py-0.5 text-muted-foreground hover:text-foreground",
                active === h.id && "font-medium text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

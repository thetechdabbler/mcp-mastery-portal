"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [hits, setHits] = React.useState<
    { type: string; title: string; href: string; snippet: string }[]
  >([]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      if (q.trim().length < 2) {
        setHits([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as { hits: typeof hits };
        setHits(data.hits ?? []);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [open, q]);

  return (
    <>
      <button
        type="button"
        className="rounded border bg-muted/40 px-2 py-1 text-xs font-medium text-foreground hover:bg-muted"
        onClick={() => setOpen(true)}
      >
        Search ⌘K
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24">
          <div className="w-full max-w-lg rounded-lg border bg-card p-4 shadow-lg">
            <p className="mb-2 text-sm font-semibold">Search curriculum</p>
            <input
              autoFocus
              className="mb-3 w-full rounded border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Type at least 2 characters…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {loading ? <p className="text-xs text-muted-foreground">Searching…</p> : null}
            <ul className="max-h-72 space-y-2 overflow-y-auto text-sm">
              {hits.map((h) => (
                <li key={h.href}>
                  <Link
                    href={h.href}
                    className="block rounded border bg-muted/30 px-2 py-2 hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-[10px] uppercase text-muted-foreground">{h.type}</span>
                    <div className="font-medium">{h.title}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{h.snippet}</div>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] text-muted-foreground">
              Dev search is substring over chapter bodies + lab READMEs + challenge summaries. Production builds also
              run Pagefind for static HTML.
            </p>
            <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

import Link from "next/link";
import { SearchDialog } from "@/components/search-dialog";

const links = [
  { href: "/chapters", label: "Chapters" },
  { href: "/labs", label: "Labs" },
  { href: "/challenges", label: "Challenges" },
  { href: "/reference", label: "Reference" },
  { href: "/security", label: "Security" },
  { href: "/capstone", label: "Capstone" },
  { href: "/playground", label: "Playground" },
  { href: "/inspector", label: "Inspector" },
  { href: "/anti-patterns", label: "Anti-patterns" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          MCP Mastery
        </Link>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-muted-foreground">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
          <SearchDialog />
        </nav>
      </div>
    </header>
  );
}

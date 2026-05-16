import Link from "next/link";
import { SearchDialog } from "@/components/search-dialog";

const mcpLinks = [
  { href: "/chapters", label: "Chapters" },
  { href: "/labs", label: "Labs" },
  { href: "/challenges", label: "Challenges" },
  { href: "/reference", label: "Reference" },
  { href: "/security", label: "Security" },
  { href: "/capstone", label: "Capstone" },
  { href: "/playground", label: "Playground" },
  { href: "/inspector", label: "Inspector" },
  { href: "/anti-patterns", label: "Anti-patterns" },
];

const agentcoreLinks = [
  { href: "/agentcore/chapters", label: "Chapters" },
  { href: "/agentcore/labs", label: "Labs" },
  { href: "/agentcore/challenges", label: "Challenges" },
  { href: "/agentcore/reference", label: "Reference" },
  { href: "/agentcore/playbook", label: "Playbook" },
  { href: "/agentcore/capstone", label: "Capstone" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            MCP Mastery
          </Link>
          <Link
            href="/agentcore"
            className="rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-semibold text-primary hover:bg-primary/10"
          >
            AgentCore track
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">MCP</span>
            {mcpLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
          <span className="hidden h-4 w-px bg-border sm:inline" aria-hidden />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">AgentCore</span>
            {agentcoreLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <SearchDialog />
        </nav>
      </div>
    </header>
  );
}

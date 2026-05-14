import { cn } from "@/lib/utils";

export function HallOfShame({
  tag = "general",
  title,
  children,
}: {
  tag?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-hall-tag={tag}
      className={cn(
        "my-6 rounded-lg border border-red-500/30 bg-red-500/5 p-4",
      )}
    >
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">
        Hall of shame{title ? `: ${title}` : ""}
        <span className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] normal-case text-muted-foreground">
          {tag}
        </span>
      </p>
      <div className="prose prose-sm dark:prose-invert max-w-none">{children}</div>
    </section>
  );
}

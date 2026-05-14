import { cn } from "@/lib/utils";

export function RealTalk({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className={cn(
        "my-4 rounded-lg border-l-4 border-violet-500 bg-violet-500/5 px-4 py-3 text-sm",
      )}
    >
      <p className="mb-1 font-semibold text-violet-700 dark:text-violet-300">Real talk</p>
      <div className="prose prose-sm dark:prose-invert max-w-none">{children}</div>
    </aside>
  );
}

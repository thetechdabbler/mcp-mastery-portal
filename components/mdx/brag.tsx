import { cn } from "@/lib/utils";

export function Brag({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-sm font-medium text-emerald-900 dark:text-emerald-100",
      )}
    >
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";

export function Callout({
  title,
  children,
  variant = "info",
}: {
  title?: string;
  children: React.ReactNode;
  variant?: "info" | "warn" | "danger";
}) {
  return (
    <div
      className={cn(
        "my-4 rounded-lg border p-4",
        variant === "info" && "border-blue-500/30 bg-blue-500/5",
        variant === "warn" && "border-amber-500/30 bg-amber-500/5",
        variant === "danger" && "border-red-500/30 bg-red-500/5",
      )}
    >
      {title ? <p className="mb-2 font-semibold">{title}</p> : null}
      <div className="prose prose-sm dark:prose-invert max-w-none">{children}</div>
    </div>
  );
}

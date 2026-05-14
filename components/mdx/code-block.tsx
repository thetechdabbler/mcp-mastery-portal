import { codeToHtml } from "shiki";
import { CopyCodeButton } from "@/components/mdx/copy-code-button";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  language?: string;
  /** 1-based inclusive ranges e.g. "3-5,7" */
  highlight?: string;
  className?: string;
};

function parseHighlight(spec?: string): Set<number> {
  const set = new Set<number>();
  if (!spec) return set;
  for (const part of spec.split(",")) {
    const p = part.trim();
    if (!p) continue;
    if (p.includes("-")) {
      const [a, b] = p.split("-").map((x) => Number.parseInt(x.trim(), 10));
      if (Number.isFinite(a) && Number.isFinite(b)) {
        const lo = Math.min(a!, b!);
        const hi = Math.max(a!, b!);
        for (let i = lo; i <= hi; i++) set.add(i);
      }
    } else {
      const n = Number.parseInt(p, 10);
      if (Number.isFinite(n)) set.add(n);
    }
  }
  return set;
}

export async function CodeBlock({
  code,
  language = "text",
  highlight,
  className,
}: CodeBlockProps) {
  const lines = code.replace(/\n$/, "").split("\n");
  const hl = parseHighlight(highlight);
  const lang = language === "text" ? "txt" : language;
  const html = await codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <div className={cn("group relative my-4 rounded-lg border bg-muted/40", className)}>
      <div className="flex items-center justify-between border-b px-3 py-1.5 text-xs text-muted-foreground">
        <span className="font-mono">{language}</span>
        <CopyCodeButton code={code} />
      </div>
      {hl.size > 0 ? (
        <div className="overflow-x-auto p-4 text-sm leading-relaxed [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0">
          <pre className="m-0 bg-transparent p-0">
            <code>
              {lines.map((line, i) => {
                const n = i + 1;
                const active = hl.has(n);
                return (
                  <span
                    key={n}
                    className={cn(
                      "block whitespace-pre font-mono",
                      active && "bg-amber-500/15 border-l-2 border-amber-500 pl-2 -ml-2",
                    )}
                  >
                    {line}
                    {"\n"}
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      ) : (
        <div
          className="overflow-x-auto p-4 text-sm [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}

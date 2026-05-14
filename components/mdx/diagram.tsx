"use client";

import * as React from "react";

type DiagramProps = {
  id: string;
  caption: string;
  alt: string;
  children: React.ReactNode;
};

function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    return node
      .map((child) => extractText(child))
      .filter((s) => s.length > 0)
      .join("\n");
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return "";
}

function normalizeMermaidSource(children: React.ReactNode): string {
  return extractText(children);
}

const MERMAID_KEYWORDS = [
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "mindmap",
  "timeline",
  "gitGraph",
  "quadrantChart",
  "requirementDiagram",
  "C4Context",
];

function looksLikeMermaid(source: string): boolean {
  const firstLine = source.split("\n").find((l) => l.trim().length > 0);
  if (!firstLine) return false;
  const head = firstLine.trim().split(/\s+/)[0] ?? "";
  if (!head) return false;
  return MERMAID_KEYWORDS.some((kw) => head === kw || head.startsWith(kw));
}

export function Diagram({ id, caption, alt, children }: DiagramProps) {
  const [svg, setSvg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const source = React.useMemo(() => normalizeMermaidSource(children).trim(), [children]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!source) {
        if (!cancelled) setErr("Diagram source is empty.");
        return;
      }
      if (!looksLikeMermaid(source)) {
        if (!cancelled) {
          setErr(
            "Diagram source does not start with a Mermaid keyword (e.g. flowchart, sequenceDiagram). " +
              "Wrap the Mermaid source in a JS expression like {`flowchart LR ...`} so MDX passes it as a string instead of parsing it as Markdown."
          );
        }
        return;
      }
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
        });
        const { svg: out } = await mermaid.render(`mmd-${id}-${Math.random().toString(36).slice(2)}`, source);
        if (!cancelled) setSvg(out);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Diagram error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source, id]);

  return (
    <figure id={`diagram-${id}`} className="my-6 rounded-lg border bg-muted/30 p-3">
      <figcaption className="mb-2 text-sm font-medium text-foreground">{caption}</figcaption>
      {svg ? (
        <div
          className="overflow-x-auto [&_svg]:max-w-full"
          role="img"
          aria-label={alt}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : err ? (
        <p className="text-sm text-destructive">{err}</p>
      ) : (
        <pre className="overflow-x-auto text-xs text-muted-foreground" aria-label={alt}>
          {source}
        </pre>
      )}
    </figure>
  );
}

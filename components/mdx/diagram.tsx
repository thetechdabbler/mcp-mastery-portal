import fs from "node:fs/promises";
import path from "node:path";

export type DiagramProps = {
  id: string;
  caption: string;
  alt: string;
};

export async function Diagram({ id, caption, alt }: DiagramProps) {
  const svgPath = path.join(process.cwd(), "public", "diagrams", `${id}.svg`);
  let svg: string;
  try {
    svg = await fs.readFile(svgPath, "utf8");
  } catch {
    return (
      <figure id={`diagram-${id}`} className="my-6 rounded-lg border bg-muted/30 p-3">
        <figcaption className="mb-2 text-sm font-medium text-foreground">{caption}</figcaption>
        <p className="text-sm text-destructive">
          Missing diagram asset <code className="rounded bg-muted px-1">public/diagrams/{id}.svg</code>. Run{" "}
          <code className="rounded bg-muted px-1">npm run diagrams</code>.
        </p>
      </figure>
    );
  }

  return (
    <figure id={`diagram-${id}`} className="my-6 rounded-lg border bg-muted/30 p-3">
      <figcaption className="mb-2 text-sm font-medium text-foreground">{caption}</figcaption>
      <div
        className="overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
        role="img"
        aria-label={alt}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}

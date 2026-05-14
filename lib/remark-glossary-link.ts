import type { Root, Paragraph, PhrasingContent } from "mdast";
import { visit } from "unist-util-visit";
import type { GlossaryLinkTerm } from "@/lib/glossary";

/**
 * Links first occurrence of each glossary term per page (case-insensitive, word-ish boundaries).
 */
export function remarkGlossaryLink(terms: GlossaryLinkTerm[]) {
  return (tree: Root) => {
    if (terms.length === 0) return;
    const used = new Set<string>();
    visit(tree, "paragraph", (node: Paragraph) => {
      if (!node.children.some((c) => c.type === "text")) {
        return;
      }
      const nextChildren: PhrasingContent[] = [];
      for (const child of node.children) {
        if (child.type !== "text") {
          nextChildren.push(child);
          continue;
        }
        const pieces = linkifyText(child.value, terms, used);
        for (const p of pieces) {
          if (p.type === "text") {
            nextChildren.push({ type: "text", value: p.value });
          } else {
            nextChildren.push({
              type: "link",
              url: p.href,
              children: [{ type: "text", value: p.label }],
            });
          }
        }
      }
      node.children = nextChildren;
    });
  };
}

type Piece =
  | { type: "text"; value: string }
  | { type: "link"; href: string; label: string };

function linkifyText(
  input: string,
  terms: GlossaryLinkTerm[],
  used: Set<string>,
): Piece[] {
  let remaining = input;
  const out: Piece[] = [];
  while (remaining.length > 0) {
    let best: { index: number; m: RegExpExecArray; term: GlossaryLinkTerm } | null =
      null;
    for (const term of terms) {
      const key = term.href + "::" + term.key.toLowerCase();
      if (used.has(key)) continue;
      const m = term.pattern.exec(remaining);
      term.pattern.lastIndex = 0;
      if (!m || m.index === undefined) continue;
      if (!best || m.index < best.index) {
        best = { index: m.index, m, term };
      }
    }
    if (!best) {
      out.push({ type: "text", value: remaining });
      break;
    }
    if (best.index > 0) {
      out.push({ type: "text", value: remaining.slice(0, best.index) });
    }
    const m = best.m;
    const inner = m[2];
    if (!inner) {
      out.push({ type: "text", value: remaining.slice(best.index, best.index + 1) });
      remaining = remaining.slice(best.index + 1);
      continue;
    }
    const prefix = m[1] ?? "";
    const suffix = m[3] ?? "";
    used.add(best.term.href + "::" + best.term.key.toLowerCase());
    out.push({ type: "text", value: prefix });
    out.push({ type: "link", href: best.term.href, label: inner });
    out.push({ type: "text", value: suffix });
    remaining = remaining.slice(best.index + m[0].length);
  }
  return mergeAdjacentText(out);
}

function mergeAdjacentText(pieces: Piece[]): Piece[] {
  const merged: Piece[] = [];
  for (const p of pieces) {
    const last = merged[merged.length - 1];
    if (p.type === "text" && last?.type === "text") {
      last.value += p.value;
    } else {
      merged.push(p);
    }
  }
  return merged;
}

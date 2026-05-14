import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { CONTENT_ROOT } from "@/lib/content-paths";
import { glossaryEntrySchema, type GlossaryEntry } from "@/lib/types";

const glossaryFileSchema = z.array(glossaryEntrySchema);

let cached: GlossaryEntry[] | null = null;

export async function getGlossary(): Promise<GlossaryEntry[]> {
  if (cached) return cached;
  const raw = await fs.readFile(path.join(CONTENT_ROOT, "glossary.json"), "utf8");
  const parsed = glossaryFileSchema.parse(JSON.parse(raw));
  cached = parsed;
  return parsed;
}

export type GlossaryLinkTerm = {
  pattern: RegExp;
  href: string;
  /** longest-first matching */
  key: string;
};

export async function buildGlossaryLinkTerms(): Promise<GlossaryLinkTerm[]> {
  const entries = await getGlossary();
  const terms: { key: string; href: string }[] = [];
  for (const e of entries) {
    const href = `/reference#term-${e.slug}`;
    terms.push({ key: e.term, href });
    for (const a of e.aliases ?? []) {
      terms.push({ key: a, href });
    }
  }
  terms.sort((a, b) => b.key.length - a.key.length);
  return terms.map(({ key, href }) => ({
    key,
    href,
    pattern: new RegExp(
      `(^|[^A-Za-z0-9_])(${escapeRegExp(key)})([^A-Za-z0-9_]|$)`,
      "i",
    ),
  }));
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

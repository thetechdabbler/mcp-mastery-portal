import fs from "node:fs/promises";
import { z } from "zod";
import { LANGCHAIN_GLOSSARY_PATH } from "@/lib/content-paths";
import { glossaryEntrySchema, type GlossaryEntry } from "@/lib/types";

const glossaryFileSchema = z.array(glossaryEntrySchema);

let cached: GlossaryEntry[] | null = null;

export async function getLangchainGlossary(): Promise<GlossaryEntry[]> {
  if (cached) return cached;
  const raw = await fs.readFile(LANGCHAIN_GLOSSARY_PATH, "utf8");
  cached = glossaryFileSchema.parse(JSON.parse(raw));
  return cached;
}

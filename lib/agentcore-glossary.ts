import fs from "node:fs/promises";
import { z } from "zod";
import { AGENTCORE_GLOSSARY_PATH } from "@/lib/content-paths";
import { glossaryEntrySchema, type GlossaryEntry } from "@/lib/types";

const glossaryFileSchema = z.array(glossaryEntrySchema);

let cached: GlossaryEntry[] | null = null;

export async function getAgentcoreGlossary(): Promise<GlossaryEntry[]> {
  if (cached) return cached;
  const raw = await fs.readFile(AGENTCORE_GLOSSARY_PATH, "utf8");
  cached = glossaryFileSchema.parse(JSON.parse(raw));
  return cached;
}

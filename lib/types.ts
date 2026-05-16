import { z } from "zod";

export const difficultySchema = z.enum(["warmup", "mid", "boss", "nightmare"]);
export type Difficulty = z.infer<typeof difficultySchema>;

export const quizItemSchema = z.object({
  q: z.string(),
  options: z.array(z.string()).min(2),
  answer: z.number().int().min(0),
  explain: z.string(),
});
export type QuizItem = z.infer<typeof quizItemSchema>;

export const referenceSchema = z.object({
  label: z.string(),
  url: z.string().min(1),
});
export type Reference = z.infer<typeof referenceSchema>;

export const chapterFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  order: z.number().int().min(1).max(99),
  difficulty: difficultySchema,
  estMinutes: z.number().int().positive(),
  specVersion: z.string(),
  sdkVersion: z.string(),
  lastReviewed: z.string(),
  mistakesPrevented: z.number().int().positive().optional(),
  objectives: z.array(z.string()).min(1),
  diagrams: z.array(z.string()).min(1),
  quiz: z.array(quizItemSchema).min(3).max(8),
  references: z.array(referenceSchema).min(1),
});
export type ChapterFrontmatter = z.infer<typeof chapterFrontmatterSchema>;

export type ChapterDoc = {
  frontmatter: ChapterFrontmatter;
  body: string;
  filePath: string;
};

export const agentcoreFeatureSchema = z.enum([
  "runtime",
  "memory",
  "identity",
  "gateway",
  "browser",
  "code-interpreter",
  "observability",
]);
export type AgentcoreFeature = z.infer<typeof agentcoreFeatureSchema>;

export const agentcoreChapterFrontmatterSchema = chapterFrontmatterSchema
  .omit({ specVersion: true, sdkVersion: true })
  .extend({
    track: z.literal("agentcore"),
    agentcoreFeatures: z.array(agentcoreFeatureSchema).min(1),
    langgraphVersion: z.string(),
    pythonVersion: z.string(),
  });
export type AgentcoreChapterFrontmatter = z.infer<typeof agentcoreChapterFrontmatterSchema>;

export type AgentcoreChapterDoc = {
  frontmatter: AgentcoreChapterFrontmatter;
  body: string;
  filePath: string;
};

export const langchainChapterFrontmatterSchema = chapterFrontmatterSchema
  .omit({ specVersion: true, sdkVersion: true })
  .extend({
    track: z.literal("langchain"),
    langchainVersion: z.string(),
    langgraphVersion: z.string(),
    pythonVersion: z.string(),
    langsmith: z.boolean().optional(),
  });
export type LangchainChapterFrontmatter = z.infer<typeof langchainChapterFrontmatterSchema>;

export type LangchainChapterDoc = {
  frontmatter: LangchainChapterFrontmatter;
  body: string;
  filePath: string;
};

export const challengeManifestSchema = z.object({
  slug: z.string(),
  title: z.string(),
  difficulty: difficultySchema,
  estMinutes: z.number().int().positive(),
  packageDir: z.string(),
  summary: z.string(),
  hints: z.array(z.string()).min(1),
  acceptance: z.array(z.string()).min(1),
  runner: z.enum(["node", "python"]).default("node"),
});
export type ChallengeManifest = z.infer<typeof challengeManifestSchema>;

export const glossaryEntrySchema = z.object({
  term: z.string(),
  slug: z.string(),
  aliases: z.array(z.string()).optional(),
  definition: z.string(),
  refs: z
    .array(
      z.object({
        chapter: z.string(),
        anchor: z.string().optional(),
      }),
    )
    .optional(),
});
export type GlossaryEntry = z.infer<typeof glossaryEntrySchema>;

export type HallOfShameEntry = {
  tag: string;
  chapterSlug: string;
  chapterTitle: string;
  title?: string;
  bodyMarkdown: string;
};

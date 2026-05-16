import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ChapterTracker } from "@/components/chapter-tracker";
import { PrevNext } from "@/components/prev-next";
import { QuizBlock } from "@/components/mdx/quiz-block";
import { TocSidebar } from "@/components/toc-sidebar";
import { VersionBadge } from "@/components/version-badge";
import { getAdjacentChapters, getAllChapters, getChapterBySlug } from "@/lib/content";
import { extractHeadingsFromMdx } from "@/lib/headings";
import { compileLessonMdx } from "@/lib/mdx-compile";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const ch = await getAllChapters();
  return ch.map((c) => ({ slug: c.frontmatter.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = await getChapterBySlug(slug);
  if (!doc) return {};
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.subtitle ?? doc.frontmatter.title,
    openGraph: {
      title: doc.frontmatter.title,
      description: doc.frontmatter.subtitle,
      images: [{ url: `/api/og/${slug}` }],
    },
  };
}

export default async function ChapterPage(props: Props) {
  const { slug } = await props.params;
  const doc = await getChapterBySlug(slug);
  if (!doc) notFound();
  const { content } = await compileLessonMdx(doc.body);
  const chapters = await getAllChapters();
  const { prev, next } = getAdjacentChapters(chapters, slug);
  const headings = extractHeadingsFromMdx(doc.body);

  return (
    <div>
      <ChapterTracker slug={doc.frontmatter.slug} title={doc.frontmatter.title} track="mcp" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="outline">Chapter {doc.frontmatter.order}</Badge>
        <Badge>{doc.frontmatter.difficulty}</Badge>
        <span className="text-xs text-muted-foreground">~{doc.frontmatter.estMinutes} min</span>
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{doc.frontmatter.title}</h1>
      {doc.frontmatter.subtitle ? (
        <p className="mb-4 text-lg text-muted-foreground">{doc.frontmatter.subtitle}</p>
      ) : null}
      <VersionBadge fm={doc.frontmatter} />
      {doc.frontmatter.mistakesPrevented ? (
        <p className="mt-3 rounded-md border bg-muted/40 px-3 py-2 text-sm">
          Reading this chapter helps prevent{" "}
          <span className="font-semibold">{doc.frontmatter.mistakesPrevented}</span> common MCP mistakes.
        </p>
      ) : null}
      <div className="mt-6 flex gap-10">
        <TocSidebar headings={headings} />
        <article className="prose prose-zinc max-w-none dark:prose-invert flex-1">
          {content}
          <h2>References</h2>
          <ul>
            {doc.frontmatter.references.map((r) => (
              <li key={r.url}>
                <a href={r.url} rel="noreferrer" target="_blank">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </article>
      </div>
      <QuizBlock slug={doc.frontmatter.slug} items={doc.frontmatter.quiz} />
      <PrevNext prev={prev} next={next} />
    </div>
  );
}

import type * as React from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Brag } from "@/components/mdx/brag";
import { Callout } from "@/components/mdx/callout";
import { Diagram } from "@/components/mdx/diagram";
import { HallOfShame } from "@/components/mdx/hall-of-shame";
import { MdxPre } from "@/components/mdx/mdx-pre";
import { MdxTable } from "@/components/mdx/mdx-table";
import { RealTalk } from "@/components/mdx/real-talk";

const baseComponents = {
  pre: MdxPre,
  table: MdxTable,
  Callout,
  HallOfShame,
  RealTalk,
  Brag,
  Diagram,
} satisfies Record<string, unknown>;

export async function compileLessonMdx(source: string): Promise<{ content: React.ReactElement }> {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: "anchor-link",
              },
            },
          ],
        ],
      },
    },
    components: baseComponents,
  });
  return { content };
}

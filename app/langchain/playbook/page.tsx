import fs from "node:fs/promises";
import { compileLessonMdx } from "@/lib/mdx-compile";
import { LANGCHAIN_PLAYBOOK_PATH } from "@/lib/content-paths";

export const metadata = { title: "LangChain & LangGraph Playbook" };

export default async function LangchainPlaybookPage() {
  const raw = await fs.readFile(LANGCHAIN_PLAYBOOK_PATH, "utf8");
  const body = raw.replace(/^---[\s\S]*?---\s*/, "");
  const { content } = await compileLessonMdx(body);
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">LangChain & LangGraph Playbook</h1>
      <div className="prose max-w-none dark:prose-invert">{content}</div>
    </div>
  );
}

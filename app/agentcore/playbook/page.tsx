import { compileLessonMdx } from "@/lib/mdx-compile";
import fs from "node:fs/promises";
import { AGENTCORE_PLAYBOOK_PATH } from "@/lib/content-paths";

export const metadata = { title: "Multi-Agent Playbook" };

export default async function AgentcorePlaybookPage() {
  const raw = await fs.readFile(AGENTCORE_PLAYBOOK_PATH, "utf8");
  const body = raw.replace(/^---[\s\S]*?---\s*/, "");
  const { content } = await compileLessonMdx(body);
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Multi-Agent Playbook</h1>
      <div className="prose max-w-none dark:prose-invert">{content}</div>
    </div>
  );
}

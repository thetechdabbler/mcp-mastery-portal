import { compileLessonMdx } from "@/lib/mdx-compile";
import fs from "node:fs/promises";
import path from "node:path";

export const metadata = { title: "Security playbook" };

export default async function SecurityPage() {
  const raw = await fs.readFile(path.join(process.cwd(), "content", "security-playbook.mdx"), "utf8");
  const body = raw.replace(/^---[\s\S]*?---\s*/, "");
  const { content } = await compileLessonMdx(body);
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">MCP Security Playbook</h1>
      <div className="prose max-w-none dark:prose-invert">{content}</div>
    </div>
  );
}

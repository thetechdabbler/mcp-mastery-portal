import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { agentcoreChapterFrontmatterSchema, chapterFrontmatterSchema } from "../lib/types";

const root = process.cwd();
const mcpChaptersDir = path.join(root, "content", "chapters");
const agentcoreChaptersDir = path.join(root, "content", "agentcore", "chapters");
const mcpPlaybookPath = path.join(root, "content", "security-playbook.mdx");
const agentcorePlaybookPath = path.join(root, "content", "agentcore", "playbook.mdx");
const mcpDiagramsDir = path.join(root, "content", "diagrams");
const agentcoreDiagramsDir = path.join(root, "content", "agentcore", "diagrams");
const diagramsOutDir = path.join(root, "public", "diagrams");

const diagramIds = new Set<string>();
let errors = 0;

function scanMdx(filePath: string, label: string, parseFm: (data: unknown) => void) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  try {
    parseFm(data);
  } catch (e) {
    console.error("Invalid frontmatter", label, e);
    errors += 1;
  }
  const re = /<Diagram[^>]*\bid=["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const id = m[1];
    if (!id) continue;
    if (diagramIds.has(id)) {
      console.error("Duplicate diagram id", id, "in", label);
      errors += 1;
    }
    diagramIds.add(id);
  }
  if (!content.includes("<Diagram")) {
    console.error("Missing Diagram in", label);
    errors += 1;
  }
}

const mcpFiles = fs.readdirSync(mcpChaptersDir).filter((f) => f.endsWith(".mdx"));
for (const file of mcpFiles) {
  scanMdx(path.join(mcpChaptersDir, file), file, (d) => chapterFrontmatterSchema.parse(d));
}

const acFiles = fs.existsSync(agentcoreChaptersDir)
  ? fs.readdirSync(agentcoreChaptersDir).filter((f) => f.endsWith(".mdx"))
  : [];
for (const file of acFiles) {
  scanMdx(path.join(agentcoreChaptersDir, file), `agentcore/${file}`, (d) => {
    const fm = agentcoreChapterFrontmatterSchema.parse(d);
    if (fm.agentcoreFeatures.length < 1) {
      throw new Error("agentcoreFeatures must have at least one entry");
    }
  });
}

for (const [playbookPath, name] of [
  [mcpPlaybookPath, "security-playbook.mdx"],
  [agentcorePlaybookPath, "agentcore/playbook.mdx"],
] as const) {
  if (!fs.existsSync(playbookPath)) continue;
  const raw = fs.readFileSync(playbookPath, "utf8");
  const { content } = matter(raw);
  const re = /<Diagram[^>]*\bid=["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const id = m[1];
    if (!id) continue;
    if (diagramIds.has(id)) {
      console.error("Duplicate diagram id", id, "in", name);
      errors += 1;
    }
    diagramIds.add(id);
  }
}

function d2PathForId(id: string): string | null {
  const mcp = path.join(mcpDiagramsDir, `${id}.d2`);
  if (fs.existsSync(mcp)) return mcp;
  const ac = path.join(agentcoreDiagramsDir, `${id}.d2`);
  if (fs.existsSync(ac)) return ac;
  return null;
}

for (const id of diagramIds) {
  const d2Path = d2PathForId(id);
  const svgPath = path.join(diagramsOutDir, `${id}.svg`);
  if (!d2Path) {
    console.error("Missing D2 source for diagram id", id);
    errors += 1;
  }
  if (!fs.existsSync(svgPath)) {
    console.error("Missing rendered SVG for diagram id", id, "(run npm run diagrams)");
    errors += 1;
  }
}

if (errors) process.exit(1);
console.log(
  "content check OK",
  mcpFiles.length,
  "MCP chapters,",
  acFiles.length,
  "AgentCore chapters,",
  diagramIds.size,
  "diagram ids",
);

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { chapterFrontmatterSchema } from "../lib/types";

const root = process.cwd();
const chaptersDir = path.join(root, "content", "chapters");
const playbookPath = path.join(root, "content", "security-playbook.mdx");
const diagramsSrcDir = path.join(root, "content", "diagrams");
const diagramsOutDir = path.join(root, "public", "diagrams");

const files = fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".mdx"));
const diagramIds = new Set<string>();
let errors = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(chaptersDir, file), "utf8");
  const { data, content } = matter(raw);
  try {
    chapterFrontmatterSchema.parse(data);
  } catch (e) {
    console.error("Invalid frontmatter", file, e);
    errors += 1;
  }
  const re = /<Diagram[^>]*\bid=["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const id = m[1];
    if (!id) continue;
    if (diagramIds.has(id)) {
      console.error("Duplicate diagram id", id, "in", file);
      errors += 1;
    }
    diagramIds.add(id);
  }
  if (!content.includes("<Diagram")) {
    console.error("Missing Diagram in", file);
    errors += 1;
  }
}

if (fs.existsSync(playbookPath)) {
  const raw = fs.readFileSync(playbookPath, "utf8");
  const { content } = matter(raw);
  const re = /<Diagram[^>]*\bid=["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const id = m[1];
    if (!id) continue;
    if (diagramIds.has(id)) {
      console.error("Duplicate diagram id", id, "in security-playbook.mdx");
      errors += 1;
    }
    diagramIds.add(id);
  }
}

for (const id of diagramIds) {
  const d2Path = path.join(diagramsSrcDir, `${id}.d2`);
  const svgPath = path.join(diagramsOutDir, `${id}.svg`);
  if (!fs.existsSync(d2Path)) {
    console.error("Missing D2 source for diagram id", id, "expected", d2Path);
    errors += 1;
  }
  if (!fs.existsSync(svgPath)) {
    console.error("Missing rendered SVG for diagram id", id, "expected", svgPath, "(run npm run diagrams)");
    errors += 1;
  }
}

if (errors) process.exit(1);
console.log("content check OK", files.length, "chapters,", diagramIds.size, "diagram ids");

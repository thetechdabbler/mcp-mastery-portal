export function extractHeadingsFromMdx(body: string): { id: string; text: string }[] {
  const lines = body.split("\n");
  const out: { id: string; text: string }[] = [];
  for (const line of lines) {
    const m = /^## (.+)$/.exec(line.trim());
    if (!m?.[1]) continue;
    const text = m[1].replace(/<!--[\s\S]*?-->/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (id) out.push({ id, text });
  }
  return out;
}

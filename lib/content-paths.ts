import path from "node:path";

export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const CHAPTERS_DIR = path.join(CONTENT_ROOT, "chapters");
export const SECURITY_PLAYBOOK_PATH = path.join(CONTENT_ROOT, "security-playbook.mdx");
export const CHALLENGES_MANIFEST_DIR = path.join(CONTENT_ROOT, "challenges");
export const LABS_DIR = path.join(process.cwd(), "labs");
export const CHALLENGES_DIR = path.join(process.cwd(), "challenges");

export const AGENTCORE_CONTENT_ROOT = path.join(CONTENT_ROOT, "agentcore");
export const AGENTCORE_CHAPTERS_DIR = path.join(AGENTCORE_CONTENT_ROOT, "chapters");
export const AGENTCORE_PLAYBOOK_PATH = path.join(AGENTCORE_CONTENT_ROOT, "playbook.mdx");
export const AGENTCORE_CHALLENGES_MANIFEST_DIR = path.join(AGENTCORE_CONTENT_ROOT, "challenges");
export const AGENTCORE_DIAGRAMS_DIR = path.join(AGENTCORE_CONTENT_ROOT, "diagrams");
export const AGENTCORE_GLOSSARY_PATH = path.join(AGENTCORE_CONTENT_ROOT, "glossary.json");
export const AGENTCORE_TAGLINES_PATH = path.join(AGENTCORE_CONTENT_ROOT, "taglines.json");
export const AGENTCORE_LABS_DIR = path.join(LABS_DIR, "agentcore");
export const AGENTCORE_CHALLENGES_DIR = path.join(CHALLENGES_DIR, "agentcore");

export const LANGCHAIN_CONTENT_ROOT = path.join(CONTENT_ROOT, "langchain");
export const LANGCHAIN_CHAPTERS_DIR = path.join(LANGCHAIN_CONTENT_ROOT, "chapters");
export const LANGCHAIN_PLAYBOOK_PATH = path.join(LANGCHAIN_CONTENT_ROOT, "playbook.mdx");
export const LANGCHAIN_CHALLENGES_MANIFEST_DIR = path.join(LANGCHAIN_CONTENT_ROOT, "challenges");
export const LANGCHAIN_DIAGRAMS_DIR = path.join(LANGCHAIN_CONTENT_ROOT, "diagrams");
export const LANGCHAIN_GLOSSARY_PATH = path.join(LANGCHAIN_CONTENT_ROOT, "glossary.json");
export const LANGCHAIN_TAGLINES_PATH = path.join(LANGCHAIN_CONTENT_ROOT, "taglines.json");
export const LANGCHAIN_LABS_DIR = path.join(LABS_DIR, "langchain");
export const LANGCHAIN_CHALLENGES_DIR = path.join(CHALLENGES_DIR, "langchain");

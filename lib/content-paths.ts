import path from "node:path";

export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const CHAPTERS_DIR = path.join(CONTENT_ROOT, "chapters");
export const CHALLENGES_MANIFEST_DIR = path.join(CONTENT_ROOT, "challenges");
export const LABS_DIR = path.join(process.cwd(), "labs");
export const CHALLENGES_DIR = path.join(process.cwd(), "challenges");

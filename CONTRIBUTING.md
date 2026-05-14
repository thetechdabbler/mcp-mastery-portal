# Contributing

1. Keep chapter frontmatter valid (`npm run content:check`).
2. Every chapter needs at least one `<Diagram id="...">` with a **globally unique** id.
3. Security playbook technical sections stay clinical—snark belongs in intros, not controls.
4. Run `npm run lint && npm run typecheck && npm test && npm run build` before opening a PR.

## Adding a chapter

Create `content/chapters/NN-slug.mdx` with YAML frontmatter matching `chapterFrontmatterSchema` in `lib/types.ts`.

## Adding a challenge

1. Add `content/challenges/<slug>.json` manifest.
2. Create `challenges/c-<nn>-<slug>/` workspace with `src/index.ts` and `tests/validate.ts`.
3. Wire `npm run challenge -- <slug>`.

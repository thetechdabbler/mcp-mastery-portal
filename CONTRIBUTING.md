# Contributing

1. Keep chapter frontmatter valid (`npm run content:check`).
2. Every chapter needs at least one `<Diagram id="..." />` with a **globally unique** id (same uniqueness rules apply to `content/security-playbook.mdx`).
3. Security playbook technical sections stay clinical—snark belongs in intros, not controls.
4. Run `npm run lint && npm run typecheck && npm test && npm run build` before opening a PR.

## Diagrams (D2)

1. Install the [D2 CLI](https://d2lang.com/tour/install) (e.g. macOS: `brew install d2`; Linux/CI: see `.github/workflows/ci.yml`).
2. Add or edit `content/diagrams/<id>.d2` (kebab-case `id` must match `<Diagram id="..." />` in MDX).
3. Reuse icon URLs from [`scripts/diagram-icon-urls.mjs`](scripts/diagram-icon-urls.mjs) (Heroicons via jsDelivr) in D2 `icon:` fields for consistent visuals.
4. Run `npm run diagrams` to emit `public/diagrams/<id>.svg` (also runs automatically via `predev` / `prebuild`).

## Adding a chapter

Create `content/chapters/NN-slug.mdx` with YAML frontmatter matching `chapterFrontmatterSchema` in `lib/types.ts`.

## Adding a challenge

1. Add `content/challenges/<slug>.json` manifest.
2. Create `challenges/c-<nn>-<slug>/` workspace with `src/index.ts` and `tests/validate.ts`.
3. Wire `npm run challenge -- <slug>`.

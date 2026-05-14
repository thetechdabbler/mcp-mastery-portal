# MCP Mastery Portal

Next.js + MDX course portal for the **Model Context Protocol** (spec `2025-11-25`, TypeScript SDK `^1.29`).

## Quickstart

```bash
npm install
npm run dev
```

- Chapters: `/chapters`
- Labs (workspaces under `labs/`): `/labs`
- Challenges (workspaces under `challenges/`): `/challenges`
- Curriculum MCP server: `npm run smoke:curriculum`

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` (portal only) |
| `npm test` | Vitest |
| `npm run content:check` | Validate chapter frontmatter + diagrams |
| `npm run challenge -- <slug>` | Run a challenge validator |
| `npm run challenge -- --all` | Run all validators |
| `npm run build` | Production build + Pagefind hook (noop unless static site) |

## Glossary auto-linking

The `remark-glossary-link` plugin is present under `lib/remark-glossary-link.ts` but **disabled** in `lib/mdx-compile.ts` because MDX + Mermaid + inline `{…}` interactions need a safer AST pass (contributions welcome).

## Workspaces

- `labs/*` — hands-on MCP servers (starter + `solution/`).
- `challenges/*` — MCP servers validated by `tests/validate.ts`.
- `packages/mcp-curriculum-server` — dogfood MCP server exposing curriculum resources.

## License

MIT — see [LICENSE](./LICENSE).

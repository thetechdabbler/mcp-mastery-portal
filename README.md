# MCP Mastery Portal

Next.js + MDX course portal for the **Model Context Protocol** (spec `2025-11-25`, TypeScript SDK `^1.29`).

## Quickstart

```bash
npm install
npm run dev
```

- **MCP track:** `/chapters`, `/labs`, `/challenges`
- **AgentCore track** (multi-agent + LangGraph + MCP): `/agentcore`
- Curriculum MCP servers: `npm run smoke:curriculum`, `npm run smoke:agentcore`

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` (portal only) |
| `npm test` | Vitest |
| `npm run content:check` | Validate chapter frontmatter + diagrams |
| `npm run challenge -- <slug>` | Run an MCP challenge validator (Node) |
| `npm run challenge -- <slug> --track agentcore` | Run an AgentCore challenge (Python via uv) |
| `npm run challenge -- --all` | Run all MCP validators |
| `npm run install:uv` | Install uv for Python labs/challenges |
| `npm run build` | Production build + Pagefind hook (noop unless static site) |

## Glossary auto-linking

The `remark-glossary-link` plugin is present under `lib/remark-glossary-link.ts` but **disabled** in `lib/mdx-compile.ts` because MDX + Mermaid + inline `{…}` interactions need a safer AST pass (contributions welcome).

## Workspaces

- `labs/*` — hands-on MCP servers (starter + `solution/`).
- `challenges/*` — MCP servers validated by `tests/validate.ts`.
- `packages/mcp-curriculum-server` — dogfood MCP server exposing MCP curriculum resources.
- `packages/agentcore-curriculum-server` — dogfood MCP server for the AgentCore track.
- `labs/agentcore/*`, `challenges/agentcore/*` — Python (uv) workspaces for the AgentCore track.

## License

MIT — see [LICENSE](./LICENSE).

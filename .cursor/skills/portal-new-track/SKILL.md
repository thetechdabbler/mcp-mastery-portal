---
name: portal-new-track
description: >-
  Wires a new numbered curriculum track into the MCP Mastery Portal (Next.js):
  types, content paths, loaders, App Router pages, hub/search/challenge scripts,
  diagrams, and tests. Use when adding a track, cloning the LangChain/AgentCore
  layout, or scaffolding chapters/labs/challenges for a new prefix route. When
  the user wants an interactive setup, follow the phased interview and confirm
  before editing files.
disable-model-invocation: true
---

# Portal: add a new curriculum track

Assume the **MCP** track stays at `/` (no prefix). Every other track gets a **`homeHref`** of `/<trackId>` (kebab-case, URL-safe). Mirror **LangChain** or **AgentCore**; do not invent a third layout without updating shared helpers.

## Interactive workflow (default)

Do **not** create or edit files until **Phase 1** is approved.

**Phase 0 — Discovery (user-facing)**

- Treat this as a conversation: one question group at a time if the user is chatty; otherwise batch all unanswered items in a single message.
- Prefer **`AskQuestion`** (multiple choice) when the tool is available; fall back to plain chat questions.
- Validate `trackId`: lowercase, kebab-case, URL-safe (e.g. `my-topic`, not `My Topic` or `my_topic`).

Collect and record:

| Field | Question |
| --- | --- |
| `trackId` | What URL prefix? (kebab-case, becomes `/<trackId>`) |
| `label` / `shortLabel` | Full title for hub/card and short label for chrome? |
| `description` | One-line blurb for `TrackConfig`? |
| `templateTrack` | Mirror **`langchain`** or **`agentcore`** layout? (pick one) |
| `sections` | Which nav sections? (chapters, labs, challenges, reference, playbook, capstone — list exactly) |
| `firstChapterSlug` | First chapter slug for `startHref`? |
| `challengeRunner` | Challenges: **`python`** validators (like LangChain/AgentCore) or **`node`** (MCP style)? |
| `frontmatter` | Track-specific chapter fields: **reuse** template track’s Zod shape as-is, or **new** fields (list)? |
| `diagrams` | Track-scoped D2 under `content/<trackId>/diagrams/`? (yes/no) |
| `seedScope` | **Skeleton only** (minimal files so the build passes) or **full** (mirror template depth)? |

Optional: glossary (`glossary.json`), taglines (`taglines.json`), playbook MDX — ask only if `sections` includes them.

**Phase 1 — Plan (you output, user confirms)**

Post a short **Track spec** block (bullet summary) plus the ordered file/area list you will touch (from the checklist below). End with: *Reply **go** to implement, or say what to change.*

Wait for explicit approval (`go`, `yes`, `lgtm`, or equivalent). Re-read user edits if they change scope mid-stream.

**Phase 2 — Implement**

Execute the checklist in order. After substantive content or route changes, run `npm run diagrams` if D2 sources changed.

**Phase 3 — Validate**

Run `npm run content:check`, `npm run typecheck`, `npm test`. Report pass/fail and any manual QA (`/<trackId>` in dev).

**Phase 4 — Handoff**

Return the Track spec, commands run, files touched, and anything left for the human (copy, icons, secrets).

## Checklist (order matters for fewer broken builds)

**Types and routing**

- [ ] `lib/tracks.ts`: extend `TrackId`, append `TRACKS` entry (`homeHref`, `startHref`, `chaptersIndexHref`, `links`). Add hub path to `TRACK_HUB_PATHS` if the track has a dedicated landing page at `/<trackId>`.
- [ ] `tests/tracks.test.ts`: add cases for `getTrackFromPathname`, `translatePathToTrack`, fallbacks, and `needsTrackSwitchConfirm` for the new hub.

**Content roots**

- [ ] `lib/content-paths.ts`: `CONTENT_ROOT/<trackId>/` constants (`chapters`, `challenges` manifests, `playbook.mdx`, `diagrams`, `glossary.json`, `taglines.json`) and `labs/<trackId>/`, `challenges/<trackId>/`.
- [ ] `content/<trackId>/`: seed `chapters/*.mdx`, `challenges/*.json`, optional `playbook.mdx`, `glossary.json`, `taglines.json`, `diagrams/*.d2`.
- [ ] `labs/<trackId>/`, `challenges/<trackId>/`: same patterns as existing tracks (README, `pyproject.toml`, `tests/validate.py` where used).

**Loaders and diagrams**

- [ ] `lib/<trackId>-content.ts`: copy from `lib/langchain-content.ts` or `lib/agentcore-content.ts`; swap imports to the new path constants and Zod schemas.
- [ ] If the track has a playbook and/or `content/<trackId>/diagrams/`: add `lib/<trackId>-diagram-registry.ts` (copy `lib/langchain-diagram-registry.ts`) and wire any reference pages that list diagrams.
- [ ] `scripts/render-diagrams.mjs`: append `content/<trackId>/diagrams` to `srcDirs`.
- [ ] Diagram `<Diagram id="..." />` IDs must be **globally unique** across MCP + all tracks (see workspace `diagrams.mdc` rule). Run `npm run diagrams` after adding D2 sources.

**App Router**

- [ ] `app/<trackId>/`: mirror `app/langchain/` (or `app/agentcore/`): `page.tsx`, `chapters/`, `labs/`, `challenges/`, `reference/`, `playbook/`, `capstone/` as needed. Replace imports with `lib/<trackId>-content` and correct metadata titles.
- [ ] Chapter detail pages: match existing badge/header patterns (`langchain-version-badge`, `agentcore-version-badge`, or add a small track-specific badge component if required).

**Search, hub, CLI**

- [ ] `lib/search-server.ts`: extend `SearchHit["track"]` and index chapters/labs/challenges via the new getters (follow `langchain` blocks).
- [ ] `app/page.tsx`: extend `TrackHubStats` source `Promise.all` and `stats` array with counts + `randomTagline` for `content/<trackId>/taglines.json` (or a shared fallback string).
- [ ] `scripts/run-challenge.ts`: extend `track` union, `manifestDir`, and `challengesRoot` for the new track; update usage text.
- [ ] `scripts/check-content.ts`: scan new chapters/playbook/diagrams with the correct Zod schema (copy `langchain` / `agentcore` branches).

**Tests**

- [ ] Add or extend Vitest files: content smoke tests, lab/challenge counts if you lock them in, and **diagram ID uniqueness** across `collectDiagramIds`, `collectAgentcoreDiagramIds`, `collectLangchainDiagramIds`, and the new collector (mirror `tests/agentcore-content.test.ts`).

## Conventions

- Chapter MDX: frontmatter `slug` must match the filename stem; `order` controls navigation sorting.
- Challenge manifests: `content/<trackId>/challenges/<slug>.json` with `packageDir` pointing at `challenges/<trackId>/<dir>`.
- Prefer **D2** under `content/<trackId>/diagrams/`; emitted SVGs go to `public/diagrams/` (see `.cursor/rules/diagrams.mdc`).

## Done when

- `npm run content:check`, `npm run typecheck`, and `npm test` pass; spot-check `/<trackId>` → chapters/labs/challenges in the dev server.

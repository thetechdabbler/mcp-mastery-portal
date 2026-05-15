# Architecture

```mermaid
flowchart LR
  content[content_MDX_JSON] --> libContent[lib/content.ts]
  libContent --> pages[Next_RSC_pages]
  pages --> mdx[compileLessonMdx]
  mdx --> remote[next_mdx_remote_rsc]
  labs[workspaces_labs_challenges] --> learner[Learner_CLI]
  packages[packages_curriculum_server] --> host[MCP_host]
```

- **Rendering**: `next-mdx-remote/rsc` + remark/rehype plugins (GFM, glossary autolink, slug, autolink headings).
- **Diagrams**: D2 sources in `content/diagrams/` compiled to `public/diagrams/*.svg` by `npm run diagrams`; `<Diagram />` in MDX inlines the SVG at render time (`components/mdx/diagram.tsx`).
- **Search**: dev substring API + optional Pagefind postbuild for static HTML exports.

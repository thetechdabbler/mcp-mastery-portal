# c-02-rag-citations

Return an answer plus at least one citation dict with `id` and `snippet` for an offline corpus. Reranking must be deterministic — no random tie breaks.

## Validator

From repo root:

```bash
npm run challenge -- rag-citations --track langchain
```

Or from this package directory:

```bash
cd challenges/langchain/c-02-rag-citations
uv run python tests/validate.py
```

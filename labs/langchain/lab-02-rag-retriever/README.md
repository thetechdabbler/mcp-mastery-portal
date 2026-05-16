# lab-02-rag-retriever — RAG arc

Retrieval without a vector database is still retrieval. You wire a toy corpus, score it with deterministic token overlap, simulate a reranker that breaks ties like grown-ups (explicit rules, not vibes), and return an answer that carries **citations** your validator can audit.

This lab stays offline: no API keys, no embeddings download, no "it worked on my laptop" network flake.

## Run

```bash
cd labs/langchain/lab-02-rag-retriever
uv run python src/main.py
```

## Test

```bash
uv run pytest tests/
```

## Stretch goals

- Swap overlap for BM25-ish scoring using only stdlib math.
- Add a `context_budget` that trims quotes before answering.

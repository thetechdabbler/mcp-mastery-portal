# lab-01-first-runnable — foundations arc

Before you touch LangChain proper, internalize what a **Runnable** is supposed to do: same method names, predictable shapes, batching that is not "a for-loop that forgot it has a job," and streaming that actually yields lazily.

You build a toy `RunnableLambda`-style object: `invoke`, `batch`, and `stream`. No cloud. No vendor SDK. Just the contract the ecosystem assumes you respect.

## Run

```bash
cd labs/langchain/lab-01-first-runnable
uv run python src/main.py
```

## Test

```bash
uv run pytest tests/
```

## Stretch goals

- Add `ainvoke` as a thin async wrapper if you want to rehearse later async graphs.
- Log per-call timing in `stream` and prove chunks cross a time boundary (sleep 0 in tests only).

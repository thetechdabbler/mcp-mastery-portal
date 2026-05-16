# lab-04-production-assistant — capstone arc

Wire the boring adult stuff together: **routing**, **retrieval**, a **human approval** path for spicy intents, a **trace log** you can actually read, and a **token budget** cap that prevents runaway loops from impersonating "just one more retrieval."

All local. All deterministic. Still more honest than half the "production" demos you'll read this week.

## Run

```bash
cd labs/langchain/lab-04-production-assistant
uv run python src/main.py
```

## Test

```bash
uv run pytest tests/
```

## Stretch goals

- Add a "fast path" cache keyed by normalized query.
- Emit a JSON trace file and diff it in tests.

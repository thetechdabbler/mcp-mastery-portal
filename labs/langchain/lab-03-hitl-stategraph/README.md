# lab-03-hitl-stategraph — LangGraph / HITL arc

LangGraph nodes are cool; **interrupt/resume** is where production either earns trust or earns an incident. Here you simulate a tiny graph with an explicit human gate—no server, no checkpoint store, just state you can reason about.

You will implement `draft → interrupt (human) → finalize` with a clean payload surface so your UI—or a grumpy validator—can approve or reject deterministically.

## Run

```bash
cd labs/langchain/lab-03-hitl-stategraph
uv run python src/main.py
```

## Test

```bash
uv run pytest tests/
```

## Stretch goals

- Add a second interrupt for "compliance" with a nested resume token.
- Serialize state to JSON and prove you can rebuild mid-flight.

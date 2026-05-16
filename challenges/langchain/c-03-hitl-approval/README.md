# c-03-hitl-approval

Simulate draft → human interrupt → resume. The validator is pedantic about stage names and trace ordering — lean into it.

## Validator

From repo root:

```bash
npm run challenge -- hitl-approval --track langchain
```

Or from this package directory:

```bash
cd challenges/langchain/c-03-hitl-approval
uv run python tests/validate.py
```

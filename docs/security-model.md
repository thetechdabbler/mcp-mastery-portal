# Security model

## Portal surface

- Static curriculum pages render MDX server-side; no remote MDX execution.
- Quiz + progress use `localStorage` only.
- Search API (`/api/search`) performs substring search over local files—no external calls.

## Inspector threat model

The `/api/inspector/proxy` route intentionally performs **server-side HTTP** on behalf of the operator.

Controls:

- HTTPS by default for remote targets.
- Opt-in `http://localhost` / `127.0.0.1` only.
- Hostname private-space blocking for obvious literals.
- Per-IP token-bucket rate limiting (in-process; resets on deploy).
- Optional `Authorization` forwarding only with explicit UI opt-in.

Residual risks:

- DNS rebinding / split-horizon attacks require network-level controls not implemented here.
- Operators can still exfiltrate data they can already reach—this tool is not an audit substitute.

## MCP curriculum content

Chapters describe threat models for MCP deployments; they are not guarantees about this repository’s runtime when you self-host with different configs.

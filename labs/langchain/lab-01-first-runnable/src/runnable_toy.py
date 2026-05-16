"""Minimal Runnable-shaped building block (stdlib only)."""

from __future__ import annotations

from collections.abc import Iterator


class RunnableToy:
    """
    Contract sketch:
    - invoke: single input dict -> output dict
    - batch: list of inputs -> list of outputs (same order)
    - stream: single input -> iterator of string chunks (UTF-8 safe)
    """

    def invoke(self, input: dict) -> dict:
        n = int(input["n"])
        return {"out": n * 2}

    def batch(self, inputs: list[dict]) -> list[dict]:
        return [self.invoke(x) for x in inputs]

    def stream(self, input: dict) -> Iterator[str]:
        out = str(self.invoke(input)["out"])
        yield from out

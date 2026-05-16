"""Implement RunnableContract — invoke/batch/stream must match validator expectations."""

from __future__ import annotations

from collections.abc import Iterator


class RunnableContract:
    """Double the integer field `n` in the input dict; stream UTF-8 string of decimal `out`."""

    def invoke(self, input: dict) -> dict:
        n = int(input["n"])
        return {"out": n * 2}

    def batch(self, inputs: list[dict]) -> list[dict]:
        return [self.invoke(x) for x in inputs]

    def stream(self, input: dict) -> Iterator[str]:
        out = str(self.invoke(input)["out"])
        yield from out

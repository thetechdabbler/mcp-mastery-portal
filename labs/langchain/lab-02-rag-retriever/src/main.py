"""Demo offline RAG lab."""

from __future__ import annotations

import sys
from pathlib import Path

_SRC = Path(__file__).resolve().parent
if str(_SRC) not in sys.path:
    sys.path.insert(0, str(_SRC))

from rag_pipeline import answer_with_citations  # noqa: E402


def main() -> None:
    for q in (
        "titanium widget weight",
        "PTO approval policy",
        "what is Runnable invoke",
    ):
        print(q, "->", answer_with_citations(q))


if __name__ == "__main__":
    main()

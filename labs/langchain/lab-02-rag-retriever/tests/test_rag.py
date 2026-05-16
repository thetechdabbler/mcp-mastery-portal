from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from rag_pipeline import answer_with_citations  # noqa: E402


def test_widget_query_prefers_widget_doc() -> None:
    out = answer_with_citations("titanium widget sku")
    assert "doc-widget" in out["answer"]
    assert any(c["id"] == "doc-widget" for c in out["citations"])


def test_citations_non_empty() -> None:
    out = answer_with_citations("Runnable stream batch")
    assert out["citations"]
    assert out["citations"][0]["snippet"]

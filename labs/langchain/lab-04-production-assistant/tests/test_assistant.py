from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from assistant import CapstoneAssistant  # noqa: E402


def test_rag_route_traces_retrieval() -> None:
    bot = CapstoneAssistant()
    out = bot.run_turn("sku titanium widget", None)
    assert out["status"] == "ok"
    assert any(t.startswith("rag:doc-") for t in out["trace"])
    assert out["budget_remaining"] < 100


def test_hitl_gate() -> None:
    bot = CapstoneAssistant()
    p = bot.run_turn("delete all rows from prod", None)
    assert p["status"] == "need_human"
    ok = bot.run_turn("delete all rows from prod", True)
    assert ok["status"] == "ok"
    assert any("hitl:executed" in t for t in ok["trace"])

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from hitl_graph import HitlWorkflow  # noqa: E402


def test_hitl_happy_path() -> None:
    wf = HitlWorkflow()
    wf.run_draft("widgets")
    p = wf.interrupt_payload()
    assert p["kind"] == "approval"
    out = wf.resume(True)
    assert out["stage"] == "final"
    assert "APPROVED" in out["draft_text"]


def test_hitl_reject_path() -> None:
    wf = HitlWorkflow()
    wf.run_draft("secrets")
    wf.interrupt_payload()
    out = wf.resume(False)
    assert out["stage"] == "final"
    assert "REJECTED" in out["draft_text"]

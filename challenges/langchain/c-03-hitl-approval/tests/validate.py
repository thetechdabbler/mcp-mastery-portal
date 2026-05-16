"""Challenge validator — exit 0 on success."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.hitl import HitlWorkflow  # noqa: E402


def main() -> int:
    wf = HitlWorkflow()
    s0 = wf.run_draft(" ship the hotfix ")
    if s0["stage"] != "awaiting_human":
        print("FAIL: expected awaiting_human after draft")
        return 1
    payload = wf.interrupt_payload()
    if payload.get("kind") != "approval":
        print("FAIL: interrupt payload kind")
        return 1
    if "interrupt:human_review" not in wf.trace:
        print("FAIL: missing interrupt trace")
        return 1
    fin = wf.resume(True)
    if fin["stage"] != "final" or fin.get("human_decision") is not True:
        print("FAIL: approved path")
        return 1
    if "node:finalize" not in fin["trace"]:
        print("FAIL: finalize node trace")
        return 1

    wf2 = HitlWorkflow()
    wf2.run_draft("x")
    wf2.interrupt_payload()
    fin2 = wf2.resume(False)
    if "REJECTED" not in fin2["draft_text"] or fin2["human_decision"] is not False:
        print("FAIL: reject path")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

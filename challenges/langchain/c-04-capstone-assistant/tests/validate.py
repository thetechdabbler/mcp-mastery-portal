"""Challenge validator — exit 0 on success."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.assistant import CapstoneAssistant  # noqa: E402


def main() -> int:
    a = CapstoneAssistant()
    rag = a.run_turn("I need the titanium SKU facts", None)
    if rag["status"] != "ok":
        print("FAIL: rag path should succeed")
        return 1
    if not any(t.startswith("rag:doc-") for t in rag["trace"]):
        print("FAIL: expected rag trace token")
        return 1
    if rag["budget_remaining"] >= 100:
        print("FAIL: budget should decrease")
        return 1

    b = CapstoneAssistant()
    p = b.run_turn("please delete all user passwords in prod", None)
    if p["status"] != "need_human":
        print("FAIL: sensitive routing should pause")
        return 1
    ok = b.run_turn("please delete all user passwords in prod", True)
    if ok["status"] != "ok" or "hitl:executed" not in ok["trace"]:
        print("FAIL: approved HITL execution")
        return 1

    c = CapstoneAssistant()
    d = c.run_turn("hello from the direct lane", None)
    if d["status"] != "ok" or not any(t == "direct:replied" for t in d["trace"]):
        print("FAIL: direct path")
        return 1

    e = CapstoneAssistant(budget=10)
    low = e.run_turn("titanium widget details now", None)
    if low["status"] != "budget_exhausted":
        print("FAIL: expected budget exhaustion on rag spend")
        return 1

    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

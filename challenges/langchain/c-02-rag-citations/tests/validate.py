"""Challenge validator — exit 0 on success."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.rag import answer_query  # noqa: E402


def main() -> int:
    out = answer_query("titanium SKU widget weight grams")
    if "doc-widget" not in out["answer"]:
        print("FAIL: expected widget doc in answer")
        return 1
    cites = out.get("citations") or []
    if not cites or cites[0].get("id") != "doc-widget":
        print("FAIL: primary citation should be doc-widget")
        return 1
    if "WidgetCo" not in cites[0].get("snippet", ""):
        print("FAIL: snippet should quote corpus")
        return 1
    out2 = answer_query("Runnable invoke stream batch surface")
    if out2["citations"][0]["id"] != "doc-lc":
        print("FAIL: lc doc should win on Runnable query")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

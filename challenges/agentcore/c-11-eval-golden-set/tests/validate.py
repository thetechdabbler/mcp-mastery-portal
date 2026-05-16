"""Challenge validator — exit 0 on success."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.agent import build_graph  # noqa: E402


def main() -> int:
    app = build_graph()
    out = app.invoke({"messages": ["validate"]})
    if "messages" not in out or not out["messages"]:
        print("FAIL: expected messages in state")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

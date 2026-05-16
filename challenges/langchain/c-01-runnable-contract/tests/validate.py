"""Challenge validator — exit 0 on success."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.runnable import RunnableContract  # noqa: E402


def main() -> int:
    r = RunnableContract()
    if r.invoke({"n": 9}) != {"out": 18}:
        print("FAIL: invoke contract")
        return 1
    if r.batch([{"n": 2}, {"n": 3}, {"n": 4}]) != [{"out": 4}, {"out": 6}, {"out": 8}]:
        print("FAIL: batch contract")
        return 1
    if "".join(r.stream({"n": 21})) != "42":
        print("FAIL: stream contract")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""Demo CLI for lab-01-first-runnable."""

from __future__ import annotations

import sys
from pathlib import Path

_SRC = Path(__file__).resolve().parent
if str(_SRC) not in sys.path:
    sys.path.insert(0, str(_SRC))

from runnable_toy import RunnableToy


def main() -> None:
    r = RunnableToy()
    print("invoke:", r.invoke({"n": 7}))
    print("batch:", r.batch([{"n": 1}, {"n": 2}, {"n": 3}]))
    print("stream:", "".join(r.stream({"n": 21})))


if __name__ == "__main__":
    main()

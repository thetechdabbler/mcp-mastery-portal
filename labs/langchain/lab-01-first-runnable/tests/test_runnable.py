from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from runnable_toy import RunnableToy  # noqa: E402


def test_invoke_batch_stream_contract() -> None:
    r = RunnableToy()
    assert r.invoke({"n": 3}) == {"out": 6}
    assert r.batch([{"n": 10}, {"n": 11}]) == [{"out": 20}, {"out": 22}]
    assert "".join(r.stream({"n": 5})) == "10"

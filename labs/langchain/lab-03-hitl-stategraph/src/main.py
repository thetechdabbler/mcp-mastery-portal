"""Demo HITL simulation."""

from __future__ import annotations

import sys
from pathlib import Path

_SRC = Path(__file__).resolve().parent
if str(_SRC) not in sys.path:
    sys.path.insert(0, str(_SRC))

from hitl_graph import HitlWorkflow  # noqa: E402


def main() -> None:
    wf = HitlWorkflow()
    print("draft:", wf.run_draft("release the firmware"))
    print("interrupt:", wf.interrupt_payload())
    print("approved:", wf.resume(True))


if __name__ == "__main__":
    main()

"""Capstone lab demo CLI."""

from __future__ import annotations

import sys
from pathlib import Path

_SRC = Path(__file__).resolve().parent
if str(_SRC) not in sys.path:
    sys.path.insert(0, str(_SRC))

from assistant import CapstoneAssistant  # noqa: E402


def main() -> None:
    bot = CapstoneAssistant()
    print(bot.run_turn("tell me about the titanium widget", None))
    print(bot.run_turn("hello there friend", None))
    pending = bot.run_turn("please delete all customer backups", None)
    print("pending", pending)
    bot2 = CapstoneAssistant()
    print(bot2.run_turn("please delete all customer backups", True))


if __name__ == "__main__":
    main()

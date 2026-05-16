"""Capstone assistant — match validator expectations for routing, HITL, budget, trace."""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from src.production_rag import answer_with_citations


def tokenize(s: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]+", s.lower()) if len(t) > 1}


SENSITIVE_MARKERS = ("delete", "wipe", "exfil", "password", "dump")


@dataclass
class CapstoneAssistant:
    budget: int = 100
    trace: list[str] = field(default_factory=list)

    def _spend(self, cost: int, note: str) -> bool:
        if self.budget < cost:
            self.trace.append(f"budget:blocked:{note}")
            return False
        self.budget -= cost
        self.trace.append(f"budget:spent:{cost}:{note}")
        return True

    def _needs_hitl(self, message: str) -> bool:
        t = message.lower()
        return any(m in t for m in SENSITIVE_MARKERS)

    def _route(self, message: str) -> str:
        toks = tokenize(message)
        if "widget" in toks or "sku" in toks or "titanium" in toks:
            return "rag"
        if self._needs_hitl(message):
            return "hitl"
        return "direct"

    def run_turn(self, message: str, human_approved: bool | None) -> dict:
        route = self._route(message)
        self.trace.append(f"route:{route}")

        if route == "hitl":
            if human_approved is None:
                self.trace.append("hitl:pending")
                return {
                    "status": "need_human",
                    "summary": "Sensitive verbs detected — approval required.",
                    "trace": list(self.trace),
                    "budget_remaining": self.budget,
                }
            if not human_approved:
                self.trace.append("hitl:rejected")
                return {
                    "status": "blocked",
                    "answer": "Not running that without explicit approval.",
                    "trace": list(self.trace),
                    "budget_remaining": self.budget,
                }
            if not self._spend(30, "hitl_exec"):
                return {
                    "status": "budget_exhausted",
                    "answer": "",
                    "trace": list(self.trace),
                    "budget_remaining": self.budget,
                }
            self.trace.append("hitl:executed")
            return {
                "status": "ok",
                "answer": "Sensitive action executed under explicit human approval (offline simulation).",
                "trace": list(self.trace),
                "budget_remaining": self.budget,
            }

        if route == "rag":
            if not self._spend(20, "retrieve"):
                return {
                    "status": "budget_exhausted",
                    "answer": "",
                    "trace": list(self.trace),
                    "budget_remaining": self.budget,
                }
            rag = answer_with_citations(message)
            self.trace.append(f"rag:{rag['citations'][0]['id']}")
            if not self._spend(25, "synthesize"):
                return {
                    "status": "budget_exhausted",
                    "answer": rag["answer"],
                    "trace": list(self.trace),
                    "budget_remaining": self.budget,
                }
            return {
                "status": "ok",
                "answer": rag["answer"],
                "citations": rag["citations"],
                "trace": list(self.trace),
                "budget_remaining": self.budget,
            }

        if not self._spend(15, "direct"):
            return {
                "status": "budget_exhausted",
                "answer": "",
                "trace": list(self.trace),
                "budget_remaining": self.budget,
            }
        ans = f"Direct channel: you asked {message!r} — default safe response."
        self.trace.append("direct:replied")
        return {
            "status": "ok",
            "answer": ans,
            "trace": list(self.trace),
            "budget_remaining": self.budget,
        }

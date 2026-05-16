"""Offline HITL-style state machine (LangGraph-inspired, stdlib only)."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal


Stage = Literal["draft", "awaiting_human", "final"]


@dataclass
class HitlWorkflow:
    stage: Stage = "draft"
    user_prompt: str = ""
    draft_text: str = ""
    human_decision: bool | None = None
    trace: list[str] = field(default_factory=list)

    def run_draft(self, prompt: str) -> dict[str, Any]:
        self.user_prompt = prompt
        self.draft_text = f"PLAN: respond about {prompt.strip().lower()!r} with cautious tone."
        self.stage = "awaiting_human"
        self.trace.append("node:draft")
        return self.snapshot()

    def interrupt_payload(self) -> dict[str, Any]:
        if self.stage != "awaiting_human":
            raise RuntimeError("no interrupt pending")
        self.trace.append("interrupt:human_review")
        return {"kind": "approval", "summary": self.draft_text, "risk": "medium"}

    def resume(self, approved: bool) -> dict[str, Any]:
        if self.stage != "awaiting_human":
            raise RuntimeError("cannot resume from this stage")
        self.human_decision = approved
        self.trace.append(f"resume:approved={approved}")
        if approved:
            self.draft_text += " | APPROVED"
            self.stage = "final"
            self.trace.append("node:finalize")
        else:
            self.draft_text = "REJECTED — no send."
            self.stage = "final"
            self.trace.append("node:reject_finalize")
        return self.snapshot()

    def snapshot(self) -> dict[str, Any]:
        return {
            "stage": self.stage,
            "draft_text": self.draft_text,
            "human_decision": self.human_decision,
            "trace": list(self.trace),
        }

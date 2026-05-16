"""Offline citations for capstone challenge (matches lab corpus)."""

from __future__ import annotations

import re
from typing import TypedDict


class Doc(TypedDict):
    id: str
    text: str
    priority: int


CORPUS: list[Doc] = [
    {
        "id": "doc-widget",
        "text": "WidgetCo titanium widget spec: 12 grams, SKU W-12, release Q3.",
        "priority": 2,
    },
    {
        "id": "doc-hr",
        "text": "Acme HR: PTO requires manager approval within 48 hours of request.",
        "priority": 1,
    },
    {
        "id": "doc-lc",
        "text": "LangChain Runnable protocol: invoke, batch, stream are the portable surface.",
        "priority": 3,
    },
]


def tokenize(s: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]+", s.lower()) if len(t) > 1}


def retrieval_score(query: str, doc: Doc) -> int:
    q_toks = tokenize(query)
    d_toks = tokenize(doc["text"])
    if not q_toks:
        return 0
    return len(q_toks & d_toks)


def retrieve(query: str, *, top_k: int = 2) -> list[Doc]:
    scored = [(retrieval_score(query, d), d) for d in CORPUS]
    scored.sort(key=lambda x: x[0], reverse=True)
    return [d for s, d in scored[:top_k] if s > 0] or [CORPUS[2]]


def rerank(query: str, docs: list[Doc]) -> list[Doc]:
    def key(d: Doc) -> tuple[int, int, str]:
        s = retrieval_score(query, d)
        return (s, d["priority"], d["id"])

    return sorted(docs, key=key, reverse=True)


def answer_with_citations(query: str) -> dict:
    raw = retrieve(query, top_k=3)
    ranked = rerank(query, raw)
    top = ranked[0]
    snippet = top["text"][:120].strip()
    if len(top["text"]) > 120:
        snippet += "…"
    answer = f"Based on [{top['id']}]: {snippet}"
    return {
        "answer": answer,
        "citations": [{"id": top["id"], "snippet": snippet}],
    }

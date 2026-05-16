from src.agent import build_graph

def test_graph_runs():
    app = build_graph()
    out = app.invoke({"messages": []})
    assert "messages" in out
    assert len(out["messages"]) >= 1

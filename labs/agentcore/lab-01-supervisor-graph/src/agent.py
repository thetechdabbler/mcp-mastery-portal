"""Lab 1 starter — implement the graph in build_graph()."""

from typing import TypedDict

from langgraph.graph import END, START, StateGraph


class AgentState(TypedDict, total=False):
    messages: list[str]
    route: str


def build_graph():
    g = StateGraph(AgentState)

    def planner(state: AgentState) -> AgentState:
        return {"route": "worker", "messages": state.get("messages", []) + ["planned"]}

    def worker(state: AgentState) -> AgentState:
        return {"messages": state.get("messages", []) + ["worked"]}

    g.add_node("planner", planner)
    g.add_node("worker", worker)
    g.add_edge(START, "planner")
    g.add_edge("planner", "worker")
    g.add_edge("worker", END)
    return g.compile()


if __name__ == "__main__":
    app = build_graph()
    out = app.invoke({"messages": ["hello"]})
    print(out)

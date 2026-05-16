#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const labsRoot = path.join(root, "labs/agentcore");
const challengesRoot = path.join(root, "challenges/agentcore");

const LABS = [
  ["lab-01-supervisor-graph", "Build a minimal LangGraph supervisor with mocked workers (local only)."],
  ["lab-02-stategraph-routing", "Conditional edges and checkpointed state without AWS."],
  ["lab-03-mock-bedrock-client", "Mock Bedrock client for deterministic tests."],
  ["lab-04-runtime-deploy", "Package and deploy to AgentCore Runtime (AWS account required)."],
  ["lab-05-memory-session", "Short-term session memory with AgentCore Memory."],
  ["lab-06-memory-longterm", "Long-term semantic recall patterns."],
  ["lab-07-identity-delegate", "Workload identity and scoped tool tokens."],
  ["lab-08-gateway-rest", "Gateway tool targeting a REST API."],
  ["lab-09-gateway-mcp", "Gateway exposing an MCP server as tools."],
  ["lab-10-capstone-triage", "Full multi-agent triage with teardown script."],
];

const CHALLENGES = [
  "c-01-supervisor-routing",
  "c-02-stategraph-basics",
  "c-03-mock-bedrock-node",
  "c-04-memory-write-read",
  "c-05-gateway-tool-call",
  "c-06-identity-token",
  "c-07-mcp-via-gateway",
  "c-08-observability-span",
  "c-09-worker-handoff",
  "c-10-runtime-invoke",
  "c-11-eval-golden-set",
  "c-12-capstone-triage",
];

const PYPROJECT = (name) => `[project]
name = "${name}"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "langgraph>=0.4.0",
  "langchain-core>=0.3.0",
]

[project.optional-dependencies]
dev = ["pytest>=8.0"]

[tool.uv]
dev-dependencies = []
`;

const AGENT_PY = (labNum) => `"""Lab ${labNum} starter — implement the graph in build_graph()."""

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
`;

const TEST_AGENT = `from src.agent import build_graph

def test_graph_runs():
    app = build_graph()
    out = app.invoke({"messages": []})
    assert "messages" in out
    assert len(out["messages"]) >= 1
`;

const VALIDATE_PY = `"""Challenge validator — exit 0 on success."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.agent import build_graph  # noqa: E402


def main() -> int:
    app = build_graph()
    out = app.invoke({"messages": ["validate"]})
    if "messages" not in out or not out["messages"]:
        print("FAIL: expected messages in state")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
`;

fs.mkdirSync(labsRoot, { recursive: true });
fs.mkdirSync(challengesRoot, { recursive: true });

let n = 0;
for (const [dir, desc] of LABS) {
  n += 1;
  const base = path.join(labsRoot, dir);
  fs.mkdirSync(path.join(base, "src"), { recursive: true });
  fs.mkdirSync(path.join(base, "tests"), { recursive: true });
  fs.writeFileSync(path.join(base, "pyproject.toml"), PYPROJECT(dir));
  fs.writeFileSync(path.join(base, "src/agent.py"), AGENT_PY(n));
  fs.writeFileSync(path.join(base, "tests/test_agent.py"), TEST_AGENT);
  const awsNote = n <= 3 ? "Local only — no AWS account." : "Requires AWS credentials and IAM per README.";
  fs.writeFileSync(
    path.join(base, "README.md"),
    `# ${dir}\n\n${desc}\n\n## Run\n\n\`\`\`bash\nuv run python src/agent.py\n\`\`\`\n\n## Test\n\n\`\`\`bash\nuv run pytest tests/\n\`\`\`\n\n## AWS\n\n${awsNote}\n`,
  );
}

for (const dir of CHALLENGES) {
  const base = path.join(challengesRoot, dir);
  fs.mkdirSync(path.join(base, "src"), { recursive: true });
  fs.mkdirSync(path.join(base, "tests"), { recursive: true });
  fs.writeFileSync(path.join(base, "pyproject.toml"), PYPROJECT(dir));
  fs.writeFileSync(path.join(base, "src/agent.py"), AGENT_PY(0));
  fs.writeFileSync(path.join(base, "tests/validate.py"), VALIDATE_PY);
  fs.writeFileSync(
    path.join(base, "README.md"),
    `# ${dir}\n\nRun validator:\n\n\`\`\`bash\nuv run python tests/validate.py\n\`\`\`\n\nOr from repo root:\n\n\`\`\`bash\nnpm run challenge -- ${dir.replace(/^c-\d+-/, "")} --track agentcore\n\`\`\`\n`,
  );
}

console.log("seed-agentcore-labs:", LABS.length, "labs,", CHALLENGES.length, "challenges");

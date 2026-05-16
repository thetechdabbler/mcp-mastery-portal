#!/usr/bin/env node
/**
 * One-shot seed for AgentCore track content (chapters, diagrams, manifests).
 * Run: node scripts/seed-agentcore-content.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const chaptersDir = path.join(root, "content/agentcore/chapters");
const diagramsDir = path.join(root, "content/agentcore/diagrams");
const challengesDir = path.join(root, "content/agentcore/challenges");

const QUIZ = (topic) => [
  {
    q: `What is the primary focus of ${topic}?`,
    options: ["GPU tuning", "Multi-agent orchestration with MCP", "CSS grids", "DNS TTL"],
    answer: 1,
    explain: "This track covers LangGraph orchestration on AWS Bedrock AgentCore with MCP tools.",
  },
  {
    q: "Which pattern routes work between specialized agents?",
    options: ["Singleton", "Supervisor / worker", "Factory method only", "B-tree indexing"],
    answer: 1,
    explain: "Supervisor graphs delegate to workers with explicit handoff contracts.",
  },
  {
    q: "Why expose tools through AgentCore Gateway?",
    options: [
      "To remove auth",
      "To unify REST, Lambda, and MCP servers behind one tool surface",
      "To disable observability",
      "To avoid schemas",
    ],
    answer: 1,
    explain: "Gateway normalizes external capabilities for agents with governance hooks.",
  },
];

const REFS = [
  { label: "Amazon Bedrock AgentCore", url: "https://docs.aws.amazon.com/bedrock-agentcore/" },
  { label: "LangGraph docs", url: "https://langchain-ai.github.io/langgraph/" },
  { label: "Model Context Protocol", url: "https://modelcontextprotocol.io/" },
];

const CHAPTERS = [
  {
    slug: "01-multi-agent-primer",
    order: 1,
    title: "Multi-Agent Systems Primer",
    subtitle: "Supervisors, workers, swarms, and why handoffs need contracts.",
    difficulty: "warmup",
    estMinutes: 25,
    features: ["runtime"],
    diagram: "ac-multi-agent-topology",
    d2: `direction: right
Supervisor -> WorkerA: task slice
Supervisor -> WorkerB: task slice
WorkerA -> Supervisor: result + state
WorkerB -> Supervisor: result + state
MCP: {shape: cloud}
WorkerA -> MCP: tools
WorkerB -> MCP: tools`,
  },
  {
    slug: "02-agentcore-platform",
    order: 2,
    title: "AgentCore in One Diagram",
    subtitle: "Runtime, Memory, Identity, Gateway, Browser, Code Interpreter, Observability.",
    difficulty: "warmup",
    estMinutes: 30,
    features: ["runtime", "memory", "identity", "gateway", "browser", "code-interpreter", "observability"],
    diagram: "ac-platform-overview",
    d2: `direction: down
Runtime -> Memory: session + long-term
Runtime -> Identity: workload auth
Runtime -> Gateway: tools
Gateway -> MCP: MCP servers
Runtime -> Observability: traces`,
  },
  {
    slug: "03-langgraph-fundamentals",
    order: 3,
    title: "LangGraph Fundamentals",
    subtitle: "StateGraph, nodes, edges, conditional routing, checkpointing.",
    difficulty: "mid",
    estMinutes: 35,
    features: ["runtime"],
    diagram: "ac-langgraph-state",
    d2: `direction: right
START -> Planner: invoke
Planner -> Router: route
Router -> ToolNode: tools
ToolNode -> Planner: loop
Planner -> END: finish`,
  },
  {
    slug: "04-supervisor-pattern",
    order: 4,
    title: "Supervisor Pattern in LangGraph",
    subtitle: "Local graphs with mocked Bedrock — no AWS account required.",
    difficulty: "mid",
    estMinutes: 40,
    features: ["runtime"],
    diagram: "ac-supervisor-routing",
    d2: `direction: right
User -> Supervisor: message
Supervisor -> Researcher: delegate
Supervisor -> Coder: delegate
Researcher -> Supervisor: observation
Coder -> Supervisor: observation`,
  },
  {
    slug: "05-agentcore-runtime",
    order: 5,
    title: "AgentCore Runtime",
    subtitle: "Package and deploy a LangGraph agent to managed runtime.",
    difficulty: "mid",
    estMinutes: 45,
    features: ["runtime", "observability"],
    diagram: "ac-runtime-deploy",
    d2: `direction: right
Dev -> Build: container
Build -> Runtime: deploy
Runtime -> Invoke: sessions
Invoke -> Observability: traces`,
  },
  {
    slug: "06-agentcore-memory",
    order: 6,
    title: "AgentCore Memory",
    subtitle: "Short-term sessions and long-term semantic recall.",
    difficulty: "mid",
    estMinutes: 40,
    features: ["memory"],
    diagram: "ac-memory-tiers",
    d2: `direction: down
Session -> ShortTerm: working context
ShortTerm -> LongTerm: consolidate
LongTerm -> Retrieve: semantic search`,
  },
  {
    slug: "07-agentcore-identity",
    order: 7,
    title: "AgentCore Identity",
    subtitle: "Workload identity and delegated tool authentication.",
    difficulty: "boss",
    estMinutes: 45,
    features: ["identity"],
    diagram: "ac-identity-delegate",
    d2: `direction: right
Agent -> Identity: assume role
Identity -> Gateway: scoped token
Gateway -> ExternalAPI: call`,
  },
  {
    slug: "08-agentcore-gateway",
    order: 8,
    title: "AgentCore Gateway + MCP",
    subtitle: "Expose REST, Lambda, and MCP servers as agent tools.",
    difficulty: "boss",
    estMinutes: 50,
    features: ["gateway"],
    diagram: "ac-gateway-mcp",
    d2: `direction: right
Agent -> Gateway: tool call
Gateway -> MCP_Server: JSON-RPC
Gateway -> REST_API: HTTP
Gateway -> Lambda: invoke`,
  },
  {
    slug: "09-observability-evaluation",
    order: 9,
    title: "Observability and Evaluation",
    subtitle: "CloudWatch GenAI metrics, traces, and golden evaluation sets.",
    difficulty: "boss",
    estMinutes: 40,
    features: ["observability"],
    diagram: "ac-observability",
    d2: `direction: right
Trace -> Metrics: aggregate
Metrics -> Dashboard: SLO
GoldenSet -> Eval: regression`,
  },
  {
    slug: "10-capstone-multi-agent-triage",
    order: 10,
    title: "Capstone: Multi-Agent Triage",
    subtitle: "LangGraph supervisor, two Runtime workers, Memory, Identity, Gateway MCP tool.",
    difficulty: "nightmare",
    estMinutes: 90,
    features: ["runtime", "memory", "identity", "gateway", "observability"],
    diagram: "ac-capstone-triage",
    d2: `direction: down
Supervisor -> WorkerOps: ticket
Supervisor -> WorkerDocs: context
WorkerOps -> Gateway: MCP tool
WorkerDocs -> Memory: recall
Gateway -> MCP: search`,
  },
];

function mdx(ch) {
  const objectives = [
    `Explain ${ch.title.toLowerCase()} in production terms`,
    "Relate LangGraph graphs to AgentCore primitives",
    "Identify where MCP tools attach in the topology",
  ];
  return `---
slug: "${ch.slug}"
title: "${ch.title}"
subtitle: "${ch.subtitle}"
track: "agentcore"
order: ${ch.order}
difficulty: "${ch.difficulty}"
estMinutes: ${ch.estMinutes}
langgraphVersion: "^0.4"
pythonVersion: ">=3.11"
lastReviewed: "2026-05-16"
mistakesPrevented: 4
agentcoreFeatures:
${ch.features.map((f) => `  - "${f}"`).join("\n")}
objectives:
${objectives.map((o) => `  - "${o}"`).join("\n")}
diagrams:
  - "${ch.diagram}"
quiz:
${QUIZ(ch.title)
  .map(
    (q) => `  - q: "${q.q}"
    options:
${q.options.map((o) => `      - "${o}"`).join("\n")}
    answer: ${q.answer}
    explain: "${q.explain}"`,
  )
  .join("\n")}
references:
${REFS.map((r) => `  - label: "${r.label}"\n    url: "${r.url}"`).join("\n")}
---

## Overview

${ch.subtitle}

<Diagram id="${ch.diagram}" caption="${ch.title} architecture." alt="Diagram for ${ch.title}" />

## Key ideas

- **LangGraph** owns orchestration: explicit state, nodes, and conditional edges.
- **AgentCore** owns production concerns: runtime hosting, memory, identity, gateway, observability.
- **MCP** standardizes tool surfaces so workers do not hard-code every backend integration.

<Callout variant="info">
Labs ${ch.order <= 3 ? "1–3" : ch.order <= 9 ? "4–9" : "10"} in \`labs/agentcore/\` follow a ${ch.order <= 3 ? "local mocked" : ch.order <= 9 ? "real AWS" : "full deploy"} progression. Read the lab README for IAM and cost notes.
</Callout>

## Walkthrough

1. Model the workflow as a graph: who plans, who executes tools, who summarizes.
2. Attach MCP tools through Gateway (or local mocks in early labs).
3. Add Memory for session continuity and Identity before calling protected APIs.
4. Instrument traces and run golden-set evals before promoting changes.

<RealTalk>
If your supervisor cannot explain *why* it routed to a worker, you do not have observability — you have vibes with extra steps.
</RealTalk>
`;
}

fs.mkdirSync(chaptersDir, { recursive: true });
fs.mkdirSync(diagramsDir, { recursive: true });

for (const ch of CHAPTERS) {
  fs.writeFileSync(path.join(chaptersDir, `${ch.slug}.mdx`), mdx(ch));
  fs.writeFileSync(path.join(diagramsDir, `${ch.diagram}.d2`), ch.d2 + "\n");
}

const playbookD2 = `direction: right
Supervisor -> Worker: handoff without schema
Worker -> Tool: over-broad MCP call
Tool -> Data: leak`;
fs.writeFileSync(path.join(diagramsDir, "ac-playbook-handoff-fail.d2"), playbookD2 + "\n");

fs.writeFileSync(
  path.join(root, "content/agentcore/playbook.mdx"),
  `---
title: "Multi-Agent Playbook"
---

## Failure: ambiguous handoffs

<Diagram id="ac-playbook-handoff-fail" caption="Handoffs without schemas invite wrong-tool calls." alt="Failed handoff flow" />

## Mitigation

- Define handoff payloads with versioned JSON schemas.
- Scope MCP tools per worker; never give the supervisor every tool by default.
- Log routing decisions and tool arguments (redacted) to AgentCore observability.
`,
);

fs.writeFileSync(
  path.join(root, "content/agentcore/glossary.json"),
  JSON.stringify(
    [
      {
        term: "AgentCore Runtime",
        slug: "agentcore-runtime",
        definition: "Managed execution environment for deploying agent frameworks like LangGraph.",
      },
      {
        term: "Supervisor pattern",
        slug: "supervisor-pattern",
        aliases: ["supervisor graph"],
        definition: "Orchestrator agent that delegates subtasks to specialized worker agents.",
      },
      {
        term: "AgentCore Gateway",
        slug: "agentcore-gateway",
        definition: "Facade that exposes REST, Lambda, and MCP capabilities as unified agent tools.",
      },
      {
        term: "LangGraph StateGraph",
        slug: "langgraph-stategraph",
        definition: "Graph abstraction with shared state, nodes, and conditional edges for agent workflows.",
      },
    ],
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(root, "content/agentcore/taglines.json"),
  JSON.stringify(
    [
      "Multi-agent systems without the mystery meat architecture diagrams.",
      "LangGraph plans. AgentCore ships. MCP connects.",
      "Your supervisor agent needs boundaries, not more tools.",
    ],
    null,
    2,
  ) + "\n",
);

const CHALLENGE_MANIFESTS = [
  ["supervisor-routing", "Supervisor Routing", "c-01-supervisor-routing", "warmup", 20],
  ["stategraph-basics", "StateGraph Basics", "c-02-stategraph-basics", "warmup", 25],
  ["mock-bedrock-node", "Mock Bedrock Node", "c-03-mock-bedrock-node", "warmup", 25],
  ["memory-write-read", "Memory Write Read", "c-04-memory-write-read", "mid", 30],
  ["gateway-tool-call", "Gateway Tool Call", "c-05-gateway-tool-call", "mid", 35],
  ["identity-token", "Identity Token Scope", "c-06-identity-token", "mid", 30],
  ["mcp-via-gateway", "MCP Via Gateway", "c-07-mcp-via-gateway", "mid", 40],
  ["observability-span", "Observability Span", "c-08-observability-span", "mid", 30],
  ["worker-handoff", "Worker Handoff Schema", "c-09-worker-handoff", "boss", 35],
  ["runtime-invoke", "Runtime Invoke", "c-10-runtime-invoke", "boss", 45],
  ["eval-golden-set", "Golden Set Eval", "c-11-eval-golden-set", "boss", 40],
  ["capstone-triage", "Capstone Triage", "c-12-capstone-triage", "nightmare", 60],
];

fs.mkdirSync(challengesDir, { recursive: true });
for (const [slug, title, pkg, diff, mins] of CHALLENGE_MANIFESTS) {
  fs.writeFileSync(
    path.join(challengesDir, `${slug}.json`),
    JSON.stringify(
      {
        slug,
        title,
        difficulty: diff,
        estMinutes: mins,
        packageDir: pkg,
        runner: "python",
        summary: `Validate ${title} implementation.`,
        hints: ["Use uv run", "Check tests/validate.py"],
        acceptance: ["pytest-style checks pass", "Graph returns expected route"],
      },
      null,
      2,
    ) + "\n",
  );
}

console.log("seed-agentcore-content: wrote", CHAPTERS.length, "chapters,", CHALLENGE_MANIFESTS.length, "challenge manifests");

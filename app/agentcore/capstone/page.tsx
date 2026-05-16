import Link from "next/link";

export const metadata = { title: "AgentCore Capstone" };

export default function AgentcoreCapstonePage() {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <h1>Capstone: Multi-Agent Triage on AgentCore</h1>
      <p>
        Build the final boss in{" "}
        <Link href="/agentcore/labs/lab-10-capstone-triage">lab-10-capstone-triage</Link> and validate with{" "}
        <Link href="/agentcore/challenges/capstone-triage">capstone-triage</Link>.
      </p>
      <ul>
        <li>LangGraph supervisor routing to Ops + Docs workers</li>
        <li>Two agents deployed on AgentCore Runtime</li>
        <li>AgentCore Memory for session + long-term recall</li>
        <li>Identity for delegated tool auth</li>
        <li>Gateway-exposed MCP search tool</li>
        <li>Observability traces + golden-set evaluation</li>
      </ul>
      <p>
        Read chapter{" "}
        <Link href="/agentcore/chapters/10-capstone-multi-agent-triage">10-capstone-multi-agent-triage</Link> for the
        architecture walkthrough.
      </p>
    </div>
  );
}

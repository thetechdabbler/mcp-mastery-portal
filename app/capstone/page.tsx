import Link from "next/link";

export const metadata = { title: "Capstone" };

export default function CapstonePage() {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <h1>Capstone: Enterprise Developer Assistant MCP Server</h1>
      <p>
        Build the final boss in{" "}
        <Link href="/labs/lab-10-capstone-enterprise-mcp-server">lab-10-capstone-enterprise-mcp-server</Link> and validate
        with <Link href="/challenges/capstone-internal-dev-assistant">capstone-internal-dev-assistant</Link>.
      </p>
      <ul>
        <li>Read-only code search resource (path jailed)</li>
        <li>Docs lookup resource</li>
        <li>PR summary prompt</li>
        <li>Test recommendation tool</li>
        <li>Guarded write tool with human approval + audit log</li>
        <li>Zod on every input; allowlisted roots</li>
      </ul>
    </div>
  );
}

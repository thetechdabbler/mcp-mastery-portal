import Link from "next/link";

export const metadata = { title: "LangChain & LangGraph Capstone" };

export default function LangchainCapstonePage() {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <h1>Capstone: Production Multi-Agent Research Assistant</h1>
      <p>
        Build the final boss in{" "}
        <Link href="/langchain/chapters/18-capstone-production-assistant">18-capstone-production-assistant</Link>. It
        combines advanced RAG, a LangGraph supervisor, human approval, Postgres checkpoints, LangSmith traces, evals,
        deployment, prompt-injection defense, and a cost cap. Small ask. Basically Tuesday.
      </p>
      <ul>
        <li>Runnable ingestion and retrieval pipeline with citations.</li>
        <li>Supervisor graph routing research, synthesis, and review workers.</li>
        <li>Human-in-the-loop approval for risky actions and expensive branches.</li>
        <li>Durable Postgres checkpointer with thread-level replay.</li>
        <li>LangSmith trace metadata, datasets, and regression evals.</li>
        <li>LangServe-compatible deployment surface with auth and rate limits.</li>
      </ul>
    </div>
  );
}

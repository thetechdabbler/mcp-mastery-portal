"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type Trace = { dir: "in" | "out"; msg: string };

const scenarios = [
  { id: "hello", label: "Hello tool (simulated)" },
  { id: "calc", label: "Calculator (simulated)" },
];

export default function PlaygroundPage() {
  const [scenario, setScenario] = React.useState("hello");
  const [trace, setTrace] = React.useState<Trace[]>([]);

  const run = () => {
    const t: Trace[] = [];
    t.push({ dir: "out", msg: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }) });
    t.push({ dir: "in", msg: JSON.stringify({ jsonrpc: "2.0", id: 1, result: { capabilities: {} } }) });
    if (scenario === "hello") {
      t.push({ dir: "out", msg: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "ping" } }) });
      t.push({
        dir: "in",
        msg: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          result: { content: [{ type: "text", text: "pong" }] },
        }),
      });
    } else {
      t.push({
        dir: "out",
        msg: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "add", arguments: { a: 2, b: 3 } } }),
      });
      t.push({
        dir: "in",
        msg: JSON.stringify({ jsonrpc: "2.0", id: 2, result: { content: [{ type: "text", text: "5" }] } }),
      });
    }
    setTrace(t);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Playground</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          Simulated JSON-RPC traces matching stdio MCP shapes. For real servers, use labs + Inspector.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <Button key={s.id} type="button" variant={scenario === s.id ? "default" : "outline"} onClick={() => setScenario(s.id)}>
              {s.label}
            </Button>
          ))}
        </div>
        <Button type="button" onClick={run}>
          Run scenario
        </Button>
      </div>
      <div className="rounded-lg border bg-muted/30 p-3 font-mono text-xs">
        <p className="mb-2 font-sans text-sm font-semibold">Trace</p>
        <ul className="space-y-2">
          {trace.map((line, i) => (
            <li key={i} className={line.dir === "out" ? "text-sky-300" : "text-emerald-300"}>
              <span className="opacity-60">{line.dir === "out" ? "client →" : "server →"}</span> {line.msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

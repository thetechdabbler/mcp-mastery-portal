"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function InspectorPage() {
  const [url, setUrl] = React.useState("https://example.com");
  const [allowLocal, setAllowLocal] = React.useState(false);
  const [forwardAuth, setForwardAuth] = React.useState(false);
  const [auth, setAuth] = React.useState("");
  const [resp, setResp] = React.useState("");

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">MCP Inspector (HTTP)</h1>
      <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
        <strong>Disclaimer:</strong> this is a debugging aid, not an audit tool. Requests execute from the machine
        running this Next.js server. Do not paste production credentials.
      </div>
      <label className="block text-sm">
        URL
        <input className="mt-1 w-full rounded border bg-background px-2 py-1" value={url} onChange={(e) => setUrl(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={allowLocal} onChange={(e) => setAllowLocal(e.target.checked)} />
        Allow http://localhost / 127.0.0.1
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={forwardAuth} onChange={(e) => setForwardAuth(e.target.checked)} />
        Forward Authorization header
      </label>
      {forwardAuth ? (
        <input
          className="w-full rounded border bg-background px-2 py-1 font-mono text-xs"
          placeholder="Bearer …"
          value={auth}
          onChange={(e) => setAuth(e.target.value)}
        />
      ) : null}
      <Button
        type="button"
        onClick={async () => {
          const r = await fetch("/api/inspector/proxy", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              url,
              allowLocalhostHttp: allowLocal,
              forwardAuth,
              authHeader: auth || undefined,
              payload: { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
            }),
          });
          setResp(await r.text());
        }}
      >
        POST initialize-shaped payload
      </Button>
      <pre className="max-h-96 overflow-auto rounded border bg-muted/40 p-3 text-xs">{resp || "—"}</pre>
    </div>
  );
}

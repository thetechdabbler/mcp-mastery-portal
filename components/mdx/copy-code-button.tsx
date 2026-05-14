"use client";

import * as React from "react";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      className="rounded border bg-background px-2 py-0.5 font-medium text-foreground hover:bg-muted"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

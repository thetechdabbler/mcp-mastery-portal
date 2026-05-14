import * as React from "react";
import { CodeBlock } from "@/components/mdx/code-block";

export async function MdxPre(props: React.ComponentProps<"pre">) {
  const child = React.Children.toArray(props.children)[0];
  if (React.isValidElement(child) && child.type === "code") {
    const p = child.props as { className?: string; children?: React.ReactNode };
    const className = p.className ?? "";
    const match = /language-([^\s{]+)/.exec(className);
    const meta = /\{([^}]+)\}/.exec(className);
    const language = match?.[1] ?? "text";
    const code = String(p.children ?? "");
    const highlight = meta?.[1];
    return (
      <CodeBlock
        code={code}
        language={language}
        {...(highlight !== undefined ? { highlight } : {})}
      />
    );
  }
  return <pre {...props} />;
}

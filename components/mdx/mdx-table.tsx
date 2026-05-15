import * as React from "react";

export function MdxTable(props: React.ComponentProps<"table">) {
  return (
    <div className="not-prose my-6 w-full overflow-x-auto rounded-lg border border-border bg-card">
      <table
        {...props}
        className="mdx-table w-full min-w-full border-collapse text-sm"
      />
    </div>
  );
}

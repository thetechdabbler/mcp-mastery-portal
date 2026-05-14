import * as React from "react";

export function MdxTable(props: React.ComponentProps<"table">) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-lg border bg-card">
      <table {...props} className="mdx-table w-full border-collapse text-sm" />
    </div>
  );
}

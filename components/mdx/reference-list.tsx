export function ReferenceList({
  items,
}: {
  items: { label: string; url: string }[];
}) {
  return (
    <ul className="my-4 list-disc space-y-1 pl-5 text-sm">
      {items.map((r) => (
        <li key={r.url}>
          <a className="underline underline-offset-2" href={r.url} rel="noreferrer" target="_blank">
            {r.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

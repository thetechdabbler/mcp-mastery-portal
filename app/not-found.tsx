import Link from "next/link";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">
        This route is as undefined as the MCP spec was in early 2024.
      </p>
      <Link className="mt-6 inline-block underline" href="/">
        Go home
      </Link>
    </div>
  );
}

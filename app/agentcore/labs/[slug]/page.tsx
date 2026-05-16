import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getAgentcoreLabBySlug } from "@/lib/agentcore-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { getAgentcoreLabSlugs } = await import("@/lib/agentcore-content");
  const slugs = await getAgentcoreLabSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function AgentcoreLabDetailPage(props: Props) {
  const { slug } = await props.params;
  const lab = await getAgentcoreLabBySlug(slug);
  if (!lab) notFound();

  return (
    <div>
      <Badge className="mb-2">{lab.slug}</Badge>
      <h1 className="mb-4 text-3xl font-bold">{lab.title}</h1>
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">README</h2>
        <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm">{lab.readme}</pre>
      </section>
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">pyproject.toml</h2>
        <pre className="overflow-x-auto whitespace-pre rounded-lg border bg-muted/30 p-4 text-xs">{lab.pyproject}</pre>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">Starter Python</h2>
        <pre className="overflow-x-auto whitespace-pre rounded-lg border bg-muted/30 p-4 text-xs">{lab.starterCode}</pre>
      </section>
    </div>
  );
}

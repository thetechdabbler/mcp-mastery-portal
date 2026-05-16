import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getLangchainLabBySlug } from "@/lib/langchain-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { getLangchainLabSlugs } = await import("@/lib/langchain-content");
  const slugs = await getLangchainLabSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function LangchainLabDetailPage(props: Props) {
  const { slug } = await props.params;
  const lab = await getLangchainLabBySlug(slug);
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

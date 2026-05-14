import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getLabBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { getLabSlugs } = await import("@/lib/content");
  const slugs = await getLabSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function LabDetailPage(props: Props) {
  const { slug } = await props.params;
  const lab = await getLabBySlug(slug);
  if (!lab) notFound();

  return (
    <div>
      <Badge className="mb-2">{lab.slug}</Badge>
      <h1 className="mb-4 text-3xl font-bold">{lab.title}</h1>
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">README</h2>
        <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm">{lab.readme}</pre>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">
          Starter <code>src/server.ts</code>
        </h2>
        <pre className="overflow-x-auto whitespace-pre rounded-lg border bg-muted/30 p-4 text-xs">{lab.starterCode}</pre>
      </section>
    </div>
  );
}

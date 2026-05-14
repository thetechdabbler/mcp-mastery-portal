import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getChallengeBySlug, readChallengeReadme } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { getChallengeManifests } = await import("@/lib/content");
  const list = await getChallengeManifests();
  return list.map((c) => ({ slug: c.slug }));
}

export default async function ChallengeDetailPage(props: Props) {
  const { slug } = await props.params;
  const ch = await getChallengeBySlug(slug);
  if (!ch) notFound();
  const readme = await readChallengeReadme(slug);

  return (
    <div>
      <Badge className="mb-2">{ch.packageDir}</Badge>
      <h1 className="mb-2 text-3xl font-bold">{ch.title}</h1>
      <p className="mb-4 text-muted-foreground">{ch.summary}</p>
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant="outline">{ch.difficulty}</Badge>
        <span className="text-sm text-muted-foreground">~{ch.estMinutes} min</span>
      </div>
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">README</h2>
        <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm">{readme || "_No README._"}</pre>
      </section>
      <h2 className="mt-8 text-xl font-semibold">Hints</h2>
      <ul className="list-disc pl-5 text-sm">
        {ch.hints.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <h2 className="mt-6 text-xl font-semibold">Acceptance</h2>
      <ul className="list-disc pl-5 text-sm">
        {ch.acceptance.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

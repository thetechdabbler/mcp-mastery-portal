export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <h1>About this portal</h1>
      <p>
        MCP Mastery Portal is a local-first course: chapters in MDX, runnable labs, validated challenges, and a
        security playbook.
      </p>
      <h2>Privacy</h2>
      <p>
        <strong>No telemetry.</strong> No analytics. No cookies for tracking. Progress and quiz scores live in{" "}
        <code>localStorage</code> only. This site does not phone home by default.
      </p>
      <p>
        The <strong>Inspector</strong> feature intentionally proxies HTTP requests from the server you run this app
        on—do not paste production secrets into it.
      </p>
    </div>
  );
}

import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sanity setup runbook — Vincent Luu"
};

const browserSafeVariables = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "NEXT_PUBLIC_SANITY_API_VERSION"
] as const;

export default function SanitySetupRunbookPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "clamp(2rem, 8vw, 7rem)",
        background: "#f6f8f5",
        color: "#101820",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <article style={{maxWidth: "48rem", margin: "0 auto"}}>
        <p
          style={{
            color: "#2855f5",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase"
          }}
        >
          Sanity Studio · local runbook
        </p>
        <h1
          style={{
            maxWidth: "12ch",
            margin: "1rem 0 2rem",
            fontSize: "clamp(2.5rem, 8vw, 5.75rem)",
            letterSpacing: "-0.06em",
            lineHeight: 0.95
          }}
        >
          Connect the content workspace.
        </h1>
        <ol style={{paddingLeft: "1.25rem", lineHeight: 1.8}}>
          <li>Sign in to Sanity and create or select the portfolio project.</li>
          <li>
            Create a dataset named exactly <code>development</code>.
          </li>
          <li>
            Copy <code>.env.example</code> to <code>.env.local</code> and
            replace these browser-safe values:
            <ul style={{margin: "0.75rem 0 1rem", paddingLeft: "1.25rem"}}>
              {browserSafeVariables.map((variable) => (
                <li key={variable}>
                  <code>{variable}</code>
                </li>
              ))}
            </ul>
          </li>
          <li>
            Add <code>http://localhost:3000</code> as a credentialed CORS
            origin in Sanity Manage.
          </li>
          <li>
            Restart <code>npm run dev</code>, return to Studio, and sign in.
          </li>
        </ol>
        <p style={{margin: "2rem 0", lineHeight: 1.7}}>
          Keep every private value blank during this bootstrap. The complete,
          authoritative operations guide lives at{" "}
          <code>docs/runbooks/sanity-setup.md</code> in the repository.
        </p>
        <Link href="/studio">Return to Studio</Link>
      </article>
    </main>
  );
}

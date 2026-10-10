interface StudioSetupRequiredProps {
  variables: readonly string[];
}

export function StudioSetupRequired({
  variables
}: StudioSetupRequiredProps) {
  return (
    <main
      style={{
        display: "grid",
        minHeight: "100vh",
        placeItems: "center",
        padding: "2rem",
        background: "#f6f8f5",
        color: "#101820",
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <section style={{width: "min(100%, 48rem)"}}>
        <p
          style={{
            margin: "0 0 1.25rem",
            color: "#2855f5",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase"
          }}
        >
          Sanity Studio
        </p>
        <h1
          style={{
            maxWidth: "12ch",
            margin: 0,
            fontSize: "clamp(2.5rem, 8vw, 5.75rem)",
            letterSpacing: "-0.06em",
            lineHeight: 0.95
          }}
        >
          Local setup is required.
        </h1>
        <p style={{maxWidth: "58ch", margin: "2rem 0", lineHeight: 1.7}}>
          Add the following browser-safe values to <code>.env.local</code>,
          then restart the development server. No credentials belong in the
          repository.
        </p>
        <ul style={{paddingLeft: "1.25rem", lineHeight: 1.9}}>
          {variables.map((variable) => (
            <li key={variable}>
              <code>{variable}</code>
            </li>
          ))}
        </ul>
        <p style={{marginTop: "2rem"}}>
          Follow{" "}
          <a href="/docs/runbooks/sanity-setup.md">
            docs/runbooks/sanity-setup.md
          </a>
          .
        </p>
      </section>
    </main>
  );
}

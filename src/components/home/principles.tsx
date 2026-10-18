import type {Profile} from "@/lib/content/types";

interface PrinciplesProps {
  heading: string;
  principles: Profile["principles"];
}

export function Principles({heading, principles}: PrinciplesProps) {
  return (
    <section
      id="working-principles"
      className="home-section home-section--principles section-rule"
      aria-labelledby="working-principles-title"
    >
      <div className="home-section__heading">
        <h2 id="working-principles-title">{heading}</h2>
      </div>
      <ol className="principles-list">
        {principles.map((principle) => (
          <li key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

interface CurrentQuestionsProps {
  heading: string;
  questions: string[];
}

export function CurrentQuestions({
  heading,
  questions
}: CurrentQuestionsProps) {
  return (
    <section
      id="current-questions"
      className="home-section home-section--questions"
      aria-labelledby="current-questions-title"
    >
      <div className="questions-rail">
        <h2 id="current-questions-title">{heading}</h2>
        <ol>
          {questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

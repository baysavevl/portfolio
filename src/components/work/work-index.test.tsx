import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {WorkIndex} from "@/components/work/work-index";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("WorkIndex", () => {
  it("keeps an empty collection public-facing and useful", async () => {
    const topics = await demoContentRepository.getTopics("en");

    render(
      <WorkIndex
        locale="en"
        projects={[]}
        topics={topics}
        translationUnavailable={false}
        activeTopic="all"
      />
    );

    expect(
      screen.getByText(
        "Case studies will appear here once their details are ready to share."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Browse Writing instead"})).toHaveAttribute(
      "href",
      "/en/writing"
    );
    expect(document.body).not.toHaveTextContent(/studio|admin/i);
  });
});

import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {ResumeView} from "@/components/resume/resume-view";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("ResumeView", () => {
  it("renders one truthful empty state and omits unavailable downloads", async () => {
    const resume = await demoContentRepository.getResume("en");

    render(<ResumeView resume={resume} />);

    expect(
      screen.getAllByText(/verified professional history has not yet been supplied/i)
    ).toHaveLength(1);
    expect(screen.queryByRole("link", {name: /download/i})).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/acme|example corporation/i);
  });
});

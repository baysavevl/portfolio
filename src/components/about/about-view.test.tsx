import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {AboutView} from "@/components/about/about-view";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("AboutView", () => {
  it("presents the supplied profile and principles without resume claims", async () => {
    const profile = await demoContentRepository.getProfile("en");

    render(<AboutView profile={profile} />);

    expect(screen.getByText(profile.introduction)).toBeInTheDocument();
    for (const principle of profile.principles) {
      expect(
        screen.getByRole("heading", {name: principle.title})
      ).toBeInTheDocument();
    }
    expect(screen.queryByRole("heading", {name: "Experience"})).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", {name: "Résumé"})).not.toBeInTheDocument();
  });
});

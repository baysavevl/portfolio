import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {HomeView} from "@/components/home/home-view";
import {demoContentRepository} from "@/lib/content/demo/repository";

describe("HomeView", () => {
  it("presents positioning, writing, work, and a truthful resume state", async () => {
    const data = await demoContentRepository.getHome("en");

    render(<HomeView data={data} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build products, teams, and ideas that compound."
      })
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {name: "Latest field note"})
    ).toBeVisible();
    expect(screen.getByRole("heading", {name: "Selected work"})).toBeVisible();
    expect(screen.getByText("Demonstration content")).toBeVisible();
    expect(
      screen.getByText(
        /verified professional history has not yet been supplied/i
      )
    ).toBeVisible();
  });
});

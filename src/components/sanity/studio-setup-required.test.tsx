import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";

import {StudioSetupRequired} from "@/components/sanity/studio-setup-required";

describe("StudioSetupRequired", () => {
  it("lists only the missing browser-safe values and links to the runbook", () => {
    render(
      <StudioSetupRequired
        variables={[
          "NEXT_PUBLIC_SANITY_PROJECT_ID",
          "NEXT_PUBLIC_SANITY_DATASET",
          "NEXT_PUBLIC_SANITY_API_VERSION"
        ]}
      />
    );

    expect(
      screen.getByRole("heading", {name: "Local setup is required."})
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("NEXT_PUBLIC_SANITY_PROJECT_ID")).toBeVisible();
    expect(screen.getByText("NEXT_PUBLIC_SANITY_DATASET")).toBeVisible();
    expect(screen.getByText("NEXT_PUBLIC_SANITY_API_VERSION")).toBeVisible();
    expect(
      screen.getByRole("link", {name: "docs/runbooks/sanity-setup.md"})
    ).toHaveAttribute("href", "/docs/runbooks/sanity-setup.md");
    expect(screen.queryByText(/SANITY_API_(READ|WRITE)_TOKEN/)).not.toBeInTheDocument();
    expect(screen.queryByText(/SANITY_REVALIDATE_SECRET/)).not.toBeInTheDocument();
  });
});

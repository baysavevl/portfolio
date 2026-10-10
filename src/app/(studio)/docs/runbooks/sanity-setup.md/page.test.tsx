import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";

import SanitySetupRunbookPage from "@/app/(studio)/docs/runbooks/sanity-setup.md/page";

describe("SanitySetupRunbookPage", () => {
  it("serves the setup steps at the Studio runbook URL", () => {
    render(<SanitySetupRunbookPage />);

    expect(
      screen.getByRole("heading", {name: "Connect the content workspace."})
    ).toBeInTheDocument();
    expect(screen.getByText("NEXT_PUBLIC_SANITY_PROJECT_ID")).toBeVisible();
    expect(screen.getByText("NEXT_PUBLIC_SANITY_DATASET")).toBeVisible();
    expect(screen.getByText("NEXT_PUBLIC_SANITY_API_VERSION")).toBeVisible();
    expect(
      screen.getByRole("link", {name: "Return to Studio"})
    ).toHaveAttribute("href", "/studio");
  });
});

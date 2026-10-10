import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it, vi} from "vitest";
import {ErrorPanel} from "@/components/layout/error-panel";

describe("ErrorPanel", () => {
  it("offers a recoverable action without exposing diagnostics", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <ErrorPanel
        title="Something interrupted the page"
        description="Please try again."
        actionLabel="Try again"
        onAction={onAction}
        links={[{href: "/en", label: "Go home"}]}
      />
    );

    await user.click(screen.getByRole("button", {name: "Try again"}));

    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", {name: "Go home"})).toHaveAttribute(
      "href",
      "/en"
    );
    expect(screen.queryByText(/stack|digest/i)).not.toBeInTheDocument();
  });

  it("can use a link as its primary action", () => {
    render(
      <ErrorPanel
        title="This page is not in the field notes"
        description="The address may have changed."
        actionLabel="Go home"
        actionHref="/en"
        links={[
          {href: "/en/writing", label: "Browse Writing"},
          {href: "/en/work", label: "Browse Work"}
        ]}
      />
    );

    expect(screen.getByRole("link", {name: "Go home"})).toHaveAttribute(
      "href",
      "/en"
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});

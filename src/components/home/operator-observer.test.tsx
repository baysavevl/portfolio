import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it} from "vitest";
import {OperatorObserver} from "@/components/home/operator-observer";

describe("OperatorObserver", () => {
  it("switches modes with focusable controls", async () => {
    const user = userEvent.setup();

    render(
      <OperatorObserver
        operatorLabel="Operator"
        observerLabel="Observer"
      />
    );

    const observer = screen.getByRole("button", {name: "Observer"});
    await user.click(observer);

    expect(observer).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("img", {name: "Abstract Observer silhouette"})
    ).toBeVisible();
  });

  it("exposes a named range control for pointer and keyboard input", () => {
    render(
      <OperatorObserver
        operatorLabel="Operator"
        observerLabel="Observer"
      />
    );

    expect(
      screen.getByRole("slider", {name: "Reveal Operator or Observer"})
    ).toBeVisible();
  });
});

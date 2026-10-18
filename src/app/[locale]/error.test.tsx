import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it, vi} from "vitest";
import ErrorBoundary from "./error";

vi.mock("next/navigation", () => ({
  usePathname: () => "/vi/e2e-error"
}));

describe("localized error boundary", () => {
  it("offers Vietnamese recovery without rendering the diagnostic", async () => {
    const user = userEvent.setup();
    const retry = vi.fn();

    render(
      <ErrorBoundary
        error={new Error("E2E_PRIVATE_DIAGNOSTIC")}
        retry={retry}
      />
    );

    expect(
      screen.getByRole("heading", {name: "Trang đã bị gián đoạn"})
    ).toBeInTheDocument();
    expect(screen.queryByText("E2E_PRIVATE_DIAGNOSTIC")).not.toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Về trang chủ"})).toHaveAttribute(
      "href",
      "/vi"
    );

    await user.click(screen.getByRole("button", {name: "Thử lại"}));
    expect(retry).toHaveBeenCalledOnce();
  });
});

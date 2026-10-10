import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {ComponentProps} from "react";
import {describe, expect, it, vi} from "vitest";
import {LocaleSwitcher} from "@/components/layout/locale-switcher";

vi.mock("next/link", () => ({
  default: ({
    href,
    onClick,
    ...props
  }: ComponentProps<"a"> & {href: string}) => (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    />
  )
}));

describe("LocaleSwitcher", () => {
  it("preserves the exact fallback destination for a missing translation", async () => {
    const user = userEvent.setup();
    const targetHref =
      "/vi/writing?translation=unavailable&topic=leadership";

    render(
      <LocaleSwitcher
        currentLocale="en"
        targetLocale="vi"
        targetHref={targetHref}
        missingTranslation
      />
    );

    const vietnamese = screen.getByRole("link", {name: "VI"});
    expect(vietnamese).toHaveAttribute("href", targetHref);
    expect(vietnamese).not.toHaveAttribute(
      "href",
      "/en/writing/quiet-leadership"
    );

    await user.click(vietnamese);

    expect(document.cookie).toContain("vincent-locale=vi");
  });
});

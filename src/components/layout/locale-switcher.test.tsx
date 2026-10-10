import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {ComponentProps} from "react";
import {describe, expect, it, vi} from "vitest";
import {LocaleSwitcher} from "@/components/layout/locale-switcher";
import {
  LocaleSwitchProvider,
  LocaleSwitchTarget
} from "@/components/layout/locale-switch-context";

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

  it("lets a content page replace the shell's default destination", async () => {
    const articleTarget = {
      currentLocale: "en" as const,
      targetLocale: "vi" as const,
      targetHref: "/vi/writing/ro-rang-truoc-toc-do",
      missingTranslation: false
    };

    render(
      <LocaleSwitchProvider
        initialTarget={{
          currentLocale: "en",
          targetLocale: "vi",
          targetHref: "/vi",
          missingTranslation: false
        }}
      >
        <LocaleSwitcher />
        <LocaleSwitchTarget target={articleTarget} />
      </LocaleSwitchProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("link", {name: "VI"})).toHaveAttribute(
        "href",
        articleTarget.targetHref
      );
    });
  });
});

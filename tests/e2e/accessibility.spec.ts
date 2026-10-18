import AxeBuilder from "@axe-core/playwright";
import {expect, test} from "@playwright/test";

const routes = [
  {path: "/en", heading: "I build products, teams, and ideas that compound."},
  {
    path: "/vi",
    heading: "Tôi xây sản phẩm, đội ngũ và những ý tưởng tạo giá trị lâu dài."
  },
  {path: "/en/writing", heading: "Writing"},
  {
    path: "/en/writing/clarity-before-velocity",
    heading: "Clarity before velocity"
  },
  {path: "/en/work", heading: "Work"},
  {path: "/en/about", heading: "About"},
  {path: "/en/resume", heading: "Résumé"}
];

for (const route of routes) {
  test(`${route.path} has no serious or critical accessibility violations`, async ({
    page
  }) => {
    const response = await page.goto(route.path);

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", {level: 1, name: route.heading})
    ).toBeVisible();

    const results = await new AxeBuilder({page}).analyze();
    const highImpactViolations = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical"
    );

    expect(highImpactViolations).toEqual([]);
  });
}

test("localized not-found UI has no serious or critical violations", async ({
  page
}) => {
  const response = await page.goto("/vi/khong-ton-tai");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", {name: "Trang này không có trong ghi chép"})
  ).toBeVisible();

  const results = await new AxeBuilder({page}).analyze();
  expect(
    results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical"
    )
  ).toEqual([]);
});

test("keyboard order reaches navigation, locale, and hero controls", async ({
  page
}) => {
  await page.goto("/en");

  const expectedStops = [
    page.getByRole("link", {name: "Skip to main content"}),
    page.getByRole("link", {name: "Home — Vincent Luu"}),
    page.getByRole("link", {name: "Work", exact: true}).first(),
    page.getByRole("link", {name: "Writing", exact: true}).first(),
    page.getByRole("link", {name: "About", exact: true}),
    page.getByRole("link", {name: "Résumé", exact: true}).first(),
    page.getByRole("link", {name: "VI"}),
    page.getByRole("link", {name: "Read the field notes"}),
    page.getByRole("link", {name: "Explore selected work"}),
    page.getByRole("button", {name: "Operator"}),
    page.getByRole("button", {name: "Observer"}),
    page.getByRole("slider", {name: "Reveal Operator or Observer"})
  ];

  for (const stop of expectedStops) {
    await page.keyboard.press("Tab");
    await expect(stop).toBeFocused();
  }
});

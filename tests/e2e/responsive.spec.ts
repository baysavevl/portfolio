import {expect, test} from "@playwright/test";

const viewports = [
  {name: "mobile", width: 375, height: 812},
  {name: "tablet", width: 768, height: 1024},
  {name: "desktop", width: 1440, height: 900},
  {name: "wide", width: 1920, height: 1080}
];

for (const viewport of viewports) {
  test(`homepage fits the ${viewport.name} viewport`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto("/en");

    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "I build products, teams, and ideas that compound."
      })
    ).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
  });
}

test("mobile navigation opens and reaches Writing", async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto("/en");

  await page.getByRole("button", {name: "Open navigation"}).click();
  const mobileNavigation = page.getByRole("navigation", {
    name: "Mobile navigation"
  });
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole("link", {name: "Writing"}).click();

  await expect(page).toHaveURL(/\/en\/writing$/);
  await expect(page.getByRole("heading", {level: 1, name: "Writing"})).toBeVisible();
});

import {expect, test} from "@playwright/test";

test("defaults to English and remembers Vietnamese", async ({page}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await page.getByRole("link", {name: "VI"}).click();
  await expect(page).toHaveURL(/\/vi$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/vi$/);
});

test("searches Vietnamese without diacritics", async ({page}) => {
  await page.goto("/vi/writing");
  await page.getByRole("searchbox").fill("lanh dao");
  await expect(
    page.getByRole("link", {name: /Rõ ràng trước tốc độ/i})
  ).toBeVisible();
});

test("does not substitute a missing translation", async ({page}) => {
  await page.goto("/en/writing/quiet-leadership");
  await page.getByRole("link", {name: "VI"}).click();
  await expect(page).toHaveURL(
    /\/vi\/writing\?translation=unavailable&topic=leadership/
  );
  await expect(page.getByText(/chưa có ở ngôn ngữ/i)).toBeVisible();
});

test("lets the keyboard reveal the Observer silhouette", async ({page}) => {
  await page.goto("/en");
  const slider = page.getByRole("slider", {
    name: "Reveal Operator or Observer"
  });

  await slider.focus();
  await page.keyboard.press("End");

  await expect(slider).toHaveAttribute(
    "aria-valuetext",
    "Operator 0%, Observer 100%"
  );
  await expect(page.getByRole("button", {name: "Observer"})).toHaveAttribute(
    "aria-pressed",
    "true"
  );
});

test("shows a localized not-found page", async ({page}) => {
  const response = await page.goto("/vi/khong-ton-tai");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", {name: "Trang này không có trong ghi chép"})
  ).toBeVisible();
  await expect(page.getByRole("link", {name: "Về trang chủ"})).toBeVisible();
});

test("recovers from a localized runtime error without exposing diagnostics", async ({
  page
}) => {
  await page.goto("/vi/e2e-error");
  await page.getByRole("button", {name: "Kích hoạt lỗi kiểm thử"}).click();

  await expect(
    page.getByRole("heading", {name: "Trang đã bị gián đoạn"})
  ).toBeVisible();
  await expect(page.getByText("E2E_PRIVATE_DIAGNOSTIC")).toHaveCount(0);
  await expect(page.getByRole("link", {name: "Về trang chủ"})).toBeVisible();

  await page.getByRole("button", {name: "Thử lại"}).click();
  await expect(
    page.getByRole("button", {name: "Kích hoạt lỗi kiểm thử"})
  ).toBeVisible();
});

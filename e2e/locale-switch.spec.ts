import { test, expect } from "@playwright/test";

test.describe("Locale switching", () => {
  test("redirects / to default locale /ko", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/ko/);
  });

  test("switches from Korean to English to Chinese", async ({ page }) => {
    await page.goto("/ko");

    const langNav = page.getByRole("navigation", { name: "Language" });

    // Switch to English
    await langNav.getByRole("button", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en/);

    // Confirm English content is present (nav link uses English label)
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
        name: "Products",
      }),
    ).toBeVisible();

    // Switch to Chinese
    await langNav.getByRole("button", { name: "中文" }).click();
    await expect(page).toHaveURL(/\/zh/);
  });

  test("preserves the current page path when switching locale", async ({
    page,
  }) => {
    await page.goto("/en/products");

    const langNav = page.getByRole("navigation", { name: "Language" });
    await langNav.getByRole("button", { name: "한국어" }).click();

    await expect(page).toHaveURL(/\/ko\/products/);
  });
});

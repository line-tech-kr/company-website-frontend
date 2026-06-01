import { test, expect } from "@playwright/test";

test.describe("Locale switching", () => {
  // After #142 the middleware auto-detects locale from Accept-Language; without
  // a ko locale on the context Playwright's default `en-US` would land on /en.
  test.use({ locale: "ko-KR" });

  test("redirects / to default locale /ko", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/ko/);
  });

  test("switches from Korean to English to Chinese", async ({ page }) => {
    // Wait for network idle so React has hydrated and the locale-switcher's
    // onClick is bound — clicking before hydration silently no-ops.
    await page.goto("/ko", { waitUntil: "networkidle" });

    // Locale switcher's nav aria-label is translated per locale; target buttons
    // by their lang attribute instead, which is locale-agnostic.
    await page.locator('.pd-top__right .lt-locale__seg[lang="en"]').click();
    await expect(page).toHaveURL(/\/en/);

    // Confirm English content is present (nav link uses English label)
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
        name: "Products",
      }),
    ).toBeVisible();

    await page.locator('.pd-top__right .lt-locale__seg[lang="zh"]').click();
    await expect(page).toHaveURL(/\/zh/);
  });

  test("preserves the current page path when switching locale", async ({
    page,
  }) => {
    await page.goto("/en/products", { waitUntil: "networkidle" });

    await Promise.all([
      page.waitForURL(/\/ko\/products/),
      page.locator('.pd-top__right .lt-locale__seg[lang="ko"]').click(),
    ]);
  });
});

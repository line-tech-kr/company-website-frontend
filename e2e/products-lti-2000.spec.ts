import { test, expect } from "@playwright/test";

// LTI read-out units moved out of the series to the static Accessories page
// (#270 item #8). The old /products/specialized/lti-2000 detail URL now
// redirects to /products/accessories, where the unit is listed.
test.describe("LTI-2000 read-out unit (moved to Accessories)", () => {
  for (const locale of ["en", "ko", "zh"] as const) {
    test(`old detail URL redirects to Accessories and shows LTI-2000 (${locale})`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/products/specialized/lti-2000`);
      await expect(page).toHaveURL(
        new RegExp(`/${locale}/products/accessories`),
      );

      const item = page.locator("#lti-2000");
      await expect(item).toBeVisible();
      await expect(item.locator(".acc-item__model")).toHaveText("LTI-2000");
      await expect(item.locator(".acc-specs tr").first()).toBeVisible();
    });
  }

  test("unknown specialized slug returns 404", async ({ page }) => {
    const res = await page.goto("/en/products/specialized/does-not-exist-1234");
    expect(res?.status()).toBe(404);
  });
});

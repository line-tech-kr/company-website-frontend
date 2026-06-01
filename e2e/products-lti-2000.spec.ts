import { test, expect } from "@playwright/test";

test.describe("LTI-2000 read-out unit detail", () => {
  for (const locale of ["en", "ko", "zh"] as const) {
    test(`renders Specifications with instrumentSpecs rows (${locale})`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/products/specialized/lti-2000`);

      const specs = page.locator("#specs");
      await expect(specs).toBeVisible();

      const rows = specs.locator(".lt-pdp-spec__row");
      await expect(rows.first()).toBeVisible();
      expect(await rows.count()).toBeGreaterThanOrEqual(10);

      await expect(
        specs.getByText("Input Power", { exact: true }),
      ).toBeVisible();
      await expect(
        specs.getByText('256×64 Dot 6" Wide OLED LCD'),
      ).toBeVisible();
    });
  }

  test("unknown specialized slug returns 404", async ({ page }) => {
    const res = await page.goto("/en/products/specialized/does-not-exist-1234");
    expect(res?.status()).toBe(404);
  });
});

import { test, expect } from "@playwright/test";

test.describe("LEPC category", () => {
  test("/products/lepc renders the EPC stack with LEPC and pressure-spec columns", async ({
    page,
  }) => {
    await page.goto("/en/products/lepc");

    const epc = page.getByRole("region", {
      name: /Electronic Pressure Controllers/i,
    });
    await expect(epc).toBeVisible();

    await expect(
      epc.getByRole("columnheader", { name: "Pressure range" }),
    ).toBeVisible();
    await expect(
      epc.getByRole("columnheader", { name: "Max pressure" }),
    ).toBeVisible();

    const lepcRow = epc.getByRole("row", { name: /LEPC/ });
    await expect(lepcRow).toBeVisible();
    await expect(lepcRow).toContainText("barA");
    await expect(lepcRow).toContainText("50 bar");
  });

  test("/products/specialized no longer lists LEPC", async ({ page }) => {
    await page.goto("/en/products/specialized");
    // LEPC has moved to its own category, so it must not appear here.
    await expect(page.locator(".lt-prod-row__codelink", { hasText: /^LEPC$/ })).toHaveCount(
      0,
    );
  });

  test("unknown category slug returns 404", async ({ page }) => {
    const res = await page.goto("/en/products/does-not-exist");
    expect(res?.status()).toBe(404);
  });
});

import { test, expect } from "@playwright/test";

// Issue #269: M2200VA / MD400C / MD400M retired; DO400 moved specialized → analogue.

test.describe("Retired SKUs (#269) redirect to their category", () => {
  const cases = [
    { from: "/en/products/analogue/m2200va", to: "/en/products/analogue" },
    { from: "/en/products/digital/md400c", to: "/en/products/digital" },
    { from: "/en/products/digital/md400m", to: "/en/products/digital" },
  ];

  for (const { from, to } of cases) {
    test(`${from} → ${to}`, async ({ page }) => {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(`${to}$`));
    });
  }
});

test.describe("DO400 relocation (#269)", () => {
  test("/products/specialized/do400 redirects to the analogue route", async ({
    page,
  }) => {
    await page.goto("/en/products/specialized/do400");
    await expect(page).toHaveURL(/\/en\/products\/analogue\/do400$/);
  });

  test("DO400 detail page renders at its analogue route", async ({ page }) => {
    await page.goto("/en/products/analogue/do400");

    await expect(page.locator("#specs")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /DO400/i }).first(),
    ).toBeVisible();
  });

  test("DO400 appears in the analogue category listing", async ({ page }) => {
    await page.goto("/en/products/analogue");
    await expect(
      page.locator(".lt-prod-row__codelink", { hasText: /^DO400$/ }),
    ).toHaveCount(1);
  });

  test("DO400 still appears in the digital category listing (cross-listed)", async ({
    page,
  }) => {
    await page.goto("/en/products/digital");
    await expect(
      page.locator(".lt-prod-row__codelink", { hasText: /^DO400$/ }),
    ).toHaveCount(1);
  });
});

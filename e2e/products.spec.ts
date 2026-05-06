import { test, expect } from "@playwright/test";

test.describe("Product browsing", () => {
  test("products hub renders with category cards", async ({ page }) => {
    await page.goto("/en/products");

    await expect(
      page.getByRole("heading", { name: "Product catalog" }),
    ).toBeVisible();

    // Category links exist
    await expect(
      page.getByRole("link", { name: /analogue/i }).first(),
    ).toBeVisible();
  });

  test("navigates from hub to analogue category page", async ({ page }) => {
    await page.goto("/en/products");

    await page
      .getByRole("link", { name: /analogue/i })
      .first()
      .click();
    await page.waitForURL(/\/en\/products\/analogue/);

    // Product table renders
    await expect(page.locator(".lt-prod-stack__table").first()).toBeVisible();
  });

  test("navigates from category to product detail page", async ({ page }) => {
    await page.goto("/en/products/analogue");

    // Click the first model code link in the product table
    const firstProductLink = page.locator(".lt-prod-row__codelink").first();
    await expect(firstProductLink).toBeVisible();

    const productHref = await firstProductLink.getAttribute("href");
    await firstProductLink.click();

    await page.waitForURL(/\/en\/products\/analogue\/.+/);

    // Product detail renders — at minimum, a spec table is present
    await expect(page.locator("table").first()).toBeVisible();

    // The model code from the link should appear in the page heading
    if (productHref) {
      const slug = productHref.split("/").at(-1) ?? "";
      // Slug is lowercase (e.g. "m3030va"); the page heading is uppercase
      await expect(
        page.getByRole("heading", { name: new RegExp(slug, "i") }).first(),
      ).toBeVisible();
    }
  });
});

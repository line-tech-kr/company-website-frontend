import { test, expect } from "@playwright/test";

test.describe("Product browsing", () => {
  test("products hub renders with category cards", async ({ page }) => {
    await page.goto("/en/products");

    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();

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
    expect(productHref).toBeTruthy();
    const slug = productHref!.split("/").at(-1)!;

    await firstProductLink.click();
    await page.waitForURL(/\/en\/products\/analogue\/.+/);

    // Product detail renders — spec list is present (it's a <dl>, not a <table>)
    await expect(page.locator("#specs")).toBeVisible();

    // Slug is lowercase (e.g. "m3030va"); the page heading is uppercase
    await expect(
      page.getByRole("heading", { name: new RegExp(slug, "i") }).first(),
    ).toBeVisible();
  });

  test("MS3150VA detail page surfaces its CE Declaration of Conformity", async ({
    page,
  }) => {
    await page.goto("/en/products/analogue/ms3150va");

    const downloads = page.locator("#downloads");
    await expect(downloads).toBeVisible();
    // CERT badge is rendered via the DownloadsList type tag
    await expect(downloads.getByText("CERT", { exact: true })).toBeVisible();
    await expect(downloads.getByText(/CE DoC/i)).toBeVisible();
  });
});

test.describe("Specialized category — readout table", () => {
  test("instruments stack renders readout columns, not flow columns", async ({
    page,
  }) => {
    await page.goto("/en/products/specialized");

    // ReadoutStack labels its <section> via aria-labelledby on the title heading,
    // so it resolves as a named region — locate it by accessible name.
    const readout = page.getByRole("region", { name: /Read-Out Units/i });
    await expect(readout).toBeVisible();

    // Readout-specific column headers are present.
    await expect(
      readout.getByRole("columnheader", { name: "Display" }),
    ).toBeVisible();
    await expect(
      readout.getByRole("columnheader", { name: "Input power" }),
    ).toBeVisible();

    // Flow-device column headers are absent from the readout table.
    await expect(
      readout.getByRole("columnheader", { name: "Flow range" }),
    ).toHaveCount(0);
    await expect(
      readout.getByRole("columnheader", { name: "Accuracy" }),
    ).toHaveCount(0);

    // LTI-2000 row shows the OLED display value, not an em-dash.
    const lti2000Row = readout.getByRole("row", { name: /LTI-2000/ });
    await expect(lti2000Row).toBeVisible();
    await expect(lti2000Row).toContainText("OLED");
    // No em-dash should appear in this row — every column has data.
    await expect(lti2000Row).not.toContainText("—");
  });
});

test.describe("Certifications hub", () => {
  test("renders company-wide and product-specific groups", async ({ page }) => {
    await page.goto("/en/resources/certifications");

    await expect(
      page.getByRole("heading", { name: "Certifications" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Company-wide/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Product-specific compliance/i }),
    ).toBeVisible();
    // Per-product cert renders its Applies-to list — order of models[] may vary
    await expect(
      page.getByText(/LTI-1000.*LTI-2000|LTI-2000.*LTI-1000/).first(),
    ).toBeVisible();
  });
});

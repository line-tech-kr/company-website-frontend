import { test, expect } from "@playwright/test";

test.describe("Product finder", () => {
  test("hub CTA navigates to the finder route", async ({ page }) => {
    await page.goto("/en/products");
    await page
      .getByRole("link", { name: /find your controller/i })
      .first()
      .click();
    await page.waitForURL(/\/en\/products\/finder/);
    await expect(
      page.getByRole("heading", { name: /find your controller/i }),
    ).toBeVisible();
  });

  test("happy path: pick gas + flow, see results, click into a product", async ({
    page,
  }) => {
    await page.goto("/en/products/finder");

    // Form renders
    await expect(page.getByRole("group", { name: "Function" })).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Target flow rate" }),
    ).toBeVisible();

    // Default gas is Nitrogen — leave it. Enter 250 slpm.
    await page.getByRole("spinbutton").fill("250");

    // Wait for at least one result card to appear.
    const resultCards = page.locator(".lt-finder__result");
    await expect(resultCards.first()).toBeVisible({ timeout: 5000 });

    // Click the first match — it should land on a product detail page.
    const firstHref = await resultCards.first().getAttribute("href");
    expect(firstHref).toMatch(/\/en\/products\/[^/]+\/[^/]+/);
    await resultCards.first().click();
    await page.waitForURL(new RegExp(firstHref!.replace(/\//g, "\\/")));
  });

  test("URL search params pre-fill the form", async ({ page }) => {
    await page.goto(
      "/en/products/finder?fn=MFC&gas=nitrogen&flow=250&unit=slpm",
    );
    await expect(page.getByRole("spinbutton")).toHaveValue("250");
    await expect(page.locator(".lt-finder__result").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("empty-results state shows when flow is out of every product's range", async ({
    page,
  }) => {
    await page.goto("/en/products/finder");
    await page.getByRole("spinbutton").fill("99999999");
    await expect(
      page.getByText(/no products fit those requirements/i),
    ).toBeVisible({ timeout: 5000 });
  });

  test("specialty-gas warning appears for HF", async ({ page }) => {
    await page.goto(
      "/en/products/finder?gas=hydrogen-fluoride&flow=10&unit=slpm",
    );
    await expect(
      page.getByText(/verify seal material with sales/i),
    ).toBeVisible({ timeout: 5000 });
  });

  test("EPC function returns LEPC without requiring a flow value", async ({
    page,
  }) => {
    await page.goto("/en/products/finder?fn=EPC");
    // FlowInput is hidden when EPC is selected.
    await expect(
      page.getByRole("group", { name: "Target flow rate" }),
    ).toBeHidden();
    const resultCards = page.locator(".lt-finder__result");
    await expect(resultCards.first()).toBeVisible({ timeout: 5000 });
    await expect(resultCards.filter({ hasText: "LEPC" })).toHaveCount(1);
  });

  test("seam tiebreak: at V=1500, only MS3600VA appears (#236)", async ({
    page,
  }) => {
    await page.goto(
      "/en/products/finder?fn=MFC&series=analogue&gas=nitrogen&flow=1500&unit=slpm",
    );
    // Exactly one analogue MFC result for V=1500: MS3600VA owns the seam,
    // MS3700VA (V at its lower bound) is suppressed.
    const results = page.locator(".lt-finder__result");
    await expect(results).toHaveCount(1, { timeout: 5000 });
    await expect(results.first()).toContainText("MS3600VA");
  });
});

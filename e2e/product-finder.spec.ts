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
    await page
      .getByRole("group", { name: "Target flow rate" })
      .getByRole("spinbutton")
      .fill("250");

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
    await expect(
      page
        .getByRole("group", { name: "Target flow rate" })
        .getByRole("spinbutton"),
    ).toHaveValue("250");
    await expect(page.locator(".lt-finder__result").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("empty-results state shows when flow is out of every product's range", async ({
    page,
  }) => {
    await page.goto("/en/products/finder");
    await page
      .getByRole("group", { name: "Target flow rate" })
      .getByRole("spinbutton")
      .fill("99999999");
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

  test("seam tiebreak: at V=1500 only the top-of-range product appears", async ({
    page,
  }) => {
    // Anchors on the analogue MFC seam at 1500 slpm: today that's MS3600VA
    // (max=1500) winning over MS3700VA (min=1500). If those SKUs are renamed
    // or retired, re-anchor this test to whichever pair owns the 1500 slpm
    // seam in the analogue MFC line.
    await page.goto(
      "/en/products/finder?fn=MFC&series=analogue&gas=nitrogen&flow=1500&unit=slpm",
    );
    const results = page.locator(".lt-finder__result");
    await expect(results).toHaveCount(1, { timeout: 5000 });
    await expect(results.first()).toContainText("MS3600VA");
  });

  test("mixture mode: switch toggle, enter components, see results", async ({
    page,
  }) => {
    await page.goto("/en/products/finder");

    // Switch to Mixture mode.
    await page.getByRole("radio", { name: "Mixture" }).click();
    await expect(page.locator(".lt-mix__rows")).toBeVisible();

    // Two seed rows render and the × button is hidden at the minimum row count.
    const rows = page.locator(".lt-mix__row");
    await expect(rows).toHaveCount(2);
    await expect(
      page.getByRole("button", { name: "Remove component" }),
    ).toHaveCount(0);

    // Set 95/5 N₂/SiH₄ via the two percent inputs.
    const percentInputs = page.locator(".lt-mix__row-percent input");
    await percentInputs.nth(0).fill("95");
    await percentInputs.nth(1).fill("5");
    await expect(page.locator('.lt-mix__total[data-state="ok"]')).toBeVisible();

    // Enter a flow and confirm at least one result appears.
    await page
      .getByRole("group", { name: "Target flow rate" })
      .getByRole("spinbutton")
      .fill("100");
    await expect(page.locator(".lt-finder__result").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("mixture URL params pre-fill the mixture editor", async ({ page }) => {
    await page.goto(
      "/en/products/finder?fn=MFC&gasMix=silane:5,nitrogen:95&flow=100&unit=slpm",
    );
    await expect(
      page.getByRole("radio", { name: "Mixture", checked: true }),
    ).toBeVisible();
    const percentInputs = page.locator(".lt-mix__row-percent input");
    await expect(percentInputs.nth(0)).toHaveValue("5");
    await expect(percentInputs.nth(1)).toHaveValue("95");
    await expect(page.locator(".lt-finder__result").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("pressure filter narrows matches (LEPC drops out beyond its range)", async ({
    page,
  }) => {
    // Brittleness note: anchors on LEPC's published `pressureRange`
    // (0.1–6 barA today). A Sanity content edit that widens that range will
    // break this test with no code change — re-anchor to whichever EPC owns
    // a narrow range below 50 bar at that point.
    await page.goto("/en/products/finder?fn=EPC&p=2&pu=bar");
    await expect(
      page.locator(".lt-finder__result").filter({ hasText: "LEPC" }),
    ).toHaveCount(1);

    await page.goto("/en/products/finder?fn=EPC&p=50&pu=bar");
    await expect(
      page.locator(".lt-finder__result").filter({ hasText: "LEPC" }),
    ).toHaveCount(0);
  });
});

import { test, expect } from "@playwright/test";

// #223 — ROU products used to render dash-only spec columns in the category
// listing because the table headers (range/accuracy/response/fitting) only
// apply to flow devices. The ROU stack now renders in the compact variant.
test.describe("ROU stack on /products/specialized", () => {
  test("renders ROU products without flow-device spec columns", async ({
    page,
  }) => {
    await page.goto("/en/products/specialized");

    const stacks = page.locator(".lt-prod-stack");
    const instrumentsStack = stacks.filter({ hasText: "Read-Out Units" });
    await expect(instrumentsStack).toBeVisible();

    const compactTable = instrumentsStack.locator(
      ".lt-prod-stack__table--compact",
    );
    await expect(compactTable).toBeVisible();

    // None of the flow-device cell classes should exist in the instruments
    // stack — that's the actual fix for the "empty columns" bug.
    await expect(
      instrumentsStack.locator(".lt-prod-row__cell--range"),
    ).toHaveCount(0);
    await expect(
      instrumentsStack.locator(".lt-prod-row__cell--acc"),
    ).toHaveCount(0);
    await expect(
      instrumentsStack.locator(".lt-prod-row__cell--resp"),
    ).toHaveCount(0);
    await expect(
      instrumentsStack.locator(".lt-prod-row__cell--fit"),
    ).toHaveCount(0);

    // LTI-2000 should still be reachable from the listing.
    const lti2000Link = instrumentsStack.getByRole("link", {
      name: /LTI-2000/i,
    });
    await expect(lti2000Link.first()).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

// #223 — ROU products used to render dash-only spec columns in the category
// listing because the table headers (range/accuracy/response/fitting) only
// apply to flow devices. The ROU stack now renders in the compact variant
// (table without those columns at all). We assert against the compact
// table's stable CSS hook + LTI-2000's presence, not against a translation
// string — copy reworks shouldn't fail this test.
test.describe("ROU stack on /products/specialized", () => {
  test("renders the ROU stack in the compact variant", async ({ page }) => {
    await page.goto("/en/products/specialized");

    const compactTable = page.locator(".lt-prod-stack__table--compact");
    await expect(compactTable).toBeVisible();

    // LTI-2000 is the canonical ROU product; it should still be reachable
    // from the compact listing.
    const lti2000Link = compactTable.getByRole("link", { name: /LTI-2000/i });
    await expect(lti2000Link.first()).toBeVisible();

    // None of the flow-device cell classes should appear inside the
    // compact stack — that's the actual fix for the "empty columns" bug.
    for (const cls of [
      ".lt-prod-row__cell--range",
      ".lt-prod-row__cell--acc",
      ".lt-prod-row__cell--resp",
      ".lt-prod-row__cell--fit",
    ]) {
      await expect(compactTable.locator(cls)).toHaveCount(0);
    }
  });
});

import { test, expect } from "@playwright/test";

test.describe("Applications detail page", () => {
  test("known slug renders title, lede, and related categories", async ({
    page,
  }) => {
    await page.goto("/en/applications/semiconductor");

    await expect(page.locator("h1.ap-detail__title")).toBeVisible();
    await expect(page.locator(".ap-detail__lede")).toBeVisible();
    await expect(page.locator(".ap-sidebar-block__heading")).toBeVisible();
  });

  test("Korean locale renders Korean detail copy", async ({ page }) => {
    await page.goto("/ko/applications/semiconductor");

    const title = page.locator("h1.ap-detail__title");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("반도체");
  });

  test("unknown slug returns 404", async ({ page }) => {
    const res = await page.goto("/en/applications/zz-not-a-real-application");
    expect(res?.status()).toBe(404);
  });

  test("application card on /applications links to /applications/{slug}", async ({
    page,
  }) => {
    await page.goto("/en/applications");

    const card = page.locator('a[href*="/applications/semiconductor"]').first();
    await expect(card).toBeVisible();
    await card.click();
    await page.waitForURL(/\/en\/applications\/semiconductor/);
    await expect(page.locator("h1.ap-detail__title")).toBeVisible();
  });
});

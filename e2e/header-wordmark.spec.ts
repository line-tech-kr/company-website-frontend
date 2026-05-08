import { test, expect } from "@playwright/test";

test.describe("Header wordmark (#162)", () => {
  test("renders LINE in amber + dot + TECH + tagline", async ({ page }) => {
    await page.goto("/en");

    const wordmark = page.locator(".pd-top__wordmark").first();
    await expect(wordmark).toBeVisible();

    const line = wordmark.locator(".pd-top__wordmark-line");
    const tech = wordmark.locator(".pd-top__wordmark-tech");
    const dot = wordmark.locator(".pd-top__wordmark-dot");

    await expect(line).toHaveText("LINE");
    await expect(tech).toHaveText("TECH");
    await expect(dot).toBeVisible();
    await expect(dot).toHaveAttribute("aria-hidden", "true");

    const tagline = page.locator(".pd-top__tagline").first();
    await expect(tagline).toBeVisible();
    await expect(tagline).not.toHaveText("");
  });

  test("LINE span uses the accent token (amber)", async ({ page }) => {
    await page.goto("/en");
    const lineColor = await page
      .locator(".pd-top__wordmark-line")
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    const techColor = await page
      .locator(".pd-top__wordmark-tech")
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    expect(lineColor).not.toBe(techColor);
  });
});

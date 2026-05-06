import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/contact");
  });

  test("renders the inquiry form with all required fields", async ({
    page,
  }) => {
    await expect(page.locator("#ct-inquiry-type")).toBeVisible();
    await expect(page.locator("#ct-name")).toBeVisible();
    await expect(page.locator("#ct-email")).toBeVisible();
    await expect(page.locator("#ct-message")).toBeVisible();
  });

  test("submit button is enabled after Turnstile site key is set", async ({
    page,
  }) => {
    // The NEXT_PUBLIC_TURNSTILE_SITE_KEY env var is set in playwright.config.ts
    // webServer.env. Without it, the button stays permanently disabled.
    const submitBtn = page.getByRole("button", { name: /send inquiry/i });
    await expect(submitBtn).toBeEnabled();
  });

  test("fills and submits the form — expects either success or server error", async ({
    page,
  }) => {
    // Fill all required fields
    await page.locator("#ct-inquiry-type").selectOption("general");
    await page.locator("#ct-name").fill("Test User");
    await page.locator("#ct-email").fill("test@example.com");
    await page.locator("#ct-company").fill("Test Co");
    await page
      .locator("#ct-message")
      .fill("This is an automated E2E test submission — please ignore.");

    await page.getByRole("button", { name: /send inquiry/i }).click();

    // The form either succeeds (role="status") or returns a server error
    // (role="alert"). Both prove the full submit path ran. Email delivery is
    // not tested here — that's an external service.
    await expect(page.locator('[role="status"], [role="alert"]')).toBeVisible({
      timeout: 15_000,
    });
  });
});

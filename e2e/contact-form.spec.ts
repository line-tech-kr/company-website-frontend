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

  test("submit button enables once Turnstile + consent are set", async ({
    page,
  }) => {
    // Two independent gates keep the submit button disabled:
    //   1. NEXT_PUBLIC_TURNSTILE_SITE_KEY (supplied via .env.local locally and
    //      the "Write .env.local for E2E" step in CI — without it webpack
    //      inlines the empty value and the button stays permanently disabled).
    //   2. The PIPA Art. 22 consent checkbox.
    const submitBtn = page.getByRole("button", { name: /send inquiry/i });
    await expect(submitBtn).toBeDisabled();

    await page.locator('input[name="consent"]').check();
    await expect(submitBtn).toBeEnabled();
  });

  test("submits the form and resolves to the expected outcome", async ({
    page,
  }) => {
    await page.locator("#ct-inquiry-type").selectOption("general");
    await page.locator("#ct-name").fill("Test User");
    await page.locator("#ct-email").fill("test@example.com");
    await page.locator("#ct-company").fill("Test Co");
    await page
      .locator("#ct-message")
      .fill("This is an automated E2E test submission — please ignore.");
    await page.locator('input[name="consent"]').check();

    // Wait for the Turnstile widget to populate its hidden token field.
    // Without this the schema rejects with errorKey: "invalid" and the test
    // can't distinguish a missing-token race from a real validation bug.
    await expect(
      page.locator('input[name="cf-turnstile-response"]'),
    ).toHaveValue(/.+/, {
      timeout: 15_000,
    });

    await page.getByRole("button", { name: /send inquiry/i }).click();

    // Without RESEND_API_KEY (CI default), email send throws and the action
    // returns errorKey: "server" → render the "server" copy. With a real key
    // and SANITY_WRITE_TOKEN, the success copy renders instead. Asserting on
    // the specific copy means a silently-broken form (no submit handler, wrong
    // action wiring) would fail the test instead of slipping through.
    const hasResend = !!process.env.RESEND_API_KEY;
    if (hasResend) {
      await expect(
        page.getByRole("status").filter({
          hasText: /your inquiry was sent/i,
        }),
      ).toBeVisible({ timeout: 15_000 });
    } else {
      await expect(
        page.getByRole("alert").filter({
          hasText: /could not send your message|email us directly/i,
        }),
      ).toBeVisible({ timeout: 15_000 });
    }
  });

  test("rejects an invalid submission with a validation alert", async ({
    page,
  }) => {
    // Tick consent so the submit button is reachable, then leave the rest
    // empty — the server action returns errorKey: "invalid" before any
    // external call, so this works without Resend/Sanity creds.
    await page.locator('input[name="consent"]').check();
    await page.getByRole("button", { name: /send inquiry/i }).click();

    await expect(
      page.getByRole("alert").filter({
        hasText: /check the highlighted fields/i,
      }),
    ).toBeVisible({ timeout: 10_000 });
  });
});

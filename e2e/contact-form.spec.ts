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

  test("reveals quote fields and submits a quote happy path", async ({
    page,
  }) => {
    await page.locator("#ct-inquiry-type").selectOption("quote");

    // Quote-only fields should appear once "quote" is selected.
    await expect(page.locator("#ct-gas")).toBeVisible();
    await expect(page.locator("#ct-flow-value")).toBeVisible();
    await expect(page.locator("#ct-pressure-value")).toBeVisible();
    await expect(page.locator("#ct-fitting-type")).toBeVisible();
    await expect(page.locator("#ct-fitting-size")).toBeVisible();

    // Pure mode is the default; fill the single gas input.
    await page.locator("#ct-gas").fill("N2");
    await page.locator("#ct-flow-value").fill("500");
    await page.locator('select[name="flowUnit"]').selectOption("sccm");
    await page.locator("#ct-pressure-value").fill("2");
    await page.locator('select[name="pressureUnit"]').selectOption("bar");
    await page.locator("#ct-fitting-type").selectOption("VCR");
    await page.locator("#ct-fitting-size").fill('1/4"');

    await page.locator("#ct-name").fill("Quote Tester");
    await page.locator("#ct-email").fill("quote@example.com");
    await page
      .locator("#ct-message")
      .fill("Automated E2E quote test — please ignore.");
    await page.locator('input[name="consent"]').check();

    await expect(
      page.locator('input[name="cf-turnstile-response"]'),
    ).toHaveValue(/.+/, { timeout: 15_000 });

    await page.getByRole("button", { name: /send inquiry/i }).click();

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

  test("submits a quote with a gas mixture", async ({ page }) => {
    await page.locator("#ct-inquiry-type").selectOption("quote");

    // Switch to mixture mode and fill two components summing to 100%.
    await page.locator('input[name="gasModeRadio"][value="mixture"]').check();

    const components = page.locator(".ct-form__gas-component");
    await components.nth(0).locator('input[type="text"]').fill("SiH4");
    await components.nth(0).locator('input[type="number"]').fill("5");
    await components.nth(1).locator('input[type="text"]').fill("N2");
    await components.nth(1).locator('input[type="number"]').fill("95");

    await page.locator("#ct-flow-value").fill("500");
    await page.locator('select[name="flowUnit"]').selectOption("sccm");
    await page.locator("#ct-pressure-value").fill("2");
    await page.locator('select[name="pressureUnit"]').selectOption("bar");
    await page.locator("#ct-fitting-type").selectOption("VCR");
    await page.locator("#ct-fitting-size").fill('1/4"');

    await page.locator("#ct-name").fill("Mixture Tester");
    await page.locator("#ct-email").fill("mix@example.com");
    await page
      .locator("#ct-message")
      .fill("Automated E2E mixture test — please ignore.");
    await page.locator('input[name="consent"]').check();

    // Lock in the mixture wire format — without this, a regression that
    // drops the JSON or flips the mode flag would produce the same final
    // outcome as the pure-mode test (server error without RESEND_API_KEY).
    await expect(page.locator('input[name="gasMode"]')).toHaveValue("mixture");
    await expect(page.locator('input[name="gasComponents"]')).toHaveValue(
      '[{"gas":"SiH4","percent":5},{"gas":"N2","percent":95}]',
    );

    await expect(
      page.locator('input[name="cf-turnstile-response"]'),
    ).toHaveValue(/.+/, { timeout: 15_000 });

    await page.getByRole("button", { name: /send inquiry/i }).click();

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

  test("product CTA prefills the contact form in quote mode", async ({
    page,
  }) => {
    // Bypass the default beforeEach `/en/contact` nav and arrive via the
    // product-page CTA equivalent: ?product=<model>.
    await page.goto("/en/contact?product=M3030VA");

    await expect(page.locator("#ct-inquiry-type")).toHaveValue("quote");
    await expect(page.locator("#ct-subject")).toHaveValue(
      /Quote request: M3030VA/,
    );
    await expect(page.locator("#ct-message")).toHaveValue(/M3030VA/);
    // The prefilled message must not claim conditions are "below" — they
    // render above the message textarea, not below.
    await expect(page.locator("#ct-message")).not.toHaveValue(/below/i);
    // Process conditions block must be rendered as a result of the prefill.
    await expect(page.locator("#ct-quote-model")).toHaveValue("M3030VA");
    await expect(page.locator("#ct-gas")).toBeVisible();
    await expect(page.locator("#ct-flow-value")).toBeVisible();
    await expect(page.locator("#ct-pressure-value")).toBeVisible();
    await expect(page.locator("#ct-fitting-type")).toBeVisible();
  });

  test("Model input is always visible when Quote is selected, blank without prefill", async ({
    page,
  }) => {
    await page.locator("#ct-inquiry-type").selectOption("quote");
    const model = page.locator("#ct-quote-model");
    await expect(model).toBeVisible();
    await expect(model).toHaveValue("");
  });

  test("flags missing quote fields when submitted blank", async ({ page }) => {
    await page.locator("#ct-inquiry-type").selectOption("quote");
    await page.locator("#ct-name").fill("Quote Tester");
    await page.locator("#ct-email").fill("quote@example.com");
    await page.locator("#ct-message").fill("Hello.");
    await page.locator('input[name="consent"]').check();

    // Skip filling the quote-only fields — the schema's superRefine must
    // mark gas/flow/pressure/fitting as invalid.
    await expect(
      page.locator('input[name="cf-turnstile-response"]'),
    ).toHaveValue(/.+/, { timeout: 15_000 });

    await page.getByRole("button", { name: /send inquiry/i }).click();

    await expect(page.locator("#ct-gas")).toHaveAttribute(
      "aria-invalid",
      "true",
      { timeout: 10_000 },
    );
    await expect(page.locator("#ct-flow-value")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.locator("#ct-pressure-value")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("rejects an invalid submission with a validation alert", async ({
    page,
  }) => {
    // Tick consent so the submit button is reachable, then leave the rest
    // empty — the server action returns errorKey: "invalid" before any
    // external call, so this works without Resend/Sanity creds.
    await page.locator('input[name="consent"]').check();
    await page.getByRole("button", { name: /send inquiry/i }).click();

    // Global summary message — new copy after retiring the "highlighted" lie.
    await expect(
      page.getByRole("alert").filter({
        hasText: /some fields need attention|review the inputs marked below/i,
      }),
    ).toBeVisible({ timeout: 10_000 });

    // Per-field highlighting — locks in the actual UX promised by the summary.
    // Email is required, was left blank, must be marked invalid.
    await expect(page.locator("#ct-email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("preserves typed inputs after a failed submission", async ({ page }) => {
    // Regression guard for #251: React 19's <form action> auto-resets the form
    // after every submit, wiping user input. Switching to onSubmit must keep
    // every filled value in place when validation fails.
    await page.locator("#ct-inquiry-type").selectOption("general");
    await page.locator("#ct-name").fill("Preserved Tester");
    await page.locator("#ct-company").fill("Acme Corp");
    await page.locator("#ct-phone").fill("+82-10-0000-0000");
    await page
      .locator("#ct-message")
      .fill("Values must survive a failed submit.");
    // Leave email blank — schema rejects, server action returns errorKey "invalid".
    await page.locator('input[name="consent"]').check();
    await page.getByRole("button", { name: /send inquiry/i }).click();

    await expect(page.locator("#ct-email")).toHaveAttribute(
      "aria-invalid",
      "true",
      { timeout: 10_000 },
    );

    await expect(page.locator("#ct-inquiry-type")).toHaveValue("general");
    await expect(page.locator("#ct-name")).toHaveValue("Preserved Tester");
    await expect(page.locator("#ct-company")).toHaveValue("Acme Corp");
    await expect(page.locator("#ct-phone")).toHaveValue("+82-10-0000-0000");
    await expect(page.locator("#ct-message")).toHaveValue(
      "Values must survive a failed submit.",
    );
  });
});

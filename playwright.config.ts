import { defineConfig, devices } from "@playwright/test";

const CI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 1 : undefined,
  reporter: CI
    ? [["github"], ["html", { open: "never" }]]
    : [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !CI,
    timeout: 120_000,
    env: {
      // Turnstile test site key — always passes, never prompts the user.
      // The server-side captcha.ts no-ops without TURNSTILE_SECRET_KEY in
      // dev mode, so no secret key is needed here.
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
    },
  },
});

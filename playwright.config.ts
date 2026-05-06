import { defineConfig, devices } from "@playwright/test";

const CI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // Always 1 worker — multiple workers race the dev server's on-demand
  // compilation, causing flaky hydration-dependent tests (locale switcher,
  // Next.js Link clicks).
  workers: 1,
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
    command: "pnpm dev --webpack",
    url: "http://localhost:3000",
    reuseExistingServer: !CI,
    timeout: 120_000,
    // NEXT_PUBLIC_* vars used in client components must come from a .env file
    // (webpack inlines them at compile time, not from process.env). See
    // .env.local in this worktree, and the "Write .env.local" CI step.
  },
});

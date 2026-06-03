import { test, expect } from "@playwright/test";

test.describe("Retired resources routes", () => {
  for (const locale of ["en", "ko", "zh"] as const) {
    test(`/${locale}/resources/datasheets returns 404 (retired #239)`, async ({
      page,
    }) => {
      const res = await page.goto(`/${locale}/resources/datasheets`);
      expect(res?.status()).toBe(404);
    });
  }
});

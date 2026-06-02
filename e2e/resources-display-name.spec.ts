import { test, expect } from "@playwright/test";

test.describe("Data-room display-name localisation", () => {
  test.use({ locale: "ko-KR" });

  test("Korean certifications page renders Patent rows in 한글", async ({
    page,
  }) => {
    await page.goto("/ko/resources/certifications");
    // The seed script localises every `Patent KR …` cert. If the GROQ
    // projection regresses (e.g. coalesces away an empty Studio entry to
    // English), this assertion catches it.
    await expect(
      page
        .getByRole("heading", { level: 3 })
        .filter({ hasText: /^특허 KR/ })
        .first(),
    ).toBeVisible();
  });

  test("Chinese certifications page renders Patent rows as 专利", async ({
    page,
  }) => {
    await page.goto("/zh/resources/certifications");
    await expect(
      page
        .getByRole("heading", { level: 3 })
        .filter({ hasText: /^专利 KR/ })
        .first(),
    ).toBeVisible();
  });

  test("Korean manuals page renders rows with the 매뉴얼 suffix", async ({
    page,
  }) => {
    await page.goto("/ko/resources/manuals");
    await expect(page.getByText(/매뉴얼$/).first()).toBeVisible();
  });

  test("Chinese manuals page renders rows with the 手册 suffix", async ({
    page,
  }) => {
    await page.goto("/zh/resources/manuals");
    await expect(page.getByText(/手册$/).first()).toBeVisible();
  });

  test("English certifications page still renders the source name (no regression)", async ({
    page,
  }) => {
    await page.goto("/en/resources/certifications");
    await expect(
      page.getByRole("heading", { level: 3, name: /^Patent KR/ }).first(),
    ).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Data-room software page", () => {
  test("hub shows the Software card linking to /resources/software", async ({
    page,
  }) => {
    await page.goto("/en/resources");
    const card = page.getByRole("link", { name: /Software/ });
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/en\/resources\/software$/);
  });

  test("software page lists DMFC for Windows with a ZIP download", async ({
    page,
  }) => {
    await page.goto("/en/resources/software");
    await expect(
      page.getByRole("heading", { level: 1, name: "Software" }),
    ).toBeVisible();
    const row = page.locator(".dr-list__row", { hasText: "DMFC for Windows" });
    await expect(row).toBeVisible();
    await expect(row.locator(".dr-list__badge")).toHaveText("ZIP");
    const href = await row.locator(".dr-list__btn").getAttribute("href");
    expect(href).toContain("cdn.sanity.io");
    expect(href).toContain(".zip");
  });

  test("Korean software page renders the localised display name", async ({
    page,
  }) => {
    await page.goto("/ko/resources/software");
    await expect(
      page.getByText("DMFC for Windows (PC 소프트웨어)"),
    ).toBeVisible();
  });
});

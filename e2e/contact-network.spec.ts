import { test, expect } from "@playwright/test";

test.describe("Contact distributor region pages (#163)", () => {
  test("known region renders heading + coming-soon panel + back link", async ({
    page,
  }) => {
    await page.goto("/en/contact/network/kr");

    await expect(page.locator("h1.ct-region__title")).toBeVisible();
    await expect(page.locator(".ct-region__panel h2")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /back to contact/i }),
    ).toBeVisible();
  });

  test("Korean locale renders Korean region copy", async ({ page }) => {
    await page.goto("/ko/contact/network/cn");

    const title = page.locator("h1.ct-region__title");
    await expect(title).toBeVisible();
    // The KR fixture uses "중국" for cn — assert it's the Korean string.
    await expect(title).toHaveText("중국");
  });

  test("unknown region returns 404", async ({ page }) => {
    const res = await page.goto("/en/contact/network/zz-not-a-region");
    expect(res?.status()).toBe(404);
  });

  test("region card on /contact links to /contact/network/{id} (#152)", async ({
    page,
  }) => {
    await page.goto("/en/contact");

    const krLink = page.locator('a[href*="/contact/network/kr"]').first();
    await expect(krLink).toBeVisible();
    await krLink.click();
    await page.waitForURL(/\/en\/contact\/network\/kr/);
    await expect(page.locator("h1.ct-region__title")).toBeVisible();
  });
});

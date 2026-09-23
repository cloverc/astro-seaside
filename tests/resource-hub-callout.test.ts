import { expect, test, type Page } from "@playwright/test";

async function openFilters(page: Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 1024) {
    await page.getByRole("button", { name: /Filter resources/ }).click();
  }
}

test.describe("resource hub callout on homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders heading and all three audience links", async ({ page }) => {
    const section = page.locator("#resource-hub-callout");
    await expect(section).toBeVisible();
    await expect(section.locator("h2")).toBeVisible();

    await expect(
      section.locator('[data-audience-link="General Public"]'),
    ).toBeVisible();
    await expect(
      section.locator('[data-audience-link="Heritage Professionals"]'),
    ).toBeVisible();
    await expect(
      section.locator('[data-audience-link="Academics & Researchers"]'),
    ).toBeVisible();
  });

  test("browse all resources button links to resource hub", async ({
    page,
  }) => {
    const section = page.locator("#resource-hub-callout");
    await expect(
      section.getByRole("link", { name: /browse all resources/i }),
    ).toHaveAttribute("href", "/resource-hub/");
  });

  for (const audience of [
    "General Public",
    "Heritage Professionals",
    "Academics & Researchers",
  ]) {
    test(`"${audience}" column links to resource hub filtered by that audience`, async ({
      page,
    }) => {
      const section = page.locator("#resource-hub-callout");
      const link = section.locator(`[data-audience-link="${audience}"]`);
      await link.scrollIntoViewIfNeeded();
      await link.click();

      await page.waitForURL(
        `/resource-hub/?audience=${encodeURIComponent(audience)}`,
      );

      await openFilters(page);
      await expect(
        page.getByRole("checkbox", { name: audience }),
      ).toBeChecked();

      const visible = page.locator("[data-rh-card]:visible");
      const count = await visible.count();
      test.skip(count === 0, "No resources match this audience in the dataset");

      for (const card of await visible.all()) {
        await expect(card).toHaveAttribute(
          "data-audience",
          new RegExp(audience),
        );
      }
    });
  }
});

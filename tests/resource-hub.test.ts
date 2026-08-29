import { expect, test } from "@playwright/test";

test.describe("resource hub page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resource-hub/");
  });

  test("renders heading and all resource cards", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "The Resource Hub", level: 1 }),
    ).toBeVisible();

    const cards = page.locator("[data-rh-card]");
    await expect(cards).toHaveCount(12);
  });

  test("count text reflects total on load", async ({ page }) => {
    await expect(page.locator("#rh-count")).toHaveText(
      "Showing 12 of 12 resources",
    );
  });

  test("search filters cards by title", async ({ page }) => {
    await page.locator("#rh-search").fill("pier");

    const visible = page.locator("[data-rh-card]:visible");
    await expect(visible).toHaveCount(1);
    await expect(page.locator("#rh-count")).toHaveText(
      "Showing 1 of 12 resources",
    );
  });

  test("search filters cards by description text", async ({ page }) => {
    await page.locator("#rh-search").fill("oral history");

    await expect(page.locator("[data-rh-card]:visible")).toHaveCount(1);
  });

  test("search with no matches shows empty state", async ({ page }) => {
    await page.locator("#rh-search").fill("xyznotaword");

    await expect(page.locator("#rh-empty")).toBeVisible();
    await expect(page.locator("#rh-grid")).not.toBeVisible();
    await expect(page.locator("#rh-count")).toHaveText(
      "Showing 0 of 12 resources",
    );
  });

  test("category checkbox filters cards", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Research" }).check();

    const visible = page.locator("[data-rh-card]:visible");
    const count = await visible.count();
    expect(count).toBeGreaterThan(0);

    for (const card of await visible.all()) {
      await expect(card).toHaveAttribute("data-category", "Research");
    }

    await expect(page.locator("#rh-count")).toContainText(
      `Showing ${count} of 12 resources`,
    );
  });

  test("multiple category checkboxes combine with OR logic", async ({
    page,
  }) => {
    await page.getByRole("checkbox", { name: "Research" }).check();
    await page.getByRole("checkbox", { name: "Best Practice" }).check();

    const visible = page.locator("[data-rh-card]:visible");
    for (const card of await visible.all()) {
      const cat = await card.getAttribute("data-category");
      expect(["Research", "Best Practice"]).toContain(cat);
    }
  });

  test("content type checkbox filters cards", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Video" }).check();

    const visible = page.locator("[data-rh-card]:visible");
    const count = await visible.count();
    expect(count).toBeGreaterThan(0);

    for (const card of await visible.all()) {
      await expect(card).toHaveAttribute("data-format", "Video");
    }
  });

  test("category and content type filters combine with AND logic", async ({
    page,
  }) => {
    await page.getByRole("checkbox", { name: "Best Practice" }).check();
    await page.getByRole("checkbox", { name: "PDF" }).check();

    for (const card of await page.locator("[data-rh-card]:visible").all()) {
      await expect(card).toHaveAttribute("data-category", "Best Practice");
      await expect(card).toHaveAttribute("data-format", "PDF");
    }
  });

  test("filter chips appear when filter is selected", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Research" }).check();

    const chips = page.locator("#rh-chips");
    await expect(chips).toBeVisible();
    await expect(chips.getByRole("button", { name: /Research/ })).toBeVisible();
  });

  test("removing a chip unchecks the filter", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Research" }).check();

    await page
      .locator("#rh-chips")
      .getByRole("button", { name: /Research/ })
      .click();

    await expect(
      page.getByRole("checkbox", { name: "Research" }),
    ).not.toBeChecked();
    await expect(page.locator("[data-rh-card]:visible")).toHaveCount(12);
  });

  test("clear all resets all filters", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Research" }).check();
    await page.getByRole("checkbox", { name: "PDF" }).check();

    await page.getByRole("button", { name: "Clear all filters" }).click();

    await expect(
      page.getByRole("checkbox", { name: "Research" }),
    ).not.toBeChecked();
    await expect(page.getByRole("checkbox", { name: "PDF" })).not.toBeChecked();
    await expect(page.locator("[data-rh-card]:visible")).toHaveCount(12);
    await expect(page.locator("#rh-chips")).not.toBeVisible();
  });

  test("clear all button is hidden when no filters are active", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "Clear all filters" }),
    ).not.toBeVisible();
  });

  test("search and category filter work together", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Best Practice" }).check();
    await page.locator("#rh-search").fill("climate");

    const visible = page.locator("[data-rh-card]:visible");
    await expect(visible).toHaveCount(1);
    await expect(visible.first()).toHaveAttribute(
      "data-category",
      "Best Practice",
    );
  });

  test("Resource Hub nav link is marked as current page", async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 1024) {
      await page.getByRole("button", { name: "Toggle Menu" }).click();
    }

    const link = page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Resource Hub" });
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(link).toBeVisible();
  });
});

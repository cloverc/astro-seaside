import { expect, test, type Page } from "@playwright/test";

async function openFilters(page: Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 1024) {
    await page.getByRole("button", { name: /Filter resources/ }).click();
  }
}

test.describe("resource hub page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resource-hub/");
  });

  test("renders heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "The Resource Hub", level: 1 }),
    ).toBeVisible();
  });

  test("shows resource cards", async ({ page }) => {
    const cards = page.locator("[data-rh-card]");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("count text reflects total on load", async ({ page }) => {
    await expect(page.locator("#rh-count")).toContainText("resources");
  });

  test("pagination shows max 6 cards at once", async ({ page }) => {
    const visible = page.locator("[data-rh-card]:visible");
    expect(await visible.count()).toBeLessThanOrEqual(6);
  });

  test("search filters cards by title", async ({ page }) => {
    const firstTitle =
      (await page
        .locator("[data-rh-card]")
        .first()
        .locator("h2")
        .textContent()) ?? "";
    const searchWord =
      firstTitle.split(" ").find((w) => w.length > 4) ??
      firstTitle.split(" ")[0];
    await page.locator("#rh-search").fill(searchWord);
    await expect(page.locator("[data-rh-card]:visible").first()).toBeVisible();
    await expect(page.locator("#rh-count")).toContainText("Showing");
  });

  test("search filters cards by description text", async ({ page }) => {
    const firstDesc =
      (await page
        .locator("[data-rh-card]")
        .first()
        .locator("p")
        .first()
        .textContent()) ?? "";
    const searchWord =
      firstDesc.split(" ").find((w) => w.length > 6) ?? firstDesc.split(" ")[0];
    await page.locator("#rh-search").fill(searchWord);
    await expect(page.locator("[data-rh-card]:visible").first()).toBeVisible();
  });

  test("search with no matches shows empty state", async ({ page }) => {
    await page.locator("#rh-search").fill("xyznotaword");
    await expect(page.locator("#rh-empty")).toBeVisible();
    await expect(page.locator("#rh-grid")).not.toBeVisible();
    await expect(page.locator("#rh-count")).toContainText("Showing 0 of");
  });

  test("audience checkbox filters cards", async ({ page }) => {
    await openFilters(page);
    await page.getByRole("checkbox", { name: "General Public" }).check();

    const visible = page.locator("[data-rh-card]:visible");
    const count = await visible.count();
    expect(count).toBeGreaterThan(0);

    for (const card of await visible.all()) {
      await expect(card).toHaveAttribute("data-audience", /General Public/);
    }

    await expect(page.locator("#rh-count")).toContainText(
      `Showing ${count} of`,
    );
  });

  test("multiple audience checkboxes combine with OR logic", async ({
    page,
  }) => {
    await openFilters(page);
    await page.getByRole("checkbox", { name: "General Public" }).check();
    await page
      .getByRole("checkbox", { name: "Heritage Professionals" })
      .check();

    for (const card of await page.locator("[data-rh-card]:visible").all()) {
      const aud = (await card.getAttribute("data-audience")) ?? "";
      const audValues = aud.split("|");
      expect(
        audValues.some((a) =>
          ["General Public", "Heritage Professionals"].includes(a),
        ),
      ).toBe(true);
    }
  });

  test("resource type checkbox filters cards", async ({ page }) => {
    await openFilters(page);
    await page
      .locator("button.rh-group-toggle", { hasText: "Resource type" })
      .click();

    const resourceType = await page
      .locator("[data-rh-card]")
      .first()
      .getAttribute("data-resource-type");
    test.skip(!resourceType, "First card has no resource type set");

    await page.getByRole("checkbox", { name: resourceType! }).check();

    const visible = page.locator("[data-rh-card]:visible");
    expect(await visible.count()).toBeGreaterThan(0);
    for (const card of await visible.all()) {
      await expect(card).toHaveAttribute("data-resource-type", resourceType!);
    }
  });

  test("audience and resource type filters combine with AND logic", async ({
    page,
  }) => {
    await openFilters(page);

    const firstCard = page.locator("[data-rh-card]").first();
    const audienceRaw = await firstCard.getAttribute("data-audience");
    const audience = audienceRaw?.split("|")[0] ?? "";
    const resourceType = await firstCard.getAttribute("data-resource-type");
    test.skip(
      !audience || !resourceType,
      "First card missing audience or resource type",
    );

    await page.getByRole("checkbox", { name: audience }).check();
    await page
      .locator("button.rh-group-toggle", { hasText: "Resource type" })
      .click();
    await page.getByRole("checkbox", { name: resourceType! }).check();

    for (const card of await page.locator("[data-rh-card]:visible").all()) {
      const aud = (await card.getAttribute("data-audience")) ?? "";
      expect(aud.split("|")).toContain(audience!);
      await expect(card).toHaveAttribute("data-resource-type", resourceType!);
    }
  });

  test("filter chips appear when filter is selected", async ({ page }) => {
    await openFilters(page);
    await page.getByRole("checkbox", { name: "General Public" }).check();

    const chips = page.locator("#rh-chips");
    await expect(chips).toBeVisible();
    await expect(
      chips.getByRole("button", { name: /General Public/ }),
    ).toBeVisible();
  });

  test("removing a chip unchecks the filter", async ({ page }) => {
    await openFilters(page);
    await page.getByRole("checkbox", { name: "General Public" }).check();

    await page
      .locator("#rh-chips")
      .getByRole("button", { name: /General Public/ })
      .click();

    await expect(
      page.getByRole("checkbox", { name: "General Public" }),
    ).not.toBeChecked();
  });

  test("clear all resets all filters", async ({ page }) => {
    await openFilters(page);
    await page.getByRole("checkbox", { name: "General Public" }).check();
    await page
      .locator("button.rh-group-toggle", { hasText: "Resource type" })
      .click();

    const firstResourceType = page
      .locator("[data-rh-filter='resourceType']")
      .first();
    const resourceTypeName = await firstResourceType.getAttribute("value");
    test.skip(!resourceTypeName, "No resource types available");

    await page.getByRole("checkbox", { name: resourceTypeName! }).check();

    await page.getByRole("button", { name: "Clear all filters" }).click();

    await expect(
      page.getByRole("checkbox", { name: "General Public" }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("checkbox", { name: resourceTypeName! }),
    ).not.toBeChecked();
    await expect(page.locator("#rh-chips")).not.toBeVisible();
  });

  test("clear all button is hidden when no filters are active", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "Clear all filters" }),
    ).not.toBeVisible();
  });

  test("search and audience filter work together", async ({ page }) => {
    await openFilters(page);
    await page.getByRole("checkbox", { name: "General Public" }).check();

    const firstCard = page.locator("[data-rh-card]:visible").first();
    const firstTitle = (await firstCard.locator("h2").textContent()) ?? "";
    const searchWord =
      firstTitle.split(" ").find((w) => w.length > 4) ??
      firstTitle.split(" ")[0];
    await page.locator("#rh-search").fill(searchWord);

    const visible = page.locator("[data-rh-card]:visible");
    expect(await visible.count()).toBeGreaterThan(0);
    for (const card of await visible.all()) {
      await expect(card).toHaveAttribute("data-audience", /General Public/);
    }
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

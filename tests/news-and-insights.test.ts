import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("news and insights page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/news-and-insights/");
  });

  test("renders heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "News & Insights", level: 1 }),
    ).toBeVisible();
  });

  test("shows article cards", async ({ page }) => {
    const cards = page.locator("[data-ni-card]");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("count text reflects total on load", async ({ page }) => {
    await expect(page.locator("#ni-count")).toContainText("posts");
  });

  test("All pill is active by default", async ({ page }) => {
    await expect(page.locator("#pill-all")).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(page.locator("#pill-news")).not.toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(page.locator("#pill-insights")).not.toHaveAttribute(
      "data-active",
      "true",
    );
  });

  test("News pill shows only news cards", async ({ page }) => {
    const total = await page.locator("[data-ni-card]").count();
    const newsCount = await page
      .locator("[data-ni-card][data-kind='news']")
      .count();
    test.skip(newsCount === 0, "No news cards in dataset");

    await page.locator("#pill-news").click();

    await expect(page.locator("#pill-news")).toHaveAttribute(
      "data-active",
      "true",
    );

    const visible = page.locator("[data-ni-card]:visible");
    expect(await visible.count()).toBeGreaterThan(0);

    for (const card of await visible.all()) {
      await expect(card).toHaveAttribute("data-kind", "news");
    }

    await expect(page.locator("#ni-count")).toContainText(
      `${Math.min(newsCount, 6)} of ${total} posts`,
    );
  });

  test("Insights pill shows only insight cards", async ({ page }) => {
    const total = await page.locator("[data-ni-card]").count();
    const insightCount = await page
      .locator("[data-ni-card][data-kind='insight']")
      .count();
    test.skip(insightCount === 0, "No insight cards in dataset");

    await page.locator("#pill-insights").click();

    await expect(page.locator("#pill-insights")).toHaveAttribute(
      "data-active",
      "true",
    );

    const visible = page.locator("[data-ni-card]:visible");
    expect(await visible.count()).toBeGreaterThan(0);

    for (const card of await visible.all()) {
      await expect(card).toHaveAttribute("data-kind", "insight");
    }

    await expect(page.locator("#ni-count")).toContainText(
      `${Math.min(insightCount, 6)} of ${total} posts`,
    );
  });

  test("count is hidden when no posts match filter", async ({ page }) => {
    const newsCount = await page
      .locator("[data-ni-card][data-kind='news']")
      .count();
    const insightCount = await page
      .locator("[data-ni-card][data-kind='insight']")
      .count();

    if (newsCount === 0) {
      await page.locator("#pill-news").click();
      await expect(page.locator("#ni-count")).not.toBeVisible();
      await expect(page.locator("#ni-empty")).toBeVisible();
    } else if (insightCount === 0) {
      await page.locator("#pill-insights").click();
      await expect(page.locator("#ni-count")).not.toBeVisible();
      await expect(page.locator("#ni-empty")).toBeVisible();
    } else {
      test.skip(true, "Both kinds present — empty state not reachable");
    }
  });

  test("All pill resets after filtering", async ({ page }) => {
    const total = await page.locator("[data-ni-card]").count();

    await page.locator("#pill-news").click();
    await page.locator("#pill-all").click();

    await expect(page.locator("#pill-all")).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(page.locator("#ni-count")).toContainText(
      `${Math.min(total, 6)} of ${total} posts`,
    );
  });

  test("shows max 6 cards at once", async ({ page }) => {
    const visible = page.locator("[data-ni-card]:visible");
    expect(await visible.count()).toBeLessThanOrEqual(6);
  });

  test("pagination appears when more than 6 cards", async ({ page }) => {
    const total = await page.locator("[data-ni-card]").count();
    if (total > 6) {
      await expect(page.locator("#ni-pagination")).toBeVisible();
    } else {
      await expect(page.locator("#ni-pagination")).not.toBeVisible();
    }
  });

  test("News & Insights nav link is marked as current page", async ({
    page,
  }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 1024) {
      await page.getByRole("button", { name: "Toggle Menu" }).click();
    }

    const link = page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "News & Insights" });
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(link).toBeVisible();
  });
});

test.describe("news and insights empty state", () => {
  test("shows a message when no articles are published", async ({ page }) => {
    await page.goto("/news-and-insights/");
    const cardCount = await page.locator("[data-ni-card]").count();
    test.skip(
      cardCount > 0,
      "Articles are currently published — empty state not reachable",
    );

    await expect(
      page.getByText("No news or insights have been published yet."),
    ).toBeVisible();
    await expect(page.locator("#pill-all")).toHaveCount(0);
  });
});

test.describe("news and insights article page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/news-and-insights/");
  });

  test("opening a card shows the article heading", async ({ page }) => {
    const cardCount = await page.locator("[data-ni-card]").count();
    test.skip(cardCount === 0, "No articles published to open");

    const firstCard = page.locator("[data-ni-card]").first();
    const title = (await firstCard.locator("h2").textContent())?.trim();

    await firstCard.getByRole("link", { name: /Read more/ }).click();

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      title ?? "",
    );
  });

  test("back link returns to the News & Insights index", async ({ page }) => {
    const cardCount = await page.locator("[data-ni-card]").count();
    test.skip(cardCount === 0, "No articles published to open");

    await page
      .locator("[data-ni-card]")
      .first()
      .getByRole("link", { name: /Read more/ })
      .click();
    await page.getByRole("link", { name: /Back to News & Insights/ }).click();

    await expect(page).toHaveURL(/\/news-and-insights\/?$/);
  });

  test("article page has no accessibility violations", async ({ page }) => {
    const cardCount = await page.locator("[data-ni-card]").count();
    test.skip(cardCount === 0, "No articles published to open");

    await page
      .locator("[data-ni-card]")
      .first()
      .getByRole("link", { name: /Read more/ })
      .click();

    const results = await new AxeBuilder({ page })
      .exclude("#storyblok-app")
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

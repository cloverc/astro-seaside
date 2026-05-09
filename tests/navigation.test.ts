import { expect, test } from "@playwright/test";

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("focus rings are not clipped by nav overflow (WCAG 2.2 SC 2.4.11)", async ({
    page,
  }) => {
    await page.goto("/");

    const toggleBtn = page.getByRole("button", { name: "Toggle Menu" });
    await toggleBtn.click();

    const navOverflowX = await page.evaluate(() => {
      const nav = document.querySelector("#header nav") as HTMLElement;
      return nav ? window.getComputedStyle(nav).overflowX : "hidden";
    });

    expect(navOverflowX).not.toBe("hidden");
  });

  test("toggle button opens and closes the nav", async ({ page }) => {
    await page.goto("/");

    const toggleBtn = page.getByRole("button", { name: "Toggle Menu" });
    const nav = page.locator("#header nav");

    await expect(nav).not.toBeVisible();

    await toggleBtn.click();
    await expect(nav).toBeVisible();
    await expect(toggleBtn).toHaveClass(/expanded/);

    await toggleBtn.click();
    await expect(nav).not.toBeVisible();
    await expect(toggleBtn).not.toHaveClass(/expanded/);
  });

  test("menu resets after page navigation", async ({ page }) => {
    await page.goto("/");

    const toggleBtn = page.getByRole("button", { name: "Toggle Menu" });
    await toggleBtn.click();
    await expect(page.locator("#header nav")).toBeVisible();

    const contactLink = page
      .locator("#header nav")
      .getByRole("link", { name: "Contact" });
    await contactLink.focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("/contact/");
    await expect(page.locator("#header nav")).not.toBeVisible();
    await expect(toggleBtn).not.toHaveClass(/expanded/);
  });
});

test.describe("dropdown navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("dropdown toggles aria-expanded on click", async ({ page }) => {
    await page.goto("/");

    const eventsBtn = page.getByRole("button", { name: "Events" });

    await expect(eventsBtn).toHaveAttribute("aria-expanded", "false");

    await eventsBtn.click();
    await expect(eventsBtn).toHaveAttribute("aria-expanded", "true");

    await eventsBtn.click();
    await expect(eventsBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("dropdown closes on Escape", async ({ page }) => {
    await page.goto("/");

    const eventsBtn = page.getByRole("button", { name: "Events" });
    await eventsBtn.click();
    await expect(eventsBtn).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(eventsBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("dropdown closes when focus leaves", async ({ page }) => {
    await page.goto("/");

    const eventsBtn = page.getByRole("button", { name: "Events" });
    await eventsBtn.click();
    await expect(eventsBtn).toHaveAttribute("aria-expanded", "true");

    await page.locator("body").click({ position: { x: 10, y: 10 } });
    await expect(eventsBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("dropdown links are keyboard accessible", async ({ page }) => {
    await page.goto("/");

    const eventsBtn = page.getByRole("button", { name: "Events" });
    await eventsBtn.focus();
    await page.keyboard.press("Enter");
    await expect(eventsBtn).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Tab");
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Upcoming Events" }),
    ).toBeFocused();
  });
});

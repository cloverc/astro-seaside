import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  { name: 'home', path: '/' },
  { name: '404', path: '/this-page-does-not-exist' },
  { name: 'upcoming events', path: '/events/upcoming-events/' },
  { name: 'contact', path: '/contact/' },
  { name: 'mission', path: '/mission/' },
  { name: 'meet the team', path: '/team/' },
];

test('skip link is the first tab stop and targets main content', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await skipLink.click();
  await expect(page.locator('#main-content')).toBeFocused();
});

for (const { name, path } of routes) {
  test(`${name} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page }).exclude('#storyblok-app').analyze();

    expect(results.violations).toEqual([]);
  });
}

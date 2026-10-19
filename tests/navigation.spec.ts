import { test, expect } from './fixtures/browser';

test('desktop navigation preserves app routes and accessible dropdowns', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('link', { name: 'Sign In', exact: true })).toHaveAttribute('href', 'https://app.alveta.ai/login');
  await expect(page.getByRole('link', { name: 'Get Started', exact: true })).toHaveAttribute('href', 'https://app.alveta.ai/register');
  await expect(page.getByRole('link', { name: 'Pricing', exact: true })).toHaveAttribute('href', '#pricing');
  const products = page.locator('summary').filter({ hasText: 'Products' });
  await products.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'AI Chat', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('link', { name: 'AI Chat', exact: true })).not.toBeVisible();
  await expect(products).toBeFocused();
  expect(errors).toEqual([]);
  await page.screenshot({ path: '.work/validation/header-desktop.png' });
});

test('mobile menu handles keyboard, outside click and focus return', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 900 });
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.focus(); await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Sign In', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.mouse.click(2, 500);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.screenshot({ path: '.work/validation/header-mobile.png' });
});

test('announcement dismissal moves focus to the home link', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Dismiss announcement' }).click();
  await expect(page.getByRole('complementary', { name: 'Alveta announcement' })).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'Alveta home' })).toBeFocused();
});

import { test, expect, simulationOrigin } from './fixtures/browser';

for (const width of [320, 430, 1024, 1440]) {
  test(`all models remain in the dropdown at ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    if (width <= 900) await page.locator('[data-menu-toggle]').click();
    await page.locator('[data-model-menu] summary').click();
    const menu = page.locator('.model-panel');
    const cards = menu.locator('.catalog-card');
    await expect(cards).toHaveCount(55);
    const bounds = await menu.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
    await cards.last().scrollIntoViewIfNeeded();
    await expect(cards.last()).toBeInViewport();
    await menu.getByRole('button', { name: 'Anthropic', exact: true }).click();
    await expect(cards).toHaveCount(8);
    await menu.getByRole('searchbox').fill('Opus');
    await expect(cards).toHaveCount(2);
    await menu.getByRole('searchbox').fill('no-such-model');
    await expect(cards).toHaveCount(0);
    await expect(menu.locator('[data-catalog-status]')).toContainText('No models match');
    await menu.getByRole('searchbox').clear();
    await menu.getByRole('button', { name: 'All models', exact: true }).click();
    await expect(cards).toHaveCount(55);
    await expect(page).toHaveURL('http://127.0.0.1:4371/');
    await expect(menu.locator('a[href="/models"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await cards.locator('img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
    await page.screenshot({ path: `.work/validation/all-models-dropdown-${width}.png` });
    expect(await (await request.get(`${simulationOrigin}/__calls`)).text()).toContain('/api/v1/models/public');
  });
}

test('model dropdown recovers from a catalog outage', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let fail = true;
  await page.route('**/api/v1/models/public', async route => {
    if (fail) await route.fulfill({ status: 503, body: 'Unavailable' });
    else await route.continue();
  });
  await page.goto('/');
  await page.locator('[data-model-menu] summary').click();
  const menu = page.locator('.model-panel');
  await expect(menu.locator('[data-catalog-status]')).toContainText('could not be loaded');
  fail = false;
  await menu.getByRole('button', { name: 'Try again' }).click();
  await expect(menu.locator('.catalog-card')).toHaveCount(55);
});

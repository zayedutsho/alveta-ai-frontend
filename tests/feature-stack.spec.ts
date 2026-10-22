import { test, expect } from './fixtures/browser';

test('desktop feature cards pin, collapse progressively and restore keyboard access', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator('[data-features]');
  const cards = page.locator('[data-feature-panel]');
  await expect(section).toHaveAttribute('data-stack-active');
  const layout = await cards.evaluateAll(items => items.map(item => ({ top: item.getBoundingClientRect().top + scrollY, height: (item as HTMLElement).offsetHeight })));
  const modelsTop = await page.locator('[data-latest-models]').evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), layout[1]!.top - 36);
  await expect.poll(() => cards.first().evaluate(el => Number(getComputedStyle(el).scale))).toBeCloseTo(.98, 2);
  expect(await cards.first().evaluate(el => el.getBoundingClientRect().top)).toBe(24);
  expect(await cards.nth(1).evaluate(el => el.getBoundingClientRect().top)).toBe(36);
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), layout[2]!.top - 48);
  await expect.poll(() => cards.first().evaluate(el => Number(getComputedStyle(el).scale))).toBeCloseTo(.96, 2);
  expect(await cards.nth(2).evaluate(el => el.getBoundingClientRect().top)).toBe(48);
  await page.screenshot({ path: '.work/validation/feature-stack-1440.png' });
  const link = cards.first().getByRole('link', { name: 'Explore Alveta' });
  await link.focus();
  await expect(link).toBeFocused();
  await expect.poll(() => cards.first().evaluate(el => Number(getComputedStyle(el).scale))).toBe(1);
  expect(await link.evaluate(el => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
  })).toBe(true);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => cards.first().evaluate(el => Number(getComputedStyle(el).scale))).toBe(1);
  expect(await cards.first().evaluate(el => el.getBoundingClientRect().top)).toBe(layout[0]!.top);
  expect(await cards.first().evaluate(el => (el as HTMLElement).offsetHeight)).toBe(layout[0]!.height);
  expect(await page.locator('[data-latest-models]').evaluate(el => el.getBoundingClientRect().top + scrollY)).toBe(modelsTop);
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), modelsTop);
  expect(await cards.last().evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(errors).toEqual([]);
});

test('pointer interaction with a partly collapsed CTA does not move the card', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto('/');
  await expect(page.locator('[data-features]')).toHaveAttribute('data-stack-active');
  const card = page.locator('[data-feature-panel]').first();
  const start = await card.evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), start - 24 + 60);
  await expect.poll(() => card.evaluate(el => Number(getComputedStyle(el).scale))).toBeLessThan(1);
  const link = card.getByRole('link', { name: 'Explore Alveta' });
  await link.evaluate(el => el.addEventListener('click', event => { event.preventDefault(); el.setAttribute('data-test-clicked', ''); }));
  const before = await page.evaluate(() => scrollY);
  await link.click();
  await expect(link).toHaveAttribute('data-test-clicked');
  expect(await page.evaluate(() => scrollY)).toBe(before);
});

for (const viewport of [{ width: 320, height: 950 }, { width: 430, height: 950 }, { width: 768, height: 950 }, { width: 1440, height: 600 }]) {
  test(`stack falls back to readable flow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('[data-features]')).not.toHaveAttribute('data-stack-active');
    const card = page.locator('[data-feature-panel]').first();
    await card.scrollIntoViewIfNeeded();
    expect(await card.evaluate(el => getComputedStyle(el).position)).toBe('relative');
    expect(await card.evaluate(el => getComputedStyle(el).scale)).toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    if (viewport.width === 430) await card.screenshot({ path: '.work/validation/feature-stack-fallback-430.png', animations: 'disabled' });
  });
}

test('resize and reduced-motion changes remove stacking without losing content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto('/');
  const section = page.locator('[data-features]');
  await expect(section).toHaveAttribute('data-stack-active');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(section).not.toHaveAttribute('data-stack-active');
  for (const card of await page.locator('[data-feature-panel]').all()) {
    expect(await card.evaluate(el => getComputedStyle(el).position)).toBe('relative');
    expect(await card.evaluate(el => getComputedStyle(el).scale)).toBe('none');
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(section).toHaveAttribute('data-stack-active');
  await page.setViewportSize({ width: 1440, height: 600 });
  await expect(section).not.toHaveAttribute('data-stack-active');
  await expect(page.locator('[data-feature-panel]')).toHaveCount(5);
});

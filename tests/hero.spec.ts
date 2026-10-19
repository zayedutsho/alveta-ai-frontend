import { test, expect } from '@playwright/test';

for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
  test(`hero renders without overflow or missing assets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    const failedAssets: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failedAssets.push(response.url()); });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('All the Best AI Models,One Place');
    const geometry = await page.evaluate(() => ({
      width: window.innerWidth,
      scroll: document.documentElement.scrollWidth,
      broken: [...document.images].filter(img => img.loading !== 'lazy' && (!img.complete || img.naturalWidth === 0)).map(img => img.src),
      heroFont: getComputedStyle(document.querySelector('h1')!).fontFamily,
      controls: [...document.querySelectorAll<HTMLElement>('.composer a, .composer button, .composer textarea, .compare')]
        .filter(el => el.getClientRects().length > 0)
        .map(el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right }; }),
    }));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    expect(geometry.heroFont).toContain('Faculty Glyphic');
    for (const control of geometry.controls) { expect(control.left).toBeGreaterThanOrEqual(0); expect(control.right).toBeLessThanOrEqual(width); }
    expect(errors).toEqual([]); expect(failedAssets).toEqual([]);
    if ([320, 430, 768, 1024, 1440].includes(width)) await page.screenshot({ path: `.work/validation/hero-${width}.png`, fullPage: true });
  });
}

test('composer routes signup without transmitting or saving prompt text', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your prompt', { exact: true }).fill('A private example prompt');
  const compare = page.getByRole('checkbox', { name: 'Compare AI model responses' });
  await compare.check(); await expect(compare).toBeChecked();
  await expect(page.locator('[data-composer]')).toHaveAttribute('action', 'https://app.alveta.ai/register');
  const submission = await page.locator('[data-composer]').evaluate(form => [...new FormData(form as HTMLFormElement).entries()]);
  expect(submission).toEqual([]);
  const stored = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }));
  expect(stored).toEqual({ local: 0, session: 0 });
});

test('reduced motion is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

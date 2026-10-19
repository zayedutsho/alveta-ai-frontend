import { test, expect } from './fixtures/browser';

const titles = ['Multi-Agent AI Platform Workspace', 'Flexible Balance & Top-Ups', 'Side-by-Side Model Comparison', 'Private Chat & Vanish Mode', 'Analyze Files. Uncover Insights.'];
for (const width of [320, 430, 768, 1024, 1440, 1920]) {
  test(`feature panels preserve order, assets and responsive layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [], failed: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator('[data-features]');
    const panels = section.locator('[data-feature-panel]');
    await expect(panels).toHaveCount(5);
    await expect(panels.locator('h3')).toHaveText(titles);
    for (const panel of await panels.all()) {
      await panel.scrollIntoViewIfNeeded();
      await panel.locator('img').evaluateAll(images => Promise.all(images.map(img => (img as HTMLImageElement).decode())));
      await expect(panel.getByRole('link', { name: 'Explore Alveta' })).toHaveAttribute('href', 'https://app.alveta.ai/register');
      const layout = await panel.evaluate(el => {
        const copy = el.querySelector('.panel-copy')!.getBoundingClientRect();
        const image = el.querySelector('figure')!.getBoundingClientRect();
        return { copyBottom: copy.bottom, copyRight: copy.right, imageTop: image.top, imageLeft: image.left, imageW: image.width, imageH: image.height, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      expect(layout.overflow).toBe(false);
      expect(layout.imageW / layout.imageH).toBeCloseTo(520 / 472, 2);
      if (width < 1024) expect(layout.imageTop).toBeGreaterThan(layout.copyBottom);
      else expect(layout.imageLeft).toBeGreaterThan(layout.copyRight);
    }
    if (width === 1440) {
      const geometry = await section.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, firstTop: el.querySelector('article')!.getBoundingClientRect().top + scrollY, width: el.getBoundingClientRect().width }));
      expect(geometry.top).toBe(1225); expect(geometry.firstTop).toBe(1445); expect(geometry.width).toBe(1200);
      await panels.nth(0).screenshot({ path: '.work/validation/m4-first-panel-1440.png', animations: 'disabled' });
      await panels.nth(2).locator('figure').screenshot({ path: '.work/validation/m4-comparison-1440.png', animations: 'disabled' });
    }
    expect(errors).toEqual([]); expect(failed).toEqual([]);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `.work/validation/m4-page-${width}.png`, fullPage: true, animations: 'disabled' });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await section.screenshot({ path: `.work/validation/m4-features-${width}.png`, animations: 'disabled' });
  });
}

test('feature navigation is local and illustration honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await expect(page).toHaveURL(/#features$/);
  await expect(page.locator('[data-features]').getByRole('heading', { level: 2 })).toBeVisible();
  const motions = await page.locator('[data-motion-node]').evaluateAll(nodes => nodes.map(n => getComputedStyle(n).animationName));
  expect(motions.length).toBe(6); expect(motions.every(name => name === 'none')).toBe(true);
});

import { test, expect } from './fixtures/browser';
import assets from '../src/content/figma-assets.json' with { type: 'json' };

for (const width of [320, 430, 768, 1024, 1440, 1920]) {
  test(`model cards and subscription comparison render correctly at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [], failed: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const models = page.locator('[data-latest-models]');
    const comparison = page.locator('[data-subscription-comparison]');
    await expect(models.locator('h3')).toHaveText(['GPT 5.6', 'Gemini 3', 'Claude Opus 5', 'Grok 4.3']);
    await expect(comparison.locator('h3')).toHaveText(['ChatGPT', 'Grok', 'DeepSeek', 'Claude', 'Gemini', 'Kimi']);
    await expect(models.locator('#models-preview')).toBeVisible();
    await expect(comparison.locator('#subscription-preview')).toBeVisible();
    for (const section of [models, comparison]) {
      await section.scrollIntoViewIfNeeded();
      await section.locator('img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
      await expect(section).toHaveAttribute('data-content-status', 'design-example');
      const layout = await section.evaluate(el => {
        const bounds = el.getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          broken: [...el.querySelectorAll('img')].some(image => !image.complete || !image.naturalWidth),
          textOutside: [...el.querySelectorAll('h3, .provider-price, .offer-price, .offer-savings')].filter(text => {
            const rect = text.getBoundingClientRect();
            const parent = text.closest('[data-model-card], [data-provider], [data-comparison-offer]')!.getBoundingClientRect();
            return rect.left < parent.left - 1 || rect.right > parent.right + 1 || rect.top < parent.top - 1 || rect.bottom > parent.bottom + 1;
          }).map(text => text.textContent),
          top: bounds.top + scrollY,
          height: bounds.height,
        };
      });
      expect(layout.broken).toBe(false);
      expect(layout.overflow).toBe(false);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await section.screenshot({ path: `.work/validation/m5-${section === models ? 'models' : 'subscription'}-${width}.png`, animations: 'disabled', style: '.skip-link:not(:focus-visible) { visibility: hidden !important; }' });
      expect(layout.textOutside).toEqual([]);
      if (width === 1440 && section === models) { expect(layout.top).toBe(4331); expect(layout.height).toBe(532); }
      if (width === 1440 && section === comparison) expect(layout.top).toBe(4963);
    }
    const columns = await models.locator('.model-cards').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width < 600 ? 1 : width < 1280 ? 2 : 4);
    for (const link of await models.locator('.model-link').all()) await expect(link).toHaveAttribute('href', 'https://app.alveta.ai/register');
    if (width >= 1024) {
      await expect(comparison.locator('.connector')).toHaveCount(13);
      const geometry = await comparison.locator('.comparison-canvas').evaluate(el => {
        const rect = el.getBoundingClientRect();
        const offer = el.querySelector('[data-comparison-offer]')!.getBoundingClientRect();
        return { ratio: rect.width / rect.height, x: (offer.left - rect.left) / rect.width, y: (offer.top - rect.top) / rect.height };
      });
      expect(geometry.ratio).toBeCloseTo(1200 / 496, 3);
      expect(geometry.x).toBeCloseTo(479 / 1200, 3);
      expect(geometry.y).toBeCloseTo(193 / 496, 3);
    } else {
      await expect(comparison.locator('.connectors')).toBeHidden();
      const offer = await comparison.locator('[data-comparison-offer]').boundingBox();
      const firstProvider = await comparison.locator('[data-provider]').first().boundingBox();
      expect(firstProvider!.y).toBeGreaterThan(offer!.y + offer!.height);
    }
    // Every image must preserve its original aspect ratio after wrapper scaling.
    const ratios = await page.locator('[data-latest-models] img, [data-subscription-comparison] img').evaluateAll(images => images.filter(image => image.getBoundingClientRect().width).map(image => {
      const rect = image.getBoundingClientRect();
      return { path: new URL((image as HTMLImageElement).src).pathname, ratio: rect.width / rect.height };
    }));
    for (const image of ratios) {
      const source = Object.values(assets).find(asset => asset.src === image.path);
      expect(source).toBeDefined();
      expect(image.ratio).toBeCloseTo(source!.width / source!.height, 1);
    }
    expect(errors).toEqual([]); expect(failed).toEqual([]);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    if ([430, 1440].includes(width)) await page.screenshot({ path: `.work/validation/m5-page-${width}.png`, fullPage: true, animations: 'disabled', style: '.skip-link:not(:focus-visible) { visibility: hidden !important; }' });
  });
}

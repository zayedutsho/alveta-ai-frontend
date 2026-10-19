import { test, expect } from './fixtures/browser';

for (const width of [320, 430, 768, 1024, 1440, 1920]) {
  test(`remaining landing sections render at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const faq = page.locator('[data-faq]');
    await expect(faq.locator('details')).toHaveCount(8);
    await expect(faq.locator('details[open]')).toHaveCount(1);
    const first = faq.locator('summary').first();
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(faq.locator('details').first()).toHaveAttribute('open', '');
    await page.keyboard.press('Enter');
    await expect(faq.locator('details').first()).not.toHaveAttribute('open');
    await first.blur();
    await expect(page.locator('[data-articles] article')).toHaveCount(3);
    await expect(page.locator('[data-articles] a')).toHaveCount(0);
    await expect(page.locator('[data-footer] input')).toBeDisabled();
    await expect(page.locator('[data-footer] button')).toBeDisabled();
    await expect(page.locator('#newsletter-notice')).toContainText('coming soon');
    for (const selector of ['[data-faq]', '[data-articles]', '[data-closing-cta]', '[data-footer]']) {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      await section.locator('img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
      const layout = await section.evaluate(el => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...el.querySelectorAll('img')].some(image => !image.complete || !image.naturalWidth),
        textOverflow: [...el.querySelectorAll('h2,h3,summary,.copy p,nav a')].filter(text => text.scrollWidth > text.clientWidth + 1).map(text => text.textContent),
      }));
      expect(layout).toEqual({ overflow: false, broken: false, textOverflow: [] });
      if ([430, 1440].includes(width)) await section.screenshot({ path: `.work/validation/m8-${selector.slice(6, -1)}-${width}.png`, animations: 'disabled', style: '.skip-link:not(:focus-visible) { visibility: hidden !important; }' });
    }
    for (const link of await page.locator('[data-footer] a[href^="#"]').all()) {
      const href = (await link.getAttribute('href'))!;
      await expect(page.locator(href)).toHaveCount(1);
    }
    await expect(page.locator('[data-closing-cta] a').first()).toHaveAttribute('href', '#pricing');
    await expect(page.locator('[data-closing-cta] a').last()).toHaveAttribute('href', 'https://app.alveta.ai/register');
    for (const path of ['privacy', 'terms', 'refund-policy']) await expect(page.locator(`[data-footer] a[href="https://app.alveta.ai/${path}"]`)).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test('all testimonial cards reveal supplied or labelled demo copy', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('[data-testimonial]');
  for (const card of await cards.all()) {
    const details = card.locator('details');
    await expect(details.locator('blockquote')).toBeHidden();
    await details.hover();
    await expect(details.locator('blockquote')).toBeVisible();
    if (await card.getAttribute('data-testimonial') !== 'atiqur') await expect(details.locator('.demo-label')).toContainText('Not an actual endorsement');
    await page.mouse.move(0, 0);
    await expect(details.locator('blockquote')).toBeHidden();
  }
});

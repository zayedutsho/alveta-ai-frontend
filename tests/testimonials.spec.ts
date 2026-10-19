import { test, expect } from './fixtures/browser';

for (const width of [320, 430, 768, 1024, 1440, 1920]) {
  test(`testimonials preserve content and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator('[data-testimonials]');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute('data-content-status', 'design-example');
    await expect(section.locator('h3')).toHaveText(['Hasin Hayder', 'Sumit Saha', 'Atiqur Rahaman', 'Sumon Molla Selim']);
    await section.locator('summary').hover();
    await expect(section.locator('blockquote')).toContainText('Alveta brings multiple AI tools into one place');
    await expect(section.locator('#testimonials-preview')).toBeVisible();
    await expect(section.locator('a, button')).toHaveCount(0);
    await section.locator('img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
    const geometry = await section.evaluate(el => {
      const cards = [...el.querySelectorAll('[data-testimonial]')];
      return {
        columns: getComputedStyle(el.querySelector('.cards')!).gridTemplateColumns.split(' ').length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        ratios: cards.map(card => { const r = card.getBoundingClientRect(); return r.width / r.height; }),
        outside: [...el.querySelectorAll('h3, .identity p, blockquote, figcaption')].filter(text => {
          const r = text.getBoundingClientRect(), p = text.closest('[data-testimonial]')!.getBoundingClientRect();
          return r.left < p.left || r.right > p.right + 1 || r.bottom > p.bottom + 1 || r.top < p.top;
        }).map(text => text.textContent),
        cardWidth: cards[0]!.getBoundingClientRect().width,
      };
    });
    expect(geometry.columns).toBe(width < 600 ? 1 : width < 1280 ? 2 : 4);
    expect(geometry.overflow).toBe(false);
    expect(geometry.outside).toEqual([]);
    for (const ratio of geometry.ratios) expect(ratio).toBeCloseTo(282 / 400, 3);
    if (width >= 1440) expect(geometry.cardWidth).toBe(282);
    if ([430, 1440].includes(width)) await section.screenshot({ path: `.work/validation/m7-testimonials-${width}.png`, animations: 'disabled', style: '.skip-link:not(:focus-visible) { visibility: hidden !important; }' });
    expect(errors).toEqual([]);
  });
}

test('testimonial details reveal on hover, keyboard focus and native toggle', async ({ page }) => {
  await page.goto('/');
  const details = page.locator('[data-testimonial-reveal]');
  const quote = details.locator('blockquote');
  await expect(quote).toBeHidden();
  await details.hover();
  await expect(quote).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(quote).toBeHidden();
  await page.keyboard.press('Tab');
  await details.locator('summary').focus();
  await expect(quote).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(quote).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(quote).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(quote).toBeHidden();
});

test('testimonial opens and closes by touch', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 430, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4371');
  const summary = page.locator('[data-testimonial-reveal] summary');
  await summary.tap();
  await expect(page.locator('[data-testimonial-reveal] blockquote')).toBeVisible();
  await summary.tap();
  await expect(page.locator('[data-testimonial-reveal] blockquote')).toBeHidden();
  await context.close();
});

import { test, expect } from './fixtures/browser';

for (const width of [320, 430, 768, 1024, 1440, 1920]) {
  test(`motion preserves layout and reveals once at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.locator('h1').evaluate(el => getComputedStyle(el).translate)).toBe('0px');
    const panel = page.locator('[data-latest-models] .model-cards');
    await panel.evaluate(el => {
      el.setAttribute('data-test-runs', '0');
      el.addEventListener('animationstart', event => {
        if (event.target === el) el.setAttribute('data-test-runs', String(Number(el.getAttribute('data-test-runs')) + 1));
      });
    });
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toHaveAttribute('data-motion-entered');
    await expect(panel).not.toHaveAttribute('data-motion-entering');
    await expect(panel).toHaveAttribute('data-test-runs', '1');
    const top = await panel.evaluate(el => el.getBoundingClientRect().top + scrollY);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await panel.scrollIntoViewIfNeeded();
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await expect(panel).toHaveAttribute('data-test-runs', '1');
    expect(await panel.evaluate(el => el.getBoundingClientRect().top + scrollY)).toBe(top);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    if ([430, 1440].includes(width)) await panel.screenshot({ path: `.work/validation/motion-cards-${width}.png`, animations: 'disabled' });
    expect(errors).toEqual([]);
  });
}

test('existing loops suspend offscreen and respond to visibility and reduced motion', async ({ page }) => {
  await page.goto('/');
  const logos = page.locator('[data-customer-logos]');
  const illustration = page.locator('.feature-illustration.comparison');
  await expect(illustration).toHaveAttribute('data-motion-suspended');
  await logos.scrollIntoViewIfNeeded();
  await expect(logos).not.toHaveAttribute('data-motion-suspended');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(logos).toHaveAttribute('data-motion-suspended');
  expect(await logos.locator('.logo-track').first().evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(logos).not.toHaveAttribute('data-motion-suspended');
  await illustration.scrollIntoViewIfNeeded();
  await expect(illustration).not.toHaveAttribute('data-motion-suspended');
  await expect(logos).toHaveAttribute('data-motion-suspended');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(illustration).toHaveAttribute('data-motion-suspended');
  expect(await illustration.locator('[data-motion-node]').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('[data-motion-entering]')).toHaveCount(0);
});

test('reduced motion leaves content static and immediately readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const state = await page.locator('h1, .hero-copy p, .hero-workspace, [data-motion-reveal]').evaluateAll(elements => elements.map(el => {
    const style = getComputedStyle(el);
    return { opacity: style.opacity, animation: style.animationName, translate: style.translate };
  }));
  expect(state.length).toBeGreaterThan(10);
  for (const item of state) expect(item).toEqual({ opacity: '1', animation: 'none', translate: 'none' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('hover feedback is small and settles without changing card layout', async ({ page }) => {
  await page.goto('/');
  const model = page.locator('.model-card').first();
  const before = await model.boundingBox();
  await model.locator('a').hover();
  await expect.poll(() => model.evaluate(el => getComputedStyle(el).translate)).toBe('0px -3px');
  const after = await model.boundingBox();
  expect(after!.width).toBe(before!.width);
  expect(after!.height).toBe(before!.height);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => model.evaluate(el => getComputedStyle(el).translate)).toBe('none');
});

test('mobile navigation animates while closed content stays out of keyboard navigation', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 900 });
  await page.goto('/');
  const nav = page.locator('#primary-navigation');
  const toggle = page.locator('[data-menu-toggle]');
  expect(await nav.evaluate(el => (el as HTMLElement).inert)).toBe(true);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(() => nav.evaluate(el => (el as HTMLElement).inert)).toBe(false);
  await expect.poll(() => nav.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  expect(await nav.evaluate(el => (el as HTMLElement).inert)).toBe(true);
  await expect(nav).toBeHidden();
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await nav.evaluate(el => (el as HTMLElement).inert)).toBe(false);
  await expect(nav).toBeVisible();
});

test('missing observer support does not hide page content', async ({ page }) => {
  await page.addInitScript(() => { delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver; });
  await page.goto('/');
  await expect(page.locator('[data-motion-entering]')).toHaveCount(0);
  for (const selector of ['[data-feature-panel]', '[data-testimonials]', '[data-faq]', '[data-footer]']) {
    await expect(page.locator(selector).first()).toBeVisible();
    expect(await page.locator(selector).first().evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 430, height: 900 } });
  test('content, native disclosures and mobile navigation remain available', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#primary-navigation')).toBeVisible();
    await expect(page.locator('[data-menu-toggle]')).toBeHidden();
    await expect(page.locator('[data-faq] details').first()).toBeVisible();
    await page.locator('[data-faq] summary').first().click();
    await expect(page.locator('[data-faq] details').first()).toHaveAttribute('open');
    await expect(page.locator('[data-footer]')).toBeVisible();
    await expect(page.locator('[data-motion-entering]')).toHaveCount(0);
  });
});

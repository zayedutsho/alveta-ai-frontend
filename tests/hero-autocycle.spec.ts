import { test, expect } from './fixtures/browser';

test('hero automatically cycles in icon order and loops back to chat', async ({ page }) => {
  await page.goto('/');
  await page.mouse.move(0, 0);
  const composer = page.locator('[data-composer]');
  await expect(composer).toHaveAttribute('data-mode', 'chat');
  const height = (await composer.boundingBox())!.height;
  for (const id of ['image', 'code', 'voice', 'video', 'chat']) {
    await expect(composer).toHaveAttribute('data-mode', id, { timeout: 4500 });
    await expect(page.locator(`[data-hero-mode="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-hero-mode][aria-pressed="true"]')).toHaveCount(1);
    expect((await composer.boundingBox())!.height).toBeCloseTo(height, 1);
  }
});

test('manual selection cancels a pending fade and resets the 3.5-second timer', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const composer = page.locator('[data-composer]');
  await expect(composer).toHaveAttribute('data-mode', 'chat');
  await page.clock.runFor(3350);
  await page.getByRole('button', { name: 'AI coding', exact: true }).click();
  await page.mouse.move(0, 0);
  await expect(composer).toHaveAttribute('data-mode', 'code');
  await page.clock.runFor(3300);
  await expect(composer).toHaveAttribute('data-mode', 'code');
  await page.clock.runFor(250);
  await expect(composer).toHaveAttribute('data-mode', 'voice');
});

test('hover and focused input pause the showcase until interaction ends', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const composer = page.locator('[data-composer]');
  await composer.hover();
  await page.clock.runFor(14000);
  await expect(composer).toHaveAttribute('data-mode', 'chat');
  await page.mouse.move(0, 0);
  await page.clock.runFor(3600);
  await expect(composer).toHaveAttribute('data-mode', 'image');
  const prompt = page.getByLabel('Your prompt', { exact: true });
  await prompt.focus();
  await prompt.fill('Keep my draft while I work');
  await page.clock.runFor(14000);
  await expect(composer).toHaveAttribute('data-mode', 'image');
  await expect(prompt).toHaveValue('Keep my draft while I work');
  await prompt.blur();
  await page.clock.runFor(3600);
  await expect(composer).toHaveAttribute('data-mode', 'code');
});

test('offscreen and hidden-tab states suspend cycling and teardown clears it', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const composer = page.locator('[data-composer]');
  await page.locator('[data-footer]').scrollIntoViewIfNeeded();
  await page.clock.runFor(14000);
  await expect(composer).toHaveAttribute('data-mode', 'chat');
  await composer.scrollIntoViewIfNeeded();
  await page.clock.runFor(3600);
  await expect(composer).toHaveAttribute('data-mode', 'image');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(14000);
  await expect(composer).toHaveAttribute('data-mode', 'image');
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(3600);
  await expect(composer).toHaveAttribute('data-mode', 'code');
  await page.evaluate(() => document.dispatchEvent(new Event('astro:before-swap')));
  await page.clock.runFor(14000);
  await expect(composer).toHaveAttribute('data-mode', 'code');
});

test('reduced motion disables automatic cycling while preserving manual exploration', async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const composer = page.locator('[data-composer]');
  await page.clock.runFor(14000);
  await expect(composer).toHaveAttribute('data-mode', 'chat');
  await page.getByRole('button', { name: 'AI images', exact: true }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(14000);
  await expect(composer).toHaveAttribute('data-mode', 'image');
  expect(await page.locator('.prompt-panel').evaluate(node => node.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(3600);
  await expect(composer).toHaveAttribute('data-mode', 'code');
});

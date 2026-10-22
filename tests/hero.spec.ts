import { test, expect } from './fixtures/browser';

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
    if (width === 430 || width === 1440) {
      await page.locator('.composer').screenshot({ path: `.work/validation/hero-beam-${width === 430 ? 'mobile' : 'desktop'}.png` });
    }
    if ([320, 430, 768, 1024, 1440].includes(width)) await page.screenshot({ path: `.work/validation/hero-${width}.png`, fullPage: true });
  });
}

test('composer beam follows the responsive rounded border and animates smoothly', async ({ page }) => {
  await page.goto('/');
  const composer = page.locator('.composer');
  for (const width of [320, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    const geometry = await composer.evaluate(el => {
      const bounds = el.getBoundingClientRect();
      const beam = el.querySelector<SVGSVGElement>('.composer-beam')!;
      const beamBounds = beam.getBoundingClientRect();
      const rect = beam.querySelector('rect')!;
      return {
        composer: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
        beam: { x: beamBounds.x, y: beamBounds.y, width: beamBounds.width, height: beamBounds.height },
        radius: getComputedStyle(rect).rx,
      };
    });
    expect(geometry.beam.x).toBeCloseTo(geometry.composer.x - 0.5, 1);
    expect(geometry.beam.y).toBeCloseTo(geometry.composer.y - 0.5, 1);
    expect(geometry.beam.width).toBeCloseTo(geometry.composer.width + 1, 1);
    expect(geometry.beam.height).toBeCloseTo(geometry.composer.height + 1, 1);
    expect(geometry.radius).toBe(width < 768 ? '15.25px' : '23.25px');
  }
  await expect(composer.locator('.composer-beam rect')).toHaveCount(4);
  const beam = composer.locator('.composer-beam rect').last();
  await expect.poll(() => beam.evaluate(el => getComputedStyle(el).animationName)).toBe('composer-border-beam');
  await expect.poll(() => beam.evaluate(el => getComputedStyle(el).animationDuration)).toBe('28s');
  await expect.poll(() => beam.evaluate(el => getComputedStyle(el).animationTimingFunction)).toBe('linear');
  await expect.poll(() => beam.getAttribute('stroke-dasharray')).toBe('20 980');
  const offsets: string[] = [];
  for (let sample = 0; sample < 4; sample += 1) {
    offsets.push(await beam.evaluate(el => getComputedStyle(el).strokeDashoffset));
    await page.waitForTimeout(300);
  }
  expect(new Set(offsets).size).toBeGreaterThan(1);
  expect(offsets[0]).not.toBe(offsets[offsets.length - 1]);
});

for (const width of [320, 430, 768, 1440]) {
  test(`typing removes the inner border and makes multiline prompts readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    const prompt = page.getByLabel('Your prompt', { exact: true });
    const beam = page.locator('.composer-beam');
    const composer = page.locator('.composer');
    const before = await prompt.evaluate(el => el.getBoundingClientRect().height);
    await expect(beam).toBeVisible();
    await prompt.fill('Help me plan a project.\nExplain the steps.\nInclude a timeline.');
    await expect(beam).toBeVisible();
    expect(await composer.evaluate(el => getComputedStyle(el).backgroundImage)).not.toBe('none');
    expect(await page.locator('.prompt-panel').evaluate(el => getComputedStyle(el).borderTopColor)).toBe('rgba(0, 0, 0, 0)');
    expect(await prompt.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('none');
    expect(await page.locator('.prompt-row').evaluate(el => getComputedStyle(el).boxShadow)).not.toBe('none');
    await expect(page.locator('#signup-note')).toBeVisible();
    await expect(page.locator('#signup-note')).toContainText('will not be sent or saved');
    expect(await prompt.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await prompt.fill(Array.from({ length: 20 }, () => 'A longer draft line').join('\n'));
    expect(await prompt.evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(120);
    expect(await prompt.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
    if ([430, 1440].includes(width)) await composer.screenshot({ path: `.work/validation/hero-typing-${width}.png`, animations: 'disabled' });
    if (width === 1440) {
      // Growing the hero must also refresh the feature stack's cached scroll positions.
      const secondCard = page.locator('[data-feature-panel]').nth(1);
      const top = await secondCard.evaluate(el => el.getBoundingClientRect().top + scrollY);
      await page.evaluate(value => scrollTo({ top: value - 36, behavior: 'instant' }), top);
      await expect.poll(() => secondCard.evaluate(el => Number(getComputedStyle(el).scale))).toBe(1);
    }
    await prompt.fill('');
    await expect(beam).toBeVisible();
    await prompt.blur();
    expect(await page.locator('.prompt-panel').evaluate(el => getComputedStyle(el).borderTopColor)).not.toBe('rgba(0, 0, 0, 0)');
    await expect(page.locator('#signup-note')).toBeHidden();
    expect(await prompt.evaluate(el => el.getBoundingClientRect().height)).toBe(before);
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
  await expect(page.locator('.composer-beam')).toBeHidden();
  expect(await page.locator('.composer').evaluate(el => getComputedStyle(el).borderRadius)).toBe('24px');
});

test.describe('composer without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('typing still removes the inner border and explains signup', async ({ page }) => {
    await page.goto('/');
    const prompt = page.getByLabel('Your prompt', { exact: true });
    await prompt.fill('An example question');
    await expect(page.locator('.composer-beam')).toBeVisible();
    expect(await page.locator('.prompt-panel').evaluate(el => getComputedStyle(el).borderTopColor)).toBe('rgba(0, 0, 0, 0)');
    await expect(page.locator('#signup-note')).toBeVisible();
    await prompt.fill('');
    await expect(page.locator('.composer-beam')).toBeVisible();
  });
});

test('inner prompt retains keyboard focus visibility in high contrast', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');
  await page.getByLabel('Your prompt', { exact: true }).focus();
  expect(await page.locator('.prompt-row').evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  expect(await page.locator('.prompt-row').evaluate(el => getComputedStyle(el).outlineWidth)).toBe('2px');
});

test('clicking the empty prompt shows no border or focus line, while Tab restores keyboard indication', async ({ page }) => {
  await page.goto('/');
  const prompt = page.getByLabel('Your prompt', { exact: true });
  const row = page.locator('.prompt-row');
  await prompt.click();
  expect(await row.evaluate(el => getComputedStyle(el).boxShadow)).toBe('none');
  expect(await prompt.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('none');
  expect(await page.locator('.prompt-panel').evaluate(el => getComputedStyle(el).borderTopColor)).toBe('rgba(0, 0, 0, 0)');
  await prompt.pressSequentially('An example prompt');
  expect(await row.evaluate(el => getComputedStyle(el).boxShadow)).toBe('none');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(prompt).toBeFocused();
  expect(await row.evaluate(el => getComputedStyle(el).boxShadow)).not.toBe('none');
});

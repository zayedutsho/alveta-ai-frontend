import { test, expect, simulationOrigin } from './fixtures/browser';

for (const width of [320, 390, 430, 768, 1024, 1440, 1920]) {
  test(`live-contract pricing renders at ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('/');
    const section = page.locator('[data-pricing]');
    const cards = section.locator('[data-package]');
    try { await expect(cards).toHaveCount(4); } catch { throw new Error(JSON.stringify({ errors, origin: await section.getAttribute('data-api-origin') })); }
    await expect(cards.locator('h3')).toHaveText(['Basic', 'Play', 'Standard', 'Pro']);
    await expect(cards.locator('[data-price]')).toHaveText(['৳499', '৳199', '৳999', '৳1,999']);
    await expect(section.locator('[data-pricing-status]')).toBeHidden();
    await expect(section.locator('[data-package="Play"] [data-popular-label]')).toHaveText('Most Popular');
    await expect(section.locator('[data-package="Play"] .pricing-cta')).toHaveAttribute('href', 'https://app.alveta.ai/register?package=Play');
    await section.scrollIntoViewIfNeeded();
    await section.locator('article img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
    const layout = await section.evaluate(el => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      columns: getComputedStyle(el.querySelector('[data-plan-grid]')!).gridTemplateColumns.split(' ').length,
      outside: [...el.querySelectorAll('article h3, article .plan-description, article .plan-price, article .token-value, article .plan-features')].some(text => {
        const r = text.getBoundingClientRect(), card = text.closest('article')!.getBoundingClientRect();
        return r.right > card.right + 1 || r.left < card.left - 1;
      }),
    }));
    expect(layout.overflow).toBe(false); expect(layout.outside).toBe(false);
    expect(layout.columns).toBe(width < 600 ? 1 : width < 1280 ? 2 : 4);
    if (width >= 600) {
      const bottoms = await cards.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().bottom));
      const columns = layout.columns;
      for (let row = 0; row < bottoms.length; row += columns) {
        expect(Math.max(...bottoms.slice(row, row + columns)) - Math.min(...bottoms.slice(row, row + columns))).toBeLessThan(1);
      }
    }
    await expect(cards.first().locator('[data-model-list] li')).toHaveCount(3);
    await expect(section.locator('.toggle-option').first()).toHaveCSS('border-top-left-radius', '99px');
    if ([320, 390, 768, 1024, 1440].includes(width)) {
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
      await section.screenshot({ path: `.work/validation/m6-pricing-${width}.png`, animations: 'disabled', style: '[data-header], .skip-link { visibility: hidden !important; }' });
    }
    const menuToggle = page.getByRole('button', { name: 'Open navigation' });
    if (await menuToggle.isVisible()) await menuToggle.click();
    await page.locator('[data-model-menu] summary').click();
    await expect(page.locator('[data-model-menu] [data-model-list] li').first()).toBeVisible();
    const calls = await (await request.get(`${simulationOrigin}/__calls`)).json();
    expect(calls.filter((call: { url: string }) => call.url === '/api/v1/packages')).toHaveLength(1);
    expect(calls.filter((call: { url: string }) => call.url === '/api/v1/models/public')).toHaveLength(1);
    expect(calls.every((call: { authorization: boolean; cookie: boolean }) => !call.authorization && !call.cookie)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('currency, model disclosure and team signup retain API values', async ({ page }) => {
  await page.goto('/');
  const pricing = page.locator('[data-pricing]');
  const play = pricing.locator('[data-package="Play"]');
  await expect(play).toBeVisible();
  await pricing.getByLabel('Pricing currency').selectOption('USD');
  await expect(play.locator('[data-price]')).toHaveText('$1');
  const basic = pricing.locator('[data-package="basic"]');
  await basic.locator('[data-more-models] summary').focus();
  await page.keyboard.press('Enter');
  await expect(basic.locator('[data-extra-models]')).toBeVisible();
  const modelRows = basic.locator('[data-model-list] li, [data-extra-models] li');
  await expect(modelRows.locator('[data-model-icon] img')).toHaveCount(await modelRows.count());
  const geminiRow = modelRows.filter({ hasText: 'Gemini' }).first();
  await expect(geminiRow.locator('[data-model-icon] img')).toHaveAttribute('src', '/images/figma/model-gemini.png');
  await expect(geminiRow.locator('[data-model-icon]')).toBeVisible();
  const icons = await modelRows.locator('[data-model-icon] img').evaluateAll(async images => {
    await Promise.all(images.map(image => (image as HTMLImageElement).decode()));
    return images.map(image => ({ loaded: (image as HTMLImageElement).naturalWidth > 0, width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height }));
  });
  expect(icons.every(icon => icon.loaded && icon.width >= 16 && icon.width <= 17 && icon.height >= 16 && icon.height <= 17)).toBe(true);
  await pricing.getByRole('radio', { name: 'Team/Organization' }).check();
  await expect(pricing.locator('[data-team-option]')).toHaveAttribute('data-checked', '');
  await expect(play.locator('.pricing-cta')).toHaveAttribute('href', 'https://app.alveta.ai/register?package=Play&team=1');
  const seats = play.getByRole('spinbutton');
  const minimum = Number(await seats.getAttribute('min'));
  await seats.fill('0'); await seats.press('Tab');
  await expect(seats).toHaveValue(String(minimum));
  await seats.fill(String(minimum + 1)); await seats.press('Tab');
  await expect(play.locator('[data-team-total]')).toContainText('/mo total');
  await pricing.getByLabel('Pricing currency').selectOption('BDT');
  await expect(play.getByRole('spinbutton')).toHaveValue(String(minimum + 1));
  await pricing.getByRole('radio', { name: 'Individual' }).check();
  await expect(play.locator('.pricing-cta')).toHaveAttribute('href', 'https://app.alveta.ai/register?package=Play');
  await expect(play.locator('[data-seat-control]')).toBeHidden();
});

for (const scenario of ['failure', 'malformed', 'empty', 'modelsFailure', 'noBdt', 'noTeam', 'delay', 'timeout']) {
  test(`pricing handles ${scenario}`, async ({ page, request }) => {
    await request.post(`${simulationOrigin}/__control`, { data: scenario === 'delay' ? { hold: true } : scenario === 'timeout' ? { delay: 11000 } : { [scenario]: true } });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const pricing = page.locator('[data-pricing]');
    if (scenario === 'delay') {
      await expect.poll(async () => (await (await request.get(`${simulationOrigin}/__calls`)).json()).some((call: { url: string }) => call.url === '/api/v1/packages')).toBe(true);
      await expect(pricing.locator('[data-pricing-status]')).toHaveText('Loading current plans…');
      await request.post(`${simulationOrigin}/__release`);
    }
    if (['failure', 'malformed', 'empty', 'timeout'].includes(scenario)) {
      await expect(pricing.locator('[data-pricing-retry]')).toBeVisible({ timeout: 15000 });
      await expect(pricing.locator('article')).toHaveCount(0);
      await request.post(`${simulationOrigin}/__control`, { data: {} });
      await pricing.getByRole('button', { name: 'Try again' }).click();
    }
    await expect(pricing.locator('article')).toHaveCount(4);
    if (scenario === 'modelsFailure') await expect(pricing.locator('[data-model-status]').first()).toHaveText('Model names are temporarily unavailable.');
    if (scenario === 'noBdt') {
      await expect(pricing.locator('[data-price]').first()).toHaveText('$5');
      await expect(pricing.locator('[data-currency-fallback]').first()).toBeVisible();
    }
    if (scenario === 'noTeam') await expect(pricing.getByRole('radio', { name: 'Team/Organization' })).toBeHidden();
  });
}

test('zero price, null tokens and API text render honestly and safely', async ({ page, request }) => {
  const catalog = await (await request.get(`${simulationOrigin}/api/v1/packages`)).json();
  const basic = catalog.packages.find((pkg: { slug: string }) => pkg.slug === 'basic');
  basic.price = { usd: 0, bdt: null };
  basic.token_value = null;
  basic.name = '<img src=x onerror=alert(1)>';
  await request.post(`${simulationOrigin}/__control`, { data: { catalog } });
  await page.goto('/');
  const card = page.locator('[data-package="basic"]');
  await expect(card.locator('h3')).toHaveText(basic.name);
  await expect(card.locator('h3 img')).toHaveCount(0);
  await expect(card.locator('[data-price]')).toHaveText('$0');
  await expect(card.locator('[data-tokens]')).toHaveText('Usage varies by model.');
});

import { test, expect, simulationOrigin } from './fixtures/browser';
import { readFileSync } from 'node:fs';
const assets = JSON.parse(readFileSync(new URL('../src/content/figma-assets.json', import.meta.url), 'utf8')) as {logo5: {width: number}};

const sanity = 'http://127.0.0.1:4372/sanity';
const site = 'http://127.0.0.1:4373/';

test.beforeEach(async ({ page, request }) => {
  await request.post(`${sanity}/__control`, { data: {} });
  await page.context().grantPermissions(['local-network-access'], { origin: site });
  await page.route(site, async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replaceAll('data-api-origin="https://api.alveta.ai"', `data-api-origin="${simulationOrigin}"`) });
  });
});

test('published Sanity content renders while prices and model access remain API controlled', async ({ page, request }) => {
  await page.goto(site);
  await expect(page.locator('#hero-title')).toHaveText('Marketing managed titleFrom Sanity');
  await expect(page.locator('#features .section-heading p')).toHaveText('Marketing can update this section.');
  await expect(page.locator('#pricing-heading')).toHaveText('Choose your plan');
  const cards = page.locator('[data-package]');
  await expect(cards.locator('h3')).toHaveText(['Basic', 'Play', 'Standard', 'Pro']);
  await expect(cards.locator('[data-price]')).toHaveText(['৳499', '৳199', '৳999', '৳1,999']);
  await expect(page.locator('[data-package="Play"]')).toHaveClass(/popular/);
  const calls = await (await request.get(`${sanity}/__calls`)).json();
  expect(calls.length).toBeGreaterThan(0);
  expect(calls.every((call: { perspective: string; query: string }) => call.perspective === 'published' && call.query.includes('drafts.**'))).toBe(true);
});

test('empty CMS uses editorial defaults and unsafe or malformed fields cannot break the page', async ({ page, request }) => {
  await request.post(`${sanity}/__control`, { data: { empty: true } });
  await page.goto(site);
  await expect(page.locator('#hero-title')).toHaveText('All the Best AI Models,One Place');
  await request.post(`${sanity}/__control`, { data: { document: {
    hero: { heading: 42, description: '<script>alert(1)</script>' },
    closingCta: { primary: { href: 'javascript:alert(1)', label: 'Safe button' } },
    features: { panels: 'invalid' },
  } } });
  await page.reload();
  await expect(page.locator('#hero-title')).toHaveText('All the Best AI Models,One Place');
  await expect(page.locator('.hero-copy p')).toHaveText('<script>alert(1)</script>');
  await expect(page.locator('[data-closing-cta] .actions a').first()).toHaveAttribute('href', '#pricing');
  await expect(page.locator('[data-feature-panel]')).toHaveCount(5);
});

test('CMS image uploads resolve through Sanity CDN and preserve existing slot geometry', async ({ page, request }) => {
  const asset = { _ref: 'image-0123456789abcdef0123456789abcdef01234567-174x42-svg' };
  await request.post(`${sanity}/__control`, { data: { document: {
    media: [{ source: '/images/figma/logo5.svg', image: { asset, alt: 'Marketing managed logo' } }],
  } } });
  await page.goto(site);
  const logo = page.locator('[data-header] .brand-desktop img');
  await expect(logo).toHaveAttribute('src', /^https:\/\/cdn\.sanity\.io\/images\/iwd3xpdu\/production\//);
  await expect(logo).toHaveAttribute('alt', 'Marketing managed logo');
  await expect(logo).toHaveAttribute('width', String(assets.logo5.width));
});

test('a CMS outage falls back without interrupting API pricing', async ({ page, request }) => {
  await request.post(`${sanity}/__control`, { data: { failure: true } });
  await page.goto(site, { timeout: 25000 });
  await expect(page.locator('#hero-title')).toHaveText('All the Best AI Models,One Place');
  await expect(page.locator('[data-package]')).toHaveCount(4);
  await expect(page.locator('[data-package="Play"] [data-price]')).toHaveText('৳199');
});

test('imported CMS content preserves the same mobile flow as local defaults', async ({ page, request }) => {
  await page.setViewportSize({ width: 430, height: 950 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const publishedTop = await page.locator('[data-customer-logos]').evaluate(node => node.getBoundingClientRect().top + scrollY);
  await request.post(`${sanity}/__control`, { data: { empty: true } });
  await page.goto(site);
  await page.evaluate(() => document.fonts.ready);
  const localTop = await page.locator('[data-customer-logos]').evaluate(node => node.getBoundingClientRect().top + scrollY);
  expect(publishedTop).toBeCloseTo(localTop, 1);
});

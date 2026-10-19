/// <reference types="node" />
import { readFileSync, readdirSync } from 'node:fs';
import { test, expect, simulationOrigin } from './fixtures/browser';
import { publicApiOrigin, resolvePublicApiBase } from '../src/lib/api-config';
import { normalizePackages, normalizePublicModels } from '../src/lib/public-catalog';
import { appLink } from '../src/lib/app-links';
import catalog from '../postman/mocks/alveta-public/catalog.json' with { type: 'json' };
import modelCatalog from '../postman/mocks/alveta-public/models.json' with { type: 'json' };

test('public origin policy accepts only documented services and local development', () => {
  expect(publicApiOrigin).toBe('https://api.alveta.ai');
  expect(resolvePublicApiBase(publicApiOrigin, 'marketing.alveta.ai').origin).toBe(publicApiOrigin);
  expect(resolvePublicApiBase(publicApiOrigin, 'staging.alveta.ai').origin).toBe('https://staging-api.alveta.ai');
  expect(resolvePublicApiBase('http://localhost:8000', 'localhost').origin).toBe('http://localhost:8000');
  expect(resolvePublicApiBase(simulationOrigin, '127.0.0.1').pathname).toBe('/alveta');
  for (const value of ['', 'http://api.alveta.ai', 'https://api.alveta.ai.example.test', 'https://user:pass@api.alveta.ai', 'https://api.alveta.ai/admin', 'https://api.alveta.ai/?target=other', 'https://api.alveta.ai/#fragment', 'http://localhost:9000', 'http://localhost:8000/private']) {
    expect(() => resolvePublicApiBase(value, 'localhost')).toThrow();
  }
  expect(() => resolvePublicApiBase(simulationOrigin, 'marketing.alveta.ai')).toThrow();
});

test('normalizers retain only necessary fields and do not share upstream object references', () => {
  const raw = {
    ...catalog, debug: 'TEST_ONLY', packages: catalog.packages.map(pkg => ({ ...pkg,
      private_metadata: 'TEST_ONLY', price: { ...pkg.price, internal_cost: 12 }, features: { ...pkg.features, admin_access: true },
    })),
  };
  const result = normalizePackages(raw);
  expect(result).not.toHaveProperty('debug');
  expect(result.packages[0]).not.toHaveProperty('private_metadata');
  expect(result.packages[0]?.features).not.toHaveProperty('admin_access');
  expect(result.packages[0]?.price).not.toHaveProperty('internal_cost');
  expect(result.packages[0]?.price).not.toBe(raw.packages[0]?.price);
  expect(result.packages[0]?.model_access).not.toBe(raw.packages[0]?.model_access);
  expect(normalizePublicModels({ models: modelCatalog.models.map(model => ({ ...model, internal_notes: 'TEST_ONLY' })) }))
    .toEqual(modelCatalog.models);
  expect(() => normalizePackages({ ...catalog, detected_currency: ['USD'] })).toThrow();
  expect(() => normalizePublicModels({ models: [modelCatalog.models[0], modelCatalog.models[0]] })).toThrow();
});

for (const [name, override] of Object.entries({
  'missing USD': { price: { bdt: 499 } }, 'missing BDT': { price: { usd: 5 } },
  'string price': { price: { usd: '5', bdt: 499 } }, 'negative price': { price: { usd: -1, bdt: 499 } },
  'nonfinite price': { price: { usd: Infinity, bdt: 499 } }, 'bad slug': { slug: 'Play?discount=free' },
  'bad team minimum': { min_team_seats: 0 }, 'missing team price': { per_seat_price: { usd: 1 } },
})) {
  test(`rejects ${name}`, () => {
    expect(() => normalizePackages({ ...catalog, packages: [{ ...catalog.packages[0], ...override }] })).toThrow();
  });
}

test('navigation cannot escape the configured app origin', () => {
  expect(appLink('/register?package=Play&team=1')).toBe('https://app.alveta.ai/register?package=Play&team=1');
  for (const value of ['//example.test', '/\\example.test', '/\n/example.test', 'https://example.test', 'javascript:alert(1)']) expect(() => appLink(value)).toThrow();
});

for (const origin of ['', 'https://unapproved.example.test', 'http://api.alveta.ai', 'http://127.0.0.1:4372/alveta/private']) {
  test.describe(`blocked API configuration ${origin || '(missing)'}`, () => {
    test.use({ apiOrigin: origin });
    test('shows a safe failure without sending catalog requests', async ({ page, request }) => {
      const external: string[] = [];
      page.on('request', req => { if (!req.url().startsWith('http://127.0.0.1:4371')) external.push(req.url()); });
      await page.goto('/');
      await expect(page.locator('[data-pricing-retry]')).toBeVisible();
      await expect(page.locator('[data-pricing] article')).toHaveCount(0);
      expect(await (await request.get(`${simulationOrigin}/__calls`)).json()).toEqual([]);
      expect(external).toEqual([]);
    });
  });
}

for (const status of [401, 403]) {
  test(`unexpected ${status} does not expose upstream errors or initiate authentication`, async ({ page, request }) => {
    await request.post(`${simulationOrigin}/__control`, { data: { authFailure: status } });
    await page.goto('/');
    await expect(page.locator('[data-pricing-retry]')).toBeVisible();
    await expect(page.locator('body')).not.toContainText('ALVETA_UPSTREAM_ERROR_TEST_CANARY');
    await expect(page.locator('[data-pricing] article')).toHaveCount(0);
    const calls = await (await request.get(`${simulationOrigin}/__calls`)).json();
    expect(calls.every((call: { url: string }) => ['/api/v1/packages', '/api/v1/models/public'].includes(call.url))).toBe(true);
  });
}

test('catalog redirects are rejected rather than followed', async ({ page, request }) => {
  await request.post(`${simulationOrigin}/__control`, { data: { redirect: true } });
  await page.goto('/');
  await expect(page.locator('[data-pricing-retry]')).toBeVisible();
  const calls = await (await request.get(`${simulationOrigin}/__calls`)).json();
  expect(calls.some((call: { url: string }) => call.url.includes('__unexpected'))).toBe(false);
});

test('catalog requests omit existing cookies and browser-stored token canaries', async ({ page, request }) => {
  await page.context().addCookies([{ name: 'session_test', value: 'NOT_A_REAL_SESSION', domain: '127.0.0.1', path: '/' }]);
  await page.addInitScript(() => localStorage.setItem('access_token', 'NOT_A_REAL_TOKEN'));
  await page.goto('/');
  await expect(page.locator('[data-pricing] article')).toHaveCount(4);
  const calls = await (await request.get(`${simulationOrigin}/__calls`)).json();
  expect(calls.length).toBeGreaterThan(0);
  expect(calls.every((call: { authorization: boolean; cookie: boolean }) => !call.authorization && !call.cookie)).toBe(true);
});

test('static output excludes private config identifiers and controlled secret canary', () => {
  const scripts = readdirSync('dist/marketing-assets').filter(file => /\.m?js$/.test(file));
  expect(scripts.length).toBeGreaterThan(0);
  const output = [readFileSync('dist/index.html', 'utf8'), ...scripts.map(file => readFileSync(`dist/marketing-assets/${file}`, 'utf8'))].join('\n');
  expect(output).not.toMatch(/SANITY_READ_TOKEN|ALVETA_SECURITY_TEST_CANARY|ALVETA_TEST_PRIVATE_CANARY_NOT_A_SECRET|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/);
});

import { test as base, expect } from '@playwright/test';

export const simulationOrigin = 'http://127.0.0.1:4372/alveta';
export const test = base.extend({
  page: async ({ page, request }, use) => {
    await page.context().grantPermissions(['local-network-access'], { origin: 'http://127.0.0.1:4371' });
    await request.post(`${simulationOrigin}/__control`, { data: {} });
    // Change configuration only: the real client still sends real HTTP to Postman.
    await page.route('http://127.0.0.1:4371/', async route => {
      const response = await route.fetch();
      const html = (await response.text()).replaceAll('data-api-origin="https://api.alveta.ai"', `data-api-origin="${simulationOrigin}"`);
      await route.fulfill({ response, body: html });
    });
    await use(page);
  },
});
export { expect };

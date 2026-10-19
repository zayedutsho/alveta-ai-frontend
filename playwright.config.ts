import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4371', browserName: 'chromium', headless: true },
  webServer: {
    command: 'node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port 4371',
    url: 'http://127.0.0.1:4371',
    reuseExistingServer: false,
    timeout: 30000,
  },
});

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4371', browserName: 'chromium', headless: true },
  webServer: [{
    command: 'node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port 4371',
    url: 'http://127.0.0.1:4371',
    reuseExistingServer: false,
    timeout: 30000,
  }, {
    command: 'postman simulation run postman/simulations/landing.sim.yaml --port 4372 --output ndjson',
    url: 'http://127.0.0.1:4372/alveta/__calls',
    reuseExistingServer: true,
    timeout: 30000,
  }],
});

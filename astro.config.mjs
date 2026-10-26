import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const apiHost = env.SANITY_API_HOST;
if (apiHost && !/^http:\/\/(127\.0\.0\.1|localhost):\d+\//.test(apiHost)) throw new Error('SANITY_API_HOST is reserved for local simulation.');

export default defineConfig({
  output: 'static',
  integrations: [sanity({
    projectId: env.SANITY_PROJECT_ID || 'iwd3xpdu',
    dataset: env.SANITY_DATASET || 'production',
    apiVersion: '2025-08-15', useCdn: false, perspective: 'published',
    token: env.SANITY_READ_TOKEN || undefined,
    ...(apiHost ? { apiHost, useProjectHostname: false } : {}),
  })],
  build: { assets: 'marketing-assets' },
});

import type { PackageCatalog, PublicModel } from '../types/catalog';

export const publicApiOrigin = import.meta.env.PUBLIC_API_ORIGIN || 'https://api.alveta.ai';
const cache = new Map<string, { expires: number; promise: Promise<unknown> }>();
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const amount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const optionalAmount = (value: unknown) => value === null || amount(value);
const featureKeys = ['image_gen', 'video_gen', 'voice_gen', 'api_access', 'ide_integration', 'prompt_library'];

export function invalidatePackageCache() {
  for (const key of cache.keys()) if (key.endsWith('/api/v1/packages')) cache.delete(key);
}

async function request<T>(origin: string, path: string, validate: (value: unknown) => T): Promise<T> {
  const base = new URL(typeof location !== 'undefined' && location.hostname === 'staging.alveta.ai' ? 'https://staging-api.alveta.ai' : origin);
  if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new Error('Invalid public API origin');
  // A base path also permits a local HTTP simulation without changing endpoint paths.
  const url = new URL(base.href.replace(/\/$/, '') + path).href;
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) return cached.promise as Promise<T>;
  const promise = fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(10000) })
    .then(async response => { if (!response.ok) throw new Error('Public API request failed'); return validate(await response.json()); })
    .catch(error => { cache.delete(url); throw error; });
  cache.set(url, { expires: Date.now() + 300000, promise });
  return promise;
}

export function loadPackages(origin: string): Promise<PackageCatalog> {
  return request(origin, '/api/v1/packages', value => {
    if (!object(value) || !Array.isArray(value.packages) || !['USD', 'BDT'].includes(String(value.detected_currency))) throw new Error('Invalid package catalog');
    const slugs = new Set<string>();
    for (const pkg of value.packages) {
      if (!object(pkg) || !text(pkg.id) || !text(pkg.slug) || !text(pkg.name) || typeof pkg.description !== 'string'
        || !object(pkg.price) || !amount(pkg.price.usd) || !optionalAmount(pkg.price.bdt)
        || !optionalAmount(pkg.token_value) || !Array.isArray(pkg.model_access) || !pkg.model_access.every(text)
        || !object(pkg.features) || !featureKeys.every(key => object(pkg.features) && typeof pkg.features[key] === 'boolean')
        || !['standard', 'priority'].includes(String(pkg.features.support_tier)) || typeof pkg.is_team_enabled !== 'boolean'
        || (pkg.is_team_enabled && (!object(pkg.per_seat_price) || !optionalAmount(pkg.per_seat_price.usd) || !optionalAmount(pkg.per_seat_price.bdt)
          || !Number.isSafeInteger(pkg.min_team_seats) || Number(pkg.min_team_seats) < 1))) throw new Error('Invalid package');
      const slug = pkg.slug.toLowerCase();
      if (slugs.has(slug)) throw new Error('Duplicate package slug');
      slugs.add(slug);
    }
    return value as unknown as PackageCatalog;
  });
}

export function loadPublicModels(origin: string): Promise<PublicModel[]> {
  return request(origin, '/api/v1/models/public', value => {
    if (!object(value) || !Array.isArray(value.models) || !value.models.every(model => object(model) && text(model.model_id) && text(model.name) && text(model.provider))) throw new Error('Invalid model catalog');
    return value.models as PublicModel[];
  });
}

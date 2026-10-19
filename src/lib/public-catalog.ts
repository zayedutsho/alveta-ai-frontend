import type { PackageCatalog, PublicModel, PublicPackage, Currency } from '../types/catalog';
import { resolvePublicApiBase } from './api-config';
export { publicApiOrigin } from './api-config';

const cache = new Map<string, { expires: number; promise: Promise<unknown> }>();
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const amount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const optionalAmount = (value: unknown) => value === null || amount(value);
const featureKeys = ['image_gen', 'video_gen', 'voice_gen', 'api_access', 'ide_integration', 'prompt_library'];

export function invalidatePackageCache() {
  for (const key of cache.keys()) if (key.endsWith('/api/v1/packages')) cache.delete(key);
}

async function request<T>(origin: string, path: string, validate: (value: unknown) => T): Promise<T> {
  const base = resolvePublicApiBase(origin);
  const url = new URL(base.href.replace(/\/$/, '') + path).href;
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) return cached.promise as Promise<T>;
  const promise = fetch(url, { credentials: 'omit', redirect: 'error', cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) })
    .then(async response => { if (!response.ok) throw new Error('Public API request failed'); return validate(await response.json()); })
    .catch(() => { cache.delete(url); throw new Error('Public API request failed'); });
  cache.set(url, { expires: Date.now() + 300000, promise });
  return promise;
}

export function loadPackages(origin: string): Promise<PackageCatalog> {
  return request(origin, '/api/v1/packages', normalizePackages);
}

/** Never return the upstream object or spread unknown fields into the UI model. */
export function normalizePackages(value: unknown): PackageCatalog {
    if (!object(value) || !Array.isArray(value.packages) || (value.detected_currency !== 'USD' && value.detected_currency !== 'BDT')) throw new Error('Invalid package catalog');
    const slugs = new Set<string>();
    const packages: PublicPackage[] = [];
    for (const pkg of value.packages) {
      if (!object(pkg) || !text(pkg.id) || !text(pkg.slug) || !text(pkg.name) || typeof pkg.description !== 'string'
        || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(pkg.slug)
        || !object(pkg.price) || !amount(pkg.price.usd) || !optionalAmount(pkg.price.bdt)
        || !optionalAmount(pkg.token_value) || !Array.isArray(pkg.model_access) || !pkg.model_access.every(text)
        || !object(pkg.features) || !featureKeys.every(key => object(pkg.features) && typeof pkg.features[key] === 'boolean')
        || (pkg.features.support_tier !== 'standard' && pkg.features.support_tier !== 'priority') || typeof pkg.is_team_enabled !== 'boolean'
        || !object(pkg.per_seat_price) || !optionalAmount(pkg.per_seat_price.usd) || !optionalAmount(pkg.per_seat_price.bdt)
        || !Number.isSafeInteger(pkg.min_team_seats) || Number(pkg.min_team_seats) < 1) throw new Error('Invalid package');
      const slug = pkg.slug.toLowerCase();
      if (slugs.has(slug)) throw new Error('Duplicate package slug');
      slugs.add(slug);
      const features: PublicPackage['features'] = { support_tier: pkg.features.support_tier };
      for (const key of featureKeys) features[key] = pkg.features[key] as boolean;
      packages.push({
        id: pkg.id, slug: pkg.slug, name: pkg.name, description: pkg.description,
        price: { usd: pkg.price.usd, bdt: pkg.price.bdt as number | null },
        token_value: pkg.token_value as number | null, model_access: [...new Set(pkg.model_access as string[])], features,
        is_team_enabled: pkg.is_team_enabled,
        per_seat_price: { usd: pkg.per_seat_price.usd as number | null, bdt: pkg.per_seat_price.bdt as number | null },
        min_team_seats: pkg.min_team_seats as number,
      });
    }
    return { packages, detected_currency: value.detected_currency as Currency };
}

export function loadPublicModels(origin: string): Promise<PublicModel[]> {
  return request(origin, '/api/v1/models/public', normalizePublicModels);
}

export function normalizePublicModels(value: unknown): PublicModel[] {
    if (!object(value) || !Array.isArray(value.models) || !value.models.every(model => object(model) && text(model.model_id) && text(model.name) && text(model.provider))) throw new Error('Invalid model catalog');
    const ids = new Set<string>();
    return value.models.map(model => {
      if (ids.has(model.model_id)) throw new Error('Duplicate model ID');
      ids.add(model.model_id);
      return { model_id: model.model_id, name: model.name, provider: model.provider };
    });
}

import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { marketingDefaults, type MarketingContent } from '../content/marketing';

export interface EditorialImage { src: string; width: number; height: number; alt?: string; }
export type MediaMap = Record<string, EditorialImage>;
type RecordValue = Record<string, unknown>;
const record = (value: unknown): value is RecordValue => !!value && typeof value === 'object' && !Array.isArray(value);

export function safeContentLink(value: string): boolean {
  if (/[\\\u0000-\u001f\u007f]/.test(value) || value !== value.trim() || value.startsWith('//')) return false;
  if (value.startsWith('#') || value.startsWith('/')) return true;
  try { const url = new URL(value); return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
}

export function imageResolver(projectId: string, dataset: string) {
  const builder = createImageUrlBuilder({ projectId, dataset });
  return (value: unknown): EditorialImage | undefined => {
    if (!record(value) || !record(value.asset)) return;
    const asset = value.asset;
    const id = typeof asset._id === 'string' ? asset._id : asset._ref;
    if (typeof id !== 'string' || !/^image-[a-zA-Z0-9]+-\d+x\d+-[a-zA-Z0-9]+$/.test(id)) return;
    const dimensions = /-(\d+)x(\d+)-/.exec(id)!;
    const width = Number(dimensions[1]), height = Number(dimensions[2]);
    if (!width || !height) return;
    const src = builder.image({ ...value, asset: { _ref: id } } as SanityImageSource)
      .width(Math.min(width, 1600)).auto('format').url();
    return { src, width, height, alt: typeof value.alt === 'string' ? value.alt : '' };
  };
}

/** Only known editorial keys reach components; IDs, asset names and API selectors stay code-owned. */
export function normalizeMarketing(raw: unknown, resolveImage: ReturnType<typeof imageResolver>): MarketingContent {
  const protectedKeys = new Set(['id', 'key', 'asset', 'mobileAsset', 'icon', 'kind', 'path', 'status']);
  function merge(fallback: unknown, incoming: unknown, key = ''): unknown {
    if (protectedKeys.has(key)) return fallback;
    const image = (key === 'avatar' || key === 'portrait' || (key === 'image' && typeof fallback === 'string')) ? resolveImage(incoming) : undefined;
    if (image) return typeof fallback === 'string' ? image.src : image;
    if (incoming === undefined || incoming === null) return structuredClone(fallback);
    if (typeof fallback === 'string') {
      if (typeof incoming !== 'string') return fallback;
      if (['href', 'src', 'image'].includes(key) && !safeContentLink(incoming)) return fallback;
      return incoming;
    }
    if (typeof fallback === 'boolean') return typeof incoming === 'boolean' ? incoming : fallback;
    if (typeof fallback === 'number') return typeof incoming === 'number' && Number.isFinite(incoming) ? incoming : fallback;
    if (Array.isArray(fallback)) {
      if (!Array.isArray(incoming)) return structuredClone(fallback);
      if (key === 'heading') return [0, 1].map(index => merge(fallback[index] ?? '', incoming[index]));
      if (!fallback.length) return [];
      return incoming.slice(0, 100).filter(item => typeof item === typeof fallback[0] && (!record(fallback[0]) || record(item))).map((item, index) => {
        const matched = record(item) ? fallback.find(entry => record(entry) && (item.id ? entry.id === item.id : item.key ? entry.key === item.key : false)) : undefined;
        const template = matched ?? fallback[index] ?? fallback[0];
        const merged = merge(template, item);
        if (key === 'items' && record(item) && record(merged)) {
          const id = typeof item.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : `item-${index}`;
          merged.id = id;
        }
        return merged;
      });
    }
    if (record(fallback)) {
      const source = record(incoming) ? incoming : {};
      return Object.fromEntries(Object.entries(fallback).map(([name, value]) => [name, merge(value, source[name], name)]));
    }
    return fallback;
  }
  return merge(marketingDefaults, raw) as MarketingContent;
}

export function normalizeMedia(raw: unknown, resolveImage: ReturnType<typeof imageResolver>): MediaMap {
  if (!Array.isArray(raw)) return {};
  return Object.fromEntries(raw.flatMap(entry => {
    if (!record(entry) || typeof entry.source !== 'string' || !entry.source.startsWith('/') || entry.source.startsWith('//')) return [];
    const image = resolveImage(entry.image);
    return image ? [[entry.source, image]] : [];
  }));
}

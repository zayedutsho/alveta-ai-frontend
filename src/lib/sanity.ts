import { sanityClient } from 'sanity:client';
import { defineQuery } from 'groq';
import { imageResolver, normalizeMarketing, normalizeMedia } from './marketing-content';

export const LANDING_PAGE_QUERY = defineQuery(`*[_type == "landingPage" && !(_id in path("drafts.**"))] | order(_createdAt asc)[0]{...}`);

export async function loadMarketingContent() {
  const config = sanityClient.config();
  const resolveImage = imageResolver(config.projectId!, config.dataset!);
  let document: unknown;
  try {
    document = await sanityClient.fetch(LANDING_PAGE_QUERY, {}, { perspective: 'published', signal: AbortSignal.timeout(10000) });
    if (!document) console.warn('[Sanity] No published landing page found; using local editorial defaults.');
  } catch {
    console.warn('[Sanity] Published content unavailable; using local editorial defaults.');
  }
  const media = typeof document === 'object' && document ? (document as { media?: unknown }).media : undefined;
  return { content: normalizeMarketing(document, resolveImage), media: normalizeMedia(media, resolveImage) };
}

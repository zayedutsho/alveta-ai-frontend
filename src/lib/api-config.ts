const production = 'https://api.alveta.ai';
const staging = 'https://staging-api.alveta.ai';
const allowedOrigins = new Set([production, staging]);
const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);

// Fail configuration early; never serialize credential-bearing or unapproved bases.
export const publicApiOrigin = resolvePublicApiBase(import.meta.env?.PUBLIC_API_ORIGIN || production, 'localhost').href.replace(/\/$/, '');

/** Fixed public services; loopback exceptions exist only on a loopback page. */
export function resolvePublicApiBase(configured: string, pageHostname = typeof location === 'undefined' ? '' : location.hostname): URL {
  let base: URL;
  try { base = new URL(pageHostname === 'staging.alveta.ai' ? staging : configured); }
  catch { throw new Error('Invalid public API configuration'); }
  if (base.username || base.password || base.search || base.hash) throw new Error('Invalid public API configuration');
  if (allowedOrigins.has(base.origin) && base.pathname === '/') return base;
  if (loopback.has(pageHostname) && loopback.has(base.hostname) && base.protocol === 'http:') {
    if (base.port === '8000' && base.pathname === '/') return base;
    if (base.port === '4372' && ['/alveta', '/alveta/'].includes(base.pathname)) return base;
  }
  throw new Error('Invalid public API configuration');
}

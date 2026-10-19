/** Product routing remains owned by the existing application. */
const configuredOrigin = import.meta.env?.PUBLIC_APP_ORIGIN || 'https://app.alveta.ai';
const origin = new URL(configuredOrigin);
if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('PUBLIC_APP_ORIGIN must be an HTTP(S) origin without credentials, path, query or fragment.');
}
export function appLink(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(path)) throw new Error('Expected an absolute application path.');
  const destination = new URL(path, origin);
  if (destination.origin !== origin.origin) throw new Error('Expected a same-origin application path.');
  return destination.href;
}

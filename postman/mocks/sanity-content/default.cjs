// Read-only local Sanity dependency, matching the Content Lake query response envelope.
const http = require('node:http');
let state = {};
let calls = [];
http.createServer((req, res) => {
  const reply = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (req.url === '/__control' && req.method === 'POST') {
    let body = ''; req.on('data', chunk => body += chunk);
    req.on('end', () => { state = JSON.parse(body || '{}'); calls = []; reply(200, { ok: true }); }); return;
  }
  if (req.url === '/__calls') { reply(200, calls); return; }
  const url = new URL(req.url, 'http://localhost');
  calls.push({ method: req.method, path: url.pathname, query: url.searchParams.get('query'), perspective: url.searchParams.get('perspective') });
  if (req.method !== 'GET' || url.pathname !== '/v2025-08-15/data/query/production') { reply(501, { error: 'Unsupported simulation route' }); return; }
  if (state.failure) { reply(503, { error: 'Sanity dependency unavailable' }); return; }
  reply(200, { result: state.empty ? null : state.document ?? {
    _type: 'landingPage', _id: 'published-marketing-example',
    hero: { heading: ['Marketing managed title', 'From Sanity'], description: 'A published marketing description.' },
    features: { description: 'Marketing can update this section.' },
    pricing: { heading: ['Choose your plan', ''], price: 999999, order: ['pro'], popular: 'pro' },
  }, ms: 1 });
}).listen(process.env.PORT);

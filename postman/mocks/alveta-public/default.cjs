// Local-only CommonJS HTTP simulation. Snapshots are never production fallback data.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog.json'), 'utf8'));
const models = JSON.parse(fs.readFileSync(path.join(__dirname, 'models.json'), 'utf8'));
let state = {};
let calls = [];
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const reply = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };
  if (req.url === '/__control' && req.method === 'POST') {
    let body = ''; req.on('data', chunk => body += chunk); req.on('end', () => { state = JSON.parse(body || '{}'); calls = []; reply(200, { ok: true }); }); return;
  }
  if (req.url === '/__calls') { reply(200, calls); return; }
  calls.push({ method: req.method, url: req.url, authorization: !!req.headers.authorization, cookie: !!req.headers.cookie });
  if (req.method !== 'GET') { reply(501, { error: 'Unsupported simulation route' }); return; }
  if (req.url === '/api/v1/models/public') { reply(state.modelsFailure ? 503 : 200, models); return; }
  if (req.url !== '/api/v1/packages') { reply(501, { error: 'Unsupported simulation route' }); return; }
  if (state.failure) { reply(503, { error: 'Unavailable' }); return; }
  if (state.malformed) { reply(200, { packages: [{ slug: 'bad', price: { usd: -1 } }] }); return; }
  const catalog = structuredClone(state.catalog || base);
  if (state.currency) catalog.detected_currency = state.currency;
  if (state.empty) catalog.packages = [];
  if (state.noBdt) for (const pkg of catalog.packages) { pkg.price.bdt = null; pkg.per_seat_price.bdt = null; }
  if (state.noTeam) for (const pkg of catalog.packages) pkg.is_team_enabled = false;
  if (state.delay) setTimeout(() => reply(200, catalog), state.delay);
  else reply(200, catalog);
}).listen(process.env.PORT);

// API Mon CAMP (Vercel, Node 18+) - fichier unique, aucune dépendance.
const crypto = require('crypto');

const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const SECRET = process.env.API_SECRET || '';
const TTL = 8 * 3600 * 1000; // validité d'une session agent : 8 h

function key() { return crypto.createHash('sha256').update(SECRET).digest(); }

// Jeton = code agent chiffré (AES-256-GCM) + expiration. Illisible et infalsifiable sans API_SECRET.
function makeToken(code) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const ct = Buffer.concat([c.update(JSON.stringify({ c: code, e: Date.now() + TTL }), 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), ct]).toString('base64url');
}
function readToken(t) {
  try {
    const b = Buffer.from(String(t || ''), 'base64url');
    const d = crypto.createDecipheriv('aes-256-gcm', key(), b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    const o = JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8'));
    return o.e > Date.now() ? o.c : null;
  } catch (e) { return null; }
}

async function rpc(name, args) {
  const r = await fetch(SB_URL + '/rest/v1/rpc/' + name, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(args || {})
  });
  const txt = await r.text();
  let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) {}
  return { ok: r.ok, status: r.status, data };
}

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(body);
}
function guard(req, res, method) {
  if (!SB_URL || !SB_KEY || !SECRET) { send(res, 500, { ok: false, error: 'config_manquante' }); return false; }
  if (req.method !== method) { res.setHeader('Allow', method); send(res, 405, { ok: false, error: 'methode' }); return false; }
  return true;
}
function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}
function agentCode(req) {
  const h = req.headers.authorization || '';
  return readToken(h.startsWith('Bearer ') ? h.slice(7) : body(req).token);
}

// Limiteur simple par IP (mémoire de l'instance : protection de base).
const hits = new Map();
function limited(req, max, ms) {
  const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0].trim();
  const now = Date.now();
  const a = (hits.get(ip) || []).filter(t => now - t < ms);
  a.push(now); hits.set(ip, a);
  return a.length > max;
}



// ---- Routes : /api?r=health | login | scan | stats
module.exports = async (req, res) => {
  const r = String((req.query && req.query.r) || 'health');
  if (r === 'health') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, service: 'mon-camp-api', time: new Date().toISOString() });
  }
  if (r === 'login') {
    if (!guard(req, res, 'POST')) return;
    if (limited(req, 8, 5 * 60 * 1000)) return send(res, 429, { ok: false, error: 'trop_d_essais' });
    const code = String(body(req).code || '').trim();
    if (!code) return send(res, 400, { ok: false, error: 'code_requis' });
    const x = await rpc('staff_check', { p_code: code });
    if (!x.ok) return send(res, 502, { ok: false, error: 'service_indisponible' });
    if (!x.data || x.data === "false") return send(res, 401, { ok: false, error: 'code_incorrect' });
    return send(res, 200, { ok: true, token: makeToken(code) });
  }
  if (r === 'scan') {
    if (!guard(req, res, 'POST')) return;
    const code = agentCode(req);
    if (!code) return send(res, 401, { ok: false, error: 'session_expiree' });
    const b = body(req);
    const ticket = String(b.ticket || '').trim().slice(0, 40);
    if (!ticket) return send(res, 400, { ok: false, error: 'ticket_requis' });
    const x = await rpc('submit_scan', {
      p_code: code, p_ticket: ticket,
      p_phone: String(b.phone || '').slice(0, 30),
      p_sig: b.sig ? String(b.sig).slice(0, 200) : null,
      p_manual: !!b.manual
    });
    if (!x.ok) return send(res, 502, { ok: false, error: 'service_indisponible' });
    return send(res, 200, { ok: true, data: x.data });
  }
  if (r === 'stats') {
    if (!guard(req, res, 'GET')) return;
    if (!agentCode(req)) return send(res, 401, { ok: false, error: 'session_expiree' });
    const x = await rpc('camp_stats', {});
    if (!x.ok) return send(res, 502, { ok: false, error: 'service_indisponible' });
    return send(res, 200, { ok: true, data: x.data });
  }
  return send(res, 404, { ok: false, error: 'route_inconnue' });
};

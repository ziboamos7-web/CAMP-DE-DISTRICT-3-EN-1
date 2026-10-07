const { rpc, send, guard, body, makeToken, limited } = require('../_lib');
// POST /api/agent/login  { code }  ->  { ok, token }
module.exports = async (req, res) => {
  if (!guard(req, res, 'POST')) return;
  if (limited(req, 8, 5 * 60 * 1000)) return send(res, 429, { ok: false, error: 'trop_d_essais' });
  const code = String(body(req).code || '').trim();
  if (!code) return send(res, 400, { ok: false, error: 'code_requis' });
  const r = await rpc('staff_check', { p_code: code });
  if (!r.ok) return send(res, 502, { ok: false, error: 'service_indisponible' });
  if (r.data !== true) return send(res, 401, { ok: false, error: 'code_incorrect' });
  send(res, 200, { ok: true, token: makeToken(code) });
};

const { rpc, send, guard, agentCode } = require('./_lib');
// GET /api/stats  (Authorization: Bearer <token>)  -> statistiques du camp (fonction SQL camp_stats)
module.exports = async (req, res) => {
  if (!guard(req, res, 'GET')) return;
  if (!agentCode(req)) return send(res, 401, { ok: false, error: 'session_expiree' });
  const r = await rpc('camp_stats', {});
  if (!r.ok) return send(res, 502, { ok: false, error: 'service_indisponible' });
  send(res, 200, { ok: true, data: r.data });
};

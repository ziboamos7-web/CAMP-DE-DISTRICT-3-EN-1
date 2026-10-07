const { rpc, send, guard, body, agentCode } = require('./_lib');
// POST /api/scan  (Authorization: Bearer <token>)  { ticket, phone, sig, manual }
module.exports = async (req, res) => {
  if (!guard(req, res, 'POST')) return;
  const code = agentCode(req);
  if (!code) return send(res, 401, { ok: false, error: 'session_expiree' });
  const b = body(req);
  const ticket = String(b.ticket || '').trim().slice(0, 40);
  if (!ticket) return send(res, 400, { ok: false, error: 'ticket_requis' });
  const r = await rpc('submit_scan', {
    p_code: code, p_ticket: ticket,
    p_phone: String(b.phone || '').slice(0, 30),
    p_sig: b.sig ? String(b.sig).slice(0, 200) : null,
    p_manual: !!b.manual
  });
  if (!r.ok) return send(res, 502, { ok: false, error: 'service_indisponible' });
  send(res, 200, { ok: true, data: r.data });
};

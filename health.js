module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true, service: 'mon-camp-api', time: new Date().toISOString() });
};

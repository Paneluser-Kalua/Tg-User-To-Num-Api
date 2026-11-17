const axios = require('axios');

// ============================================================
// 💎 TG · NUM — CLEAN REPORT  ·  by KaluaApiAdmin
// ============================================================

const SRC = 'https://bronx-ultra-king.duckdns.org/api/custom/tg-tyle';
const KEY = 'bronx-tg';
const W = 34;
const DEMO_DAYS = 2;

const HTOP = '▗' + '▄'.repeat(W) + '▖';
const HBOT = '▝' + '▀'.repeat(W) + '▘';
const bar = (t = '') => (t ? `▐ ${t}` : '▐');

const MARK = ' ◈ T G   ·   N U M';
const SIGN = ' by KaluaApiAdmin  ·  @KaluaApiStore';

// ---------- helpers ----------
const clean = (v) =>
  v == null ? '' : String(v).replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim();

const pad2 = (n) => String(n).padStart(2, '0');

const stamp = (d) => `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;

const field = (label, value) => `     ${label.padEnd(8)} : ${value}`;

function errorBox(msg, usage) {
  const body = [' ✕ NOT WORKING', ` Reason : ${clean(msg)}`];
  if (usage) body.push(` How to : ${usage}`);
  return [HTOP, bar(MARK), HBOT, ...body.map(bar), HBOT, bar(SIGN), HBOT].join('\n');
}

// ============================================================

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  const raw = req.query.user || req.query.username || req.query.num;
  const input = Array.isArray(raw) ? raw[0] : raw;

  if (!input) {
    return res.status(400).send(errorBox('Username is missing.', '/api/tg?user=@JAUUOWNER'));
  }

  const user = String(input).trim().replace(/^@+/, '').replace(/\s+/g, '');

  if (!/^[A-Za-z0-9_]{5,32}$/.test(user)) {
    return res.status(400).send(
      errorBox('Username must be 5-32 letters, numbers or _.', '/api/tg?user=@JAUUOWNER')
    );
  }

  try {
    const { data } = await axios.get(`${SRC}?key=${KEY}&num=${encodeURIComponent(user)}`, {
      timeout: 12000,
      responseType: 'json',
      maxContentLength: 1_000_000,
      validateStatus: (s) => s < 500,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json',
      },
    });

    const d = data || {};

    if (d.error || d.status === false || !clean(d.number)) {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
      return res.status(404).send(
        errorBox('No number linked to this username.', '/api/tg?user=@JAUUOWNER')
      );
    }

    const id = clean(d.tg_id) || 'UNKNOWN';
    const country = clean(d.country) || 'UNKNOWN';
    const code = clean(d.country_code);
    const number = clean(d.number);
    const full = code ? `${code} ${number}` : number;

    const cards = [
      ` 01 ▸ Username : @${user}`,
      field('Profile', `t.me/${user}`),
      field('Telegram ID', id),
      field('Country', country),
      field('Code', code || 'UNKNOWN'),
      field('Number', full),
    ];

    const exp = stamp(new Date(Date.now() + DEMO_DAYS * 86_400_000));

    const head = [
      HTOP,
      bar(MARK),
      bar(),
      bar(` Username : @${user}`),
      bar(` Trial    : ${DEMO_DAYS} Days`),
      bar(` Expires  : ${exp}`),
      HBOT,
    ];

    const foot = [HTOP, bar(' ◈ 1 record found'), bar(SIGN), HBOT];

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).send([...head, '', ...cards, '', ...foot].join('\n'));
  } catch (err) {
    res.setHeader('Cache-Control', 's-maxage=30');
    const msg =
      err.code === 'ECONNABORTED' || /timeout/i.test(err.message)
        ? 'Timeout. Please try again.'
        : err.response
          ? 'Server busy. Please try again.'
          : clean(err.message);
    return res.status(502).send(errorBox(msg));
  }
};

module.exports.config = { maxDuration: 30 };

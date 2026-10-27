// api/subscribe.js - حفظ اشتراكات الإشعارات (عملاء + مندوبين) في Firebase
const crypto = require('crypto');

const FB = (process.env.FIREBASE_URL || '').replace(/\/$/, '');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  // GET: يرجّع المفتاح العام ليستخدمه المتصفح
  if (req.method === 'GET') {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey) return res.status(500).json({ error: 'VAPID_PUBLIC_KEY is not set' });
    return res.status(200).json({ publicKey });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!FB) return res.status(500).json({ error: 'FIREBASE_URL is not set' });

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    body = body || {};

    const role = body.role;
    const phone = String(body.phone || '').replace(/\D/g, '');
    const sub = body.subscription;

    if (!['customer', 'driver'].includes(role)) return res.status(400).json({ error: 'bad role' });
    if (phone.length < 5 || phone.length > 15) return res.status(400).json({ error: 'bad phone' });
    if (!sub || typeof sub.endpoint !== 'string' || !sub.endpoint.startsWith('https://') || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
      return res.status(400).json({ error: 'bad subscription' });
    }

    const hash = crypto.createHash('sha1').update(sub.endpoint).digest('hex');
    const record = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      updatedAt: new Date().toISOString()
    };

    const r = await fetch(`${FB}/push_subs/${role}/${phone}/${hash}.json`, {
      method: 'PUT',
      body: JSON.stringify(record)
    });
    if (!r.ok) return res.status(502).json({ error: 'firebase write failed' });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'server error' });
  }
};

// api/notify.js - إرسال الإشعارات
// السيرفر يقرأ الطلب من Firebase بنفسه ويحدد النص والمستلم، فلا يمكن لأحد تزوير محتوى الإشعار.
//   new_order -> إشعار لكل المندوبين
//   status    -> إشعار للعميل صاحب الطلب
const webpush = require('web-push');

const FB = (process.env.FIREBASE_URL || '').replace(/\/$/, '');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function fbGet(path) {
  const r = await fetch(`${FB}/${path}.json`);
  return r.json();
}

async function fbPatch(path, data) {
  await fetch(`${FB}/${path}.json`, { method: 'PATCH', body: JSON.stringify(data) });
}

async function fbDelete(path) {
  await fetch(`${FB}/${path}.json`, { method: 'DELETE' });
}

// يحوّل { phone: { hash: sub } } إلى قائمة مسطّحة
function flatten(role, tree) {
  const list = [];
  if (!tree) return list;
  if (role === 'customer-single') {
    for (const hash of Object.keys(tree)) list.push({ path: null, hash, sub: tree[hash] });
    return list;
  }
  for (const phone of Object.keys(tree)) {
    for (const hash of Object.keys(tree[phone] || {})) {
      list.push({ path: `push_subs/${role}/${phone}/${hash}`, sub: tree[phone][hash] });
    }
  }
  return list;
}

async function sendAll(targets, payload) {
  const text = JSON.stringify(payload);
  let sent = 0;
  await Promise.allSettled(
    targets.map(async (t) => {
      try {
        await webpush.sendNotification(t.sub, text, { TTL: 3600, urgency: 'high' });
        sent++;
      } catch (e) {
        // الاشتراك انتهى أو أُلغي -> نحذفه
        if ((e.statusCode === 404 || e.statusCode === 410) && t.path) {
          await fbDelete(t.path);
        }
      }
    })
  );
  return sent;
}

const STATUS_MESSAGES = {
  preparing: (o) => ({ title: '👨‍🍳 طلبك قيد التحضير', body: `المطعم يحضّر طلبك رقم #${o.id} الآن` }),
  on_the_way: (o) => ({ title: '🛵 طلبك في الطريق', body: o.driverName ? `المندوب ${o.driverName} في طريقه إليك` : 'المندوب في طريقه إليك' }),
  arrived: () => ({ title: '📍 المندوب وصل', body: 'المندوب وصل إلى موقعك، تفضّل باستلام طلبك' }),
  delivered: () => ({ title: '✅ تم التوصيل', body: 'بالعافية! لا تنسَ تقييم طلبك' })
};

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!FB) return res.status(500).json({ error: 'FIREBASE_URL is not set' });

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    body = body || {};

    const type = body.type;
    const orderId = String(body.orderId || '');
    if (!/^\d{5,20}$/.test(orderId)) return res.status(400).json({ error: 'bad orderId' });
    if (!['new_order', 'status'].includes(type)) return res.status(400).json({ error: 'bad type' });

    const order = await fbGet(`orders/${orderId}`);
    if (!order) return res.status(404).json({ error: 'order not found' });

    const state = (await fbGet(`push_state/${orderId}`)) || {};

    // ----- طلب جديد -> المندوبين -----
    if (type === 'new_order') {
      if (order.status !== 'pending' || state.newSent) return res.status(200).json({ ok: true, skipped: true });
      await fbPatch(`push_state/${orderId}`, { newSent: true });

      const drivers = flatten('driver', await fbGet('push_subs/driver'));
      const sent = await sendAll(drivers, {
        title: `🔔 طلب جديد #${order.id}`,
        body: `${order.customerName || 'عميل'} • ${order.total || 0} ريال`,
        orderId: order.id,
        tag: `new-${order.id}`,
        url: './'
      });
      return res.status(200).json({ ok: true, sent });
    }

    // ----- تغيّر الحالة -> العميل -----
    const status = order.status;
    const build = STATUS_MESSAGES[status];
    if (!build || state.lastStatus === status) return res.status(200).json({ ok: true, skipped: true });
    await fbPatch(`push_state/${orderId}`, { lastStatus: status });

    const phone = String(order.customerPhone || '').replace(/\D/g, '');
    if (!phone) return res.status(200).json({ ok: true, skipped: true });

    const tree = await fbGet(`push_subs/customer/${phone}`);
    const targets = [];
    if (tree) {
      for (const hash of Object.keys(tree)) {
        targets.push({ path: `push_subs/customer/${phone}/${hash}`, sub: tree[hash] });
      }
    }

    const msg = build(order);
    const sent = await sendAll(targets, {
      title: msg.title,
      body: msg.body,
      orderId: order.id,
      tag: `order-${order.id}`,
      url: './'
    });
    return res.status(200).json({ ok: true, sent });
  } catch (e) {
    return res.status(500).json({ error: 'server error' });
  }
};

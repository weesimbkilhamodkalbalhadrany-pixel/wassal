// api/subscribe.js — حفظ / حذف اشتراك الإشعارات
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const FB = process.env.FIREBASE_URL;
    if (req.method !== 'GET' && !FB) {
        return res.status(500).json({ error: 'FIREBASE_URL is not set' });
    }

    if (req.method === 'GET') {
        const publicKey = process.env.VAPID_PUBLIC_KEY;
        if (!publicKey) return res.status(500).json({ error: 'VAPID_PUBLIC_KEY is not set' });
        return res.status(200).json({ publicKey });
    }

    try {
        if (req.method === 'POST') {
            const { role, phone, name, subscription } = req.body || {};
            if (!role || !phone || !subscription) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            // نحفظ الدور مع الاشتراك ليعرف send-push من هو المندوب ومن هو العميل
            const r = await fetch(`${FB}/subscriptions/${encodeURIComponent(phone)}.json`, {
                method: 'PUT',
                body: JSON.stringify({ role, phone, name: name || '', subscription, updatedAt: Date.now() })
            });
            if (!r.ok) throw new Error('Failed to save subscription');
            return res.status(200).json({ success: true });
        }

        if (req.method === 'DELETE') {
            const { phone } = req.body || {};
            if (!phone) return res.status(400).json({ error: 'Missing phone' });
            await fetch(`${FB}/subscriptions/${encodeURIComponent(phone)}.json`, { method: 'DELETE' });
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

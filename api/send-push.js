// api/send-push.js — إرسال إشعار للمندوبين أو لعميل محدد
import webpush from 'web-push';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
    const FB = process.env.FIREBASE_URL || 'https://alam-taha-default-rtdb.firebaseio.com';
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        return res.status(500).json({ error: 'VAPID keys are not set' });
    }

    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );

    try {
        const { target, phone, title, body, url } = req.body || {};
        if (!title || !body) return res.status(400).json({ error: 'Missing title/body' });
        if (target !== 'drivers' && !phone) return res.status(400).json({ error: 'Missing target' });

        const r = await fetch(`${FB}/subscriptions.json`);
        const all = (await r.json()) || {};

        // اختيار المستلمين
        const recipients = Object.entries(all).filter(([key, v]) => {
            if (!v || !v.subscription) return false;
            if (target === 'drivers') return v.role === 'driver';
            return String(v.phone || key) === String(phone);
        });

        const payload = JSON.stringify({ title, body, url: url || '/' });
        let sent = 0;

        await Promise.all(recipients.map(async ([key, v]) => {
            try {
                await webpush.sendNotification(v.subscription, payload, { urgency: 'high', TTL: 3600 });
                sent++;
            } catch (err) {
                // الاشتراك منتهي → نحذفه
                if (err.statusCode === 404 || err.statusCode === 410) {
                    await fetch(`${FB}/subscriptions/${encodeURIComponent(key)}.json`, { method: 'DELETE' });
                } else {
                    console.error('push error', key, err.statusCode, err.body);
                }
            }
        }));

        return res.status(200).json({ success: true, sent, total: recipients.length });
    } catch (e) {
        console.error('send-push error:', e);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

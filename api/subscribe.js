// api/subscribe.js
export default async function handler(req, res) {
    // السماح بطلبات CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // التعامل مع طلبات OPTIONS (Preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // معالجة طلبات GET (لجلب المفتاح العام)
    if (req.method === 'GET') {
        const publicKey = process.env.VAPID_PUBLIC_KEY;
        if (!publicKey) {
            return res.status(500).json({ error: 'VAPID_PUBLIC_KEY is not set' });
        }
        return res.status(200).json({ publicKey });
    }

    // معالجة طلبات POST (لحفظ الاشتراك)
    if (req.method === 'POST') {
        try {
            const { role, phone, subscription } = req.body;
            const FB = process.env.FIREBASE_URL;
            
            if (!FB) {
                return res.status(500).json({ error: 'FIREBASE_URL is not set' });
            }

            // التحقق من صحة البيانات
            if (!role || !phone || !subscription) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // حفظ الاشتراك في Firebase
            const response = await fetch(`${FB}/subscriptions/${phone}.json`, {
                method: 'PUT',
                body: JSON.stringify(subscription)
            });

            if (!response.ok) {
                throw new Error('Failed to save subscription to Firebase');
            }

            return res.status(200).json({ success: true });

        } catch (error) {
            console.error('Subscription error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // أي طريقة أخرى غير مدعومة
    return res.status(405).json({ error: 'Method not allowed' });
}

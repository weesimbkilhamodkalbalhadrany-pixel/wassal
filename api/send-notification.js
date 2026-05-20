export default async function handler(req, res) {
    // السماح بطلبات POST فقط لحماية السيرفر
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { title, message, userId } = req.body;

        // تجهيز البيانات لإرسالها لـ OneSignal
        const oneSignalBody = {
            app_id: "30b64e58-99cf-4189-af4a-fc3e53b59b7a", // معرف تطبيق وصّال
            headings: { en: title, ar: title },
            contents: { en: message, ar: message },
        };

        // إذا أرسلنا رقم مستخدم محدد (مثل رقم الهاتف عند الدخول) استهدفه هو فقط
        if (userId) {
            oneSignalBody.include_aliases = { "external_id": [userId] };
            oneSignalBody.target_channel = "push";
        } else {
            // إذا لم نحدد مستخدم، أرسل للجميع عبر الشريحة الافتراضية الصحيحة
            oneSignalBody.included_segments = ["All Subscribers"];
        }

        // إرسال الطلب إلى OneSignal باستخدام المفتاح السري المخفي في Vercel
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Key ${process.env.ONESIGNAL_REST_API_KEY}`
            },
            body: JSON.stringify(oneSignalBody)
        });

        const data = await response.json();

        if (data.id) {
            return res.status(200).json({ success: true, id: data.id });
        } else {
            return res.status(400).json({ success: false, error: data.errors ? data.errors[0] : 'OneSignal Error' });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// api/send-notification.js
export default async function handler(req, res) {
    // السماح فقط بطلبات POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { title, message, userId } = req.body;
    
    // التحقق من وجود المفتاح
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }
    
    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${apiKey}`
            },
            body: JSON.stringify({
                app_id: "30b64e58-99cf-4189-af4a-fc3e53b59b7a",
                included_segments: userId ? [] : ["Subscribed Users"],
                include_external_user_ids: userId ? [userId] : [],
                headings: { en: title, ar: title },
                contents: { en: message, ar: message }
            })
        });
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
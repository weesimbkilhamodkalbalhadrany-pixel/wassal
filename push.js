/* ===== push.js (Service Worker) ===== */
self.addEventListener('install', (event) => {
    self.skipWaiting(); // إجبار المتصفح على تفعيل النسخة الجديدة فوراً
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // السيطرة على جميع الصفحات المفتوحة
});

self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        try { 
            data = event.data.json(); 
        } catch (e) { 
            data = { title: 'إشعار جديد', body: event.data.text() }; 
        }
    }
    
    const options = {
        body: data.body || 'لديك إشعار جديد من مطعم العم طه',
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [100, 50, 100],
        data: { url: data.url || '/' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'مطعم العم طه 🍔', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

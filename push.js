/* ===== push.js ===== */
self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        try { data = event.data.json(); } catch (e) { data = { title: 'إشعار', body: event.data.text() }; }
    }
    
    const options = {
        body: data.body || 'لديك إشعار جديد',
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [100, 50, 100],
        data: { url: data.url || '/' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'مطعم العم طه', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

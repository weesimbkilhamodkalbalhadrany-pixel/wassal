/* ===== push.js (Service Worker) ===== */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('push', function (event) {
    let data = {};
    if (event.data) {
        try { data = event.data.json(); }
        catch (e) { data = { title: 'إشعار جديد', body: event.data.text() }; }
    }

    const options = {
        body: data.body || 'لديك إشعار جديد من مطعم العم طه',
        icon: 'icon-192-2.png',
        badge: 'icon-192-2.png',
        vibrate: [200, 100, 200],
        tag: data.tag || undefined,
        renotify: !!data.tag,
        data: { url: data.url || '/' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'مطعم العم طه 🍔', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            for (const c of list) {
                if ('focus' in c) return c.focus();
            }
            return clients.openWindow(url);
        })
    );
});

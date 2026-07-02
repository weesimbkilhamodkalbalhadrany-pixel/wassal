// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

// 1. إعدادات Firebase (تأكد من تطابقها مع ملف app.js)
firebase.initializeApp({
    apiKey: "AIzaSyBvmggMwxr-dJi0Q00BTf9cm_FzSrK",
    authDomain: "wasal-app-final.firebaseapp.com",
    projectId: "wasal-app-final",
    storageBucket: "wasal-app-final.firebasestorage.app",
    messagingSenderId: "110183430614",
    appId: "1:110183430614:web:e4b8e83e19a6f1ff5f"
});

// 2. تهيئة الميسجينج
const messaging = firebase.messaging();

// 3. معالج استقبال الإشعارات في الخلفية (عندما يكون التطبيق مغلقاً أو في الخلفية)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "logo.png", // تأكد من وجود هذه الصورة في جذر المشروع
        badge: "logo.png",
        vibrate: [200, 100, 200],
        data: payload.data // تمرير البيانات الإضافية إذا لزم الأمر
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. معالج النقر على الإشعار (الجزء الناقص والمهم جداً!)
self.addEventListener('notificationclick', function(event) {
    console.log('تم النقر على الإشعار...');
    
    // إغلاق الإشعار بعد النقر عليه
    event.notification.close();

    // فتح التطبيق أو التركيز عليه
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
            // إذا كان التطبيق مفتوحاً بالفعل، ركز عليه
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === "/" && "focus" in client) {
                    return client.focus();
                }
            }
            // إذا كان التطبيق مغلقاً، افتح نافذة جديدة
            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});

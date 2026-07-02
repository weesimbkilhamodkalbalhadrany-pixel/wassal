// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

// تهيئة الخدمة بنفس بيانات مشروعك الدقيقة
firebase.initializeApp({
    apiKey: "AIzaSyBvmggMwxr-dJi0Q00BTf9cm_FzSrK",
    authDomain: "wasal-app-final.firebaseapp.com",
    projectId: "wassal-app-final", // ⚠️ تأكد من كتابتها دبل s هنا لتطابق قاعدة البيانات
    storageBucket: "wasal-app-final.firebasestorage.app",
    messagingSenderId: "110183430614",
    appId: "1:110183430614:web:e4b8e83e19a6f1ff5f"
});

const messaging = firebase.messaging();

// استقبال الإشعارات في الخلفية
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "logo.png",
        badge: "logo.png"
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

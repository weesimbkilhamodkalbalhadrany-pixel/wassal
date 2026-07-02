// 1. استيراد المكتبات الأساسية لـ Firebase (نسخة الـ Compat)
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// 2. تهيئة Firebase باستخدام بيانات مشروعك الحقيقية
firebase.initializeApp({
  apiKey: "AIzaSyBvnmHgIm4Xs-d-LBQo02BTPGxm_FZsrk",
  authDomain: "wassal-app-final.firebaseapp.com",
  projectId: "wassal-app-final",
  storageBucket: "wassal-app-final.firebasestorage.app",
  messagingSenderId: "110183430414",
  appId: "1:110183430414:web:e4b8e88e31e91a0f61ff5f"
});

// 3. تهيئة خدمة المراسلة
const messaging = firebase.messaging();

// 4. كود استقبال الإشعارات عندما يكون التطبيق في الخلفية (اختياري)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // تأكد من وجود صورة اللوجو في مجلدك
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 1. استيراد مكتبات الفايربيس
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 2. إعدادات مشروعك الحقيقية من الصورة
firebase.initializeApp({
  apiKey: "AIzaSyBvnmHgN1m4Xs-d-LBQo0ZBPGxm_Fzsrk",
  authDomain: "wassal-app-final.firebaseapp.com",
  projectId: "wassal-app-final",
  storageBucket: "wassal-app-final.appspot.com",
  messagingSenderId: "110183430414",
  appId: "1:110183430414:web:e4b8e88e31e91a0f61ff5f"
});

const messaging = firebase.messaging();

// 3. استقبال الإشعارات عندما يكون التطبيق في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('تم استقبال إشعار في الخلفية: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

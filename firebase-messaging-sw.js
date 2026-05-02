importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCMb07oP2PMUdTlffJjYkbfThC34x1dbtU",
    authDomain: "waselny-2812b.firebaseapp.com",
    databaseURL: "https://waselny-2812b-default-rtdb.firebaseio.com",
    projectId: "waselny-2812b",
    storageBucket: "waselny-2812b.firebasestorage.app",
    messagingSenderId: "662536104158",
    appId: "1:662536104158:web:666db40942313724c3fa4f",
    measurementId: "G-YY8LPD0RH7"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico',
        click_action: payload.notification.click_action || '/'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

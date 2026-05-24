importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: "AIzaSyBvnmHgNIm4Xs-d-LBQo02BTPGxm_FZsrk",
  authDomain: "wassal-app-final.firebaseapp.com",
  projectId: "wassal-app-final",
  storageBucket: "wassal-app-final.firebasestorage.app",
  messagingSenderId: "110183430414",
  appId: "1:110183430414:web:e4b8e88e31e91a0f61ff5f",
  measurementId: "G-0K3TTX2NMC"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, { body: payload.notification.body });
});

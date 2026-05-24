// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvnmHgNIm4Xs-d-LBQo02BTPGxm_FZsrk",
  authDomain: "wassal-app-final.firebaseapp.com",
  projectId: "wassal-app-final",
  storageBucket: "wassal-app-final.firebasestorage.app",
  messagingSenderId: "110183430414",
  appId: "1:110183430414:web:e4b8e88e31e91a0f61ff5f",
  measurementId: "G-0K3TTX2NMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

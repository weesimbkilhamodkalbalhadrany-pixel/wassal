// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

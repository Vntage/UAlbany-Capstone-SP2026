// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYqAQtdQp9tWBryeQaxNztbE8yw2f2djE",
  authDomain: "capstone-spring2026.firebaseapp.com",
  projectId: "capstone-spring2026",
  storageBucket: "capstone-spring2026.firebasestorage.app",
  messagingSenderId: "695845619715",
  appId: "1:695845619715:web:c78741cb5bb3aa91faa636",
  measurementId: "G-Y5R9RRR909"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
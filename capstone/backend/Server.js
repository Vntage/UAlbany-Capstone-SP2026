import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

//note: this is starter code from firebase documentation

// TODO: Replace the following with your app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYqAQtdQp9tWBryeQaxNztbE8yw2f2djE",
  authDomain: "capstone-spring2026.firebaseapp.com",
  projectId: "capstone-spring2026",
  storageBucket: "capstone-spring2026.firebasestorage.app",
  messagingSenderId: "695845619715",
  appId: "1:695845619715:web:c78741cb5bb3aa91faa636",
  measurementId: "G-Y5R9RRR909"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/*
// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
} */
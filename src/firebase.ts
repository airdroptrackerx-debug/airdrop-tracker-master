// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU3J6bg--Jn7d41f_6pwfoHWMxDvMQ2Do",
  authDomain: "crypto-airdrop-tracker-b546f.firebaseapp.com",
  projectId: "crypto-airdrop-tracker-b546f",
  storageBucket: "crypto-airdrop-tracker-b546f.firebasestorage.app",
  messagingSenderId: "1000197539618",
  appId: "1:1000197539618:web:582085ac72e26fba93077b",
  measurementId: "G-VZ9YGR6VHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
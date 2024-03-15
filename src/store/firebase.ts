// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVnvr8iSdGeFHxYU6TzzGrcyZZHEsHK5k",
  authDomain: "kankan-8d846.firebaseapp.com",
  projectId: "kankan-8d846",
  storageBucket: "kankan-8d846.appspot.com",
  messagingSenderId: "725696641774",
  appId: "1:725696641774:web:38c8a38844657be86811ff",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };

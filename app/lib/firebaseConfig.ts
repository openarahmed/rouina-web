// File: lib/firebaseConfig.ts

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// আপনার ওয়েব অ্যাপের Firebase কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyDtCf5paolN9Y5LnOxhQd4xgpDIyi23VGs",
  authDomain: "routina-f8905.firebaseapp.com",
  projectId: "routina-f8905",
  storageBucket: "routina-f8905.firebasestorage.app",
  messagingSenderId: "672457430615",
  appId: "1:672457430615:web:f911971bac14f46cce7512"
};

// Next.js এর Hot Reloading সমস্যার কারণে বারবার অ্যাপ initialize হওয়া থেকে বিরত রাখার জন্য এই পদ্ধতি ব্যবহার করা হয়।
// একে Singleton Pattern বলা হয়।
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore ডেটাবেস instance তৈরি করা হচ্ছে
const db: Firestore = getFirestore(app);

// Firebase Authentication instance তৈরি করা হচ্ছে
const auth: Auth = getAuth(app);

// অন্যান্য ফাইলে ব্যবহারের জন্য db এবং auth কে export করা হচ্ছে
export { db, auth };
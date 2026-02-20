// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCn5bpGsafxNxFgR0dzGIzM1CkgrPdtlnc",
  authDomain: "mmpi2-a998b.firebaseapp.com",
  projectId: "mmpi2-a998b",
  storageBucket: "mmpi2-a998b.firebasestorage.app",
  messagingSenderId: "409413124873",
  appId: "1:409413124873:web:fce3c41c27e02706cc09d8",
  measurementId: "G-P10V0DG9HD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;

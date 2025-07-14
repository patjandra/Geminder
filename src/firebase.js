// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnFnKibDQDFvarw9kV40dOmWQTEVCj1v4",
  authDomain: "geminder-2025.firebaseapp.com",
  projectId: "geminder-2025",
  storageBucket: "geminder-2025.firebasestorage.app",
  messagingSenderId: "309417965111",
  appId: "1:309417965111:web:b4f8f1e5121c5ab636b1b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); // Firestore
export const auth = getAuth(app);    // Auth
export const provider = new GoogleAuthProvider(); // Google Sign-In provider
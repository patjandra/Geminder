import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnFnKibDQDFvarw9kV40dOmWQTEVCj1v4",
  authDomain: "geminder-2025.firebaseapp.com",
  projectId: "geminder-2025",
  storageBucket: "geminder-2025.firebasestorage.app",
  messagingSenderId: "309417965111",
  appId: "1:309417965111:web:b4f8f1e5121c5ab636b1b2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); 
export const provider = new GoogleAuthProvider();
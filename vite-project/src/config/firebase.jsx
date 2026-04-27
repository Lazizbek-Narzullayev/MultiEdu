// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABbbPCUuxDWguJ9x26pIdPeFOnguuFTTw",
  authDomain: "reactapp-auth-c1615.firebaseapp.com",
  projectId: "reactapp-auth-c1615",
  storageBucket: "reactapp-auth-c1615.firebasestorage.app",
  messagingSenderId: "549183749687",
  appId: "1:549183749687:web:420a11bbaa1645631a09b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };












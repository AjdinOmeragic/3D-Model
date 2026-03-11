import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJeqemfgPG46NSF7EDYqsQ0IHAeL6qWds",
  authDomain: "nelsoncabinetry.firebaseapp.com",
  projectId: "nelsoncabinetry",
  storageBucket: "nelsoncabinetry.firebasestorage.app",
  messagingSenderId: "949382471456",
  appId: "1:949382471456:web:d8c8e38d1ea2fb3586c145"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC034wwF0-cE7kFjtQDgZBW4U5Dgu-v5mE",
  authDomain: "rent-website-8563d.firebaseapp.com",
  projectId: "rent-website-8563d",
  storageBucket: "rent-website-8563d.firebasestorage.app",
  messagingSenderId: "242405594430",
  appId: "1:242405594430:web:7b794143e9f76bdb82486f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

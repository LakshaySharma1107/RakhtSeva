// src/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMLvHAC_1kOygiWZx2-BEI_hgtpRftSUI",
  authDomain: "rakht-app.firebaseapp.com",
  projectId: "rakht-app",
  storageBucket: "rakht-app.appspot.com", // fixed this too
  messagingSenderId: "682784488149",
  appId: "1:682784488149:web:72016afa4b4636debd405c",
  measurementId: "G-XL5Y60XB16",
  databaseURL: "https://rakht-app-default-rtdb.firebaseio.com" // cleaned this up
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

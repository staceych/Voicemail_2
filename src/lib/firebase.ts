// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-4552693243-98863",
  "appId": "1:596086595307:web:3eb1f1f6a7430ce39068ae",
  "apiKey": "AIzaSyAViJUMdSHLoawebc5mF_8p-cZabC4x02c",
  "authDomain": "studio-4552693243-98863.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "596086595307"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export { app, auth };

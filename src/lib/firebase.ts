// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your new Firebase project's configuration.
const firebaseConfig = {
  // "projectId": "...",
  // "appId": "...",
  // "apiKey": "...",
  // "authDomain": "...",
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export { app };

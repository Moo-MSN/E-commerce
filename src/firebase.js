// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVvJCSXG_W6SJKGMXulshftoZzhiiFIvQ",
  authDomain: "easy-commerce-by-moo-msn.firebaseapp.com",
  databaseURL: "https://easy-commerce-by-moo-msn-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "easy-commerce-by-moo-msn",
  storageBucket: "easy-commerce-by-moo-msn.firebasestorage.app",
  messagingSenderId: "660765046404",
  appId: "1:660765046404:web:93e22ed5a7652a17ddf4d1",
  measurementId: "G-45K2FW85DZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
connectFirestoreEmulator(db, "127.0.0.1",8080);

export { db };

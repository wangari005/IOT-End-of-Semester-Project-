// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWPahs9CTEsd_mZaYHFcS0f4VpMz5kVa4",
  authDomain: "agriculturedatacollection.firebaseapp.com",
  databaseURL: "https://agriculturedatacollection-default-rtdb.firebaseio.com",
  projectId: "agriculturedatacollection",
  storageBucket: "agriculturedatacollection.firebasestorage.app",
  messagingSenderId: "938327371167",
  appId: "1:938327371167:web:0585a5934e1516b9dea1aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Connect to Realtime Database
const db = getDatabase(app);

// Export database connection
export { db };
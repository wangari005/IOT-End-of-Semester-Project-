// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhavSj0TZDdzSlCcv7QkTOMZCxrPqqUbs",
  authDomain: "iot-project-d9538.firebaseapp.com",
  databaseURL: "https://iot-project-d9538-default-rtdb.firebaseio.com",
  projectId: "iot-project-d9538",
  storageBucket: "iot-project-d9538.firebasestorage.app",
  messagingSenderId: "158264930597",
  appId: "1:158264930597:web:fb73e6b7a64b39d5c4aacc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Connect to Realtime Database
const db = getDatabase(app);

// Export database connection
export { db };
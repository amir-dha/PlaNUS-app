// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh6f-ePbhkTzfMtv7O3c5AQ39HL22nQrI",
  authDomain: "planus-app-65d36.firebaseapp.com",
  projectId: "planus-app-65d36",
  storageBucket: "planus-app-65d36.appspot.com",
  messagingSenderId: "988833197342",
  appId: "1:988833197342:web:e1d1b0275a5e68943dad0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
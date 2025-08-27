// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-OR2kC0P0z6XHXm_i6AoG_5ZBtyxdfJE",
  authDomain: "defiant-jazz.firebaseapp.com",
  projectId: "defiant-jazz",
  storageBucket: "defiant-jazz.firebasestorage.app",
  messagingSenderId: "567826369392",
  appId: "1:567826369392:web:c2479b2479598d1c00ddb5",
  measurementId: "G-93QHB7TZVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();

export {app, auth, googleProvider}
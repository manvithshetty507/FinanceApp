
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAg1AhUksGYXbcXOZpR4jGnrYTqznPOKwk",
  authDomain: "financetracker-70184.firebaseapp.com",
  projectId: "financetracker-70184",
  storageBucket: "financetracker-70184.appspot.com",
  messagingSenderId: "58828399170",
  appId: "1:58828399170:web:80311e9f37ee2de6be03db"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const provider = new GoogleAuthProvider()


export {auth, db, provider, storage}
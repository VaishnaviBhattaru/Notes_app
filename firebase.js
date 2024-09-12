
import { initializeApp } from "firebase/app";
import { getFirestore,collection } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBpyp8GFnLe7N7G7sId7iFsCCirygAX6PI",
  authDomain: "notes-app-65d8e.firebaseapp.com",
  projectId: "notes-app-65d8e",
  storageBucket: "notes-app-65d8e.appspot.com",
  messagingSenderId: "45514930042",
  appId: "1:45514930042:web:da3a758dde3270760148c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app)
export const notesCollection = collection(db, "notes")
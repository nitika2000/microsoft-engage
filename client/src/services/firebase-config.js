import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDLOqukbn-gcLUSe4rJuTfJj-ONQblJ3pE",
  authDomain: "ms-engage-11f78.firebaseapp.com",
  projectId: "ms-engage-11f78",
  storageBucket: "ms-engage-11f78.appspot.com",
  messagingSenderId: "623195073013",
  appId: "1:623195073013:web:c9647f36a8ada10ab898bc",
  measurementId: "G-CG4QHTEZ86",
});

const db = getFirestore(firebaseApp);
export default db;

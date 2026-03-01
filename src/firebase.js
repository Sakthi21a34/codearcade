import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCsjxNH635wAGTvtpQHa_2OwX9VUnnrQfI",
    authDomain: "portfolio-e8813.firebaseapp.com",
    projectId: "portfolio-e8813",
    storageBucket: "portfolio-e8813.firebasestorage.app",
    messagingSenderId: "316441822058",
    appId: "1:316441822058:web:353e617e1ccb3636d2db13"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

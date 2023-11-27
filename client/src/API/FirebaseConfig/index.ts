
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Define the type for the firebaseConfig object
const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "socioverse-80932.firebaseapp.com",
    projectId: "socioverse-80932",
    storageBucket: "socioverse-80932.appspot.com",
    messagingSenderId: "633826874091",
    appId: "1:633826874091:web:f3133f4e692db124a024ae",
    measurementId: "G-40H3CRDDFG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };

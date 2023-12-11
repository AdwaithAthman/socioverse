
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import configKeys from "../../Constants/config";

// Define the type for the firebaseConfig object
const firebaseConfig: FirebaseOptions = {
    apiKey: configKeys.FIREBASE_API_KEY,
    authDomain: configKeys.FIREBASE_AUTH_DOMAIN,
    projectId: configKeys.FIREBASE_PROJECT_ID,
    storageBucket: configKeys.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: configKeys.FIREBASE_MESSAGING_SENDER_ID,
    appId: configKeys.FIREBASE_APP_ID,
    measurementId: configKeys.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };

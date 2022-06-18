import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

export function FirebaseConfig() {
    const app = initializeApp( {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    });

    const auth = getAuth(app);

    const db = getFirestore(app);

    const googleProvider = new GoogleAuthProvider();

    return {
        auth,
        db,
        googleProvider,
    }
}